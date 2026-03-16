import React, { useEffect, useCallback, useRef } from 'react'
import {
    View,
    FlatList,
    StyleSheet,
    RefreshControl,
    TouchableOpacity,
    Text,
    ActivityIndicator,
} from 'react-native'
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux'
import type { RootState } from '../../store'
import {
    setUsers,
    appendUsers,
    setLoading,
    setLoadingMore,
    setError,
    setSelectedUser,
    User,
} from '../../store/reducers/usersSlice'
import { NavAction } from '../../utils/navigationService'
import { navigationKeys } from '../../constants/navigationKeys'
import UserCard from '../../components/UserCard'
import EmptyState from '../../components/EmptyState'
import { AppColors } from '../../theme/AppColors'
import { Config } from '../../config'
import { Fonts, FontSize } from '../../assets/fonts'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AppShadow } from '../../constants/commonStyle'

function SkeletonCard() {
    return (
        <View style={styles.skeletonCard}>
            <View style={styles.skeletonAvatar} />
            <View style={styles.skeletonInfo}>
                <View style={styles.skeletonLine} />
                <View style={[styles.skeletonLine, { width: '60%', marginTop: 8 }]} />
            </View>
        </View>
    )
}

export default function UserList() {
    const dispatch = useAppDispatch()
    const { users, page, limit, hasMore, loading, loadingMore, error } = useAppSelector((s: RootState) => s.users)
    const isFetchingRef = useRef(false)

    const fetchUsers = useCallback(async (currentPage: number, refresh = false) => {
        if (isFetchingRef.current) return
        isFetchingRef.current = true

        if (currentPage === 1) {
            dispatch(setLoading(true))
        } else {
            dispatch(setLoadingMore(true))
        }
        dispatch(setError(null))

        try {
            const response = await fetch(`${Config.BASE_URL}/?page=${currentPage}&results=${limit}`)
            if (!response.ok) throw new Error('API Error')
            const data = await response.json()

            const results = data.results || []
            const fetchedUsers: User[] = results.map((u: any) => ({
                id: u.login?.uuid || String(Math.random()),
                name: `${u.name?.first || ''} ${u.name?.last || ''}`.trim(),
                email: u.email || '',
                role: 'customer',
                avatar: u.picture?.large || 'https://i.pravatar.cc/150',
            }))

            const newHasMore = fetchedUsers.length === limit && currentPage < 10

            if (currentPage === 1 || refresh) {
                dispatch(setUsers({
                    users: fetchedUsers,
                    page: currentPage,
                    hasMore: newHasMore,
                }))
            } else {
                dispatch(appendUsers({
                    users: fetchedUsers,
                    page: currentPage,
                    hasMore: newHasMore,
                }))
            }
        } catch (e) {
            dispatch(setError('Failed to load users. Check your connection.'))
        } finally {
            dispatch(setLoading(false))
            dispatch(setLoadingMore(false))
            isFetchingRef.current = false
        }
    }, [dispatch, limit])

    useEffect(() => {
        fetchUsers(1)
    }, [fetchUsers])

    const handleRefresh = () => {
        fetchUsers(1, true)
    }

    const handleLoadMore = () => {
        if (!loadingMore && !loading && hasMore && !isFetchingRef.current) {
            fetchUsers(page + 1)
        }
    }

    const handleRowPress = (user: User) => {
        dispatch(setSelectedUser(user))
        NavAction.navigate(navigationKeys.UserDetail, { userId: user.id })
    }

    const handleAddUser = () => {
        NavAction.navigate(navigationKeys.AddEditUser, { mode: 'add' })
    }

    const renderFooter = () => {
        if (!loadingMore) return null
        return <ActivityIndicator style={styles.footerLoader} color={AppColors.primary100} size="small" />
    }

    if (loading && users.length === 0) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.headerBar}>
                    <Text style={styles.headerTitle}>Users</Text>
                </View>
                {[1, 2, 3, 4, 5].map(i => <SkeletonCard key={i} />)}
            </SafeAreaView>
        )
    }

    if (error && users.length === 0) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.headerBar}>
                    <Text style={styles.headerTitle}>Users</Text>
                </View>
                <EmptyState
                    emoji="⚠️"
                    title="Something went wrong"
                    subtitle={error}
                    actionLabel="Retry"
                    onAction={() => fetchUsers(1)}
                />
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.headerBar}>
                <Text style={styles.headerTitle}>Users</Text>
            </View>

            {error ? (
                <View style={styles.errorBanner}>
                    <Text style={styles.errorBannerText}>Showing cached data · {error}</Text>
                </View>
            ) : null}

            <FlatList
                data={users}
                keyExtractor={item => String(item.id)}
                renderItem={({ item }) => (
                    <UserCard user={item} onPress={handleRowPress} />
                )}
                contentContainerStyle={users.length === 0 ? styles.emptyContainer : styles.listContent}
                ListEmptyComponent={
                    <EmptyState
                        emoji="👤"
                        title="No Users Found"
                        subtitle="Pull down to refresh"
                    />
                }
                ListFooterComponent={renderFooter}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.1}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={handleRefresh}
                        tintColor={AppColors.primary100}
                        colors={[AppColors.primary100]}
                    />
                }
                showsVerticalScrollIndicator={false}
            />

            <TouchableOpacity style={styles.fab} onPress={handleAddUser} activeOpacity={0.85}>
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.basicWhite5,
    },
    headerBar: {
        backgroundColor: AppColors.basicWhite5,
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.basicGray2,
    },
    headerTitle: {
        fontSize: FontSize._22,
        fontFamily: Fonts.BOLD,
        color: AppColors.basicBlack,
    },
    listContent: {
        paddingTop: 10,
        paddingBottom: 100,
    },
    emptyContainer: {
        flexGrow: 1,
    },
    footerLoader: {
        paddingVertical: 20,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: AppColors.primary100,
        alignItems: 'center',
        justifyContent: 'center',
        ...AppShadow,
    },
    fabIcon: {
        fontSize: 30,
        color: AppColors.basicWhite,
    },
    errorBanner: {
        backgroundColor: '#fff3cd',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    errorBannerText: {
        fontSize: FontSize._12,
        fontFamily: Fonts.REGULAR,
        color: '#856404',
    },
    skeletonCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginHorizontal: 16,
        marginVertical: 6,
        borderRadius: 12,
    },
    skeletonAvatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#e8e8e8',
    },
    skeletonInfo: {
        flex: 1,
        marginLeft: 14,
    },
    skeletonLine: {
        height: 14,
        borderRadius: 7,
        backgroundColor: '#e8e8e8',
        width: '80%',
    },
})
