import React, { useState } from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native'
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux'
import type { RootState } from '../../store'
import { removeUser, setSelectedUser } from '../../store/reducers/usersSlice'
import { NavAction } from '../../utils/navigationService'
import { navigationKeys } from '../../constants/navigationKeys'
import AppHeader from '../../components/AppHeader'
import AppButton from '../../components/AppButton'
import { AppColors } from '../../theme/AppColors'
import { Fonts, FontSize } from '../../assets/fonts'
import { _showToast } from '../../services/UIs/toastConfig'

export default function UserDetail() {
    const dispatch = useAppDispatch()
    const user = useAppSelector((s: RootState) => s.users.selectedUser)
    const [deleting, setDeleting] = useState(false)

    if (!user) {
        return (
            <View style={styles.container}>
                <AppHeader title="User Detail" />
                <View style={styles.centered}>
                    <Text style={styles.errorText}>User not found.</Text>
                </View>
            </View>
        )
    }

    const handleEdit = () => {
        NavAction.navigate(navigationKeys.AddEditUser, { mode: 'edit', user })
    }

    const handleDelete = () => {
        Alert.alert(
            'Delete User',
            `Are you sure you want to delete ${user.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: confirmDelete,
                },
            ]
        )
    }

    const confirmDelete = async () => {
        setDeleting(true)
        try {
            await new Promise(resolve => setTimeout(() => resolve(null), 600))

            dispatch(removeUser(user.id))
            dispatch(setSelectedUser(null))
            _showToast(`${user.name} deleted successfully`, 'success')
            NavAction.goBack()
        } catch {
            _showToast('Failed to delete user. Try again.', 'error')
        } finally {
            setDeleting(false)
        }
    }

    const fullName = user.name
    const initials = user.name.charAt(0).toUpperCase()

    return (
        <View style={styles.container}>
            <AppHeader title="User Detail" />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.avatarSection}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: user.avatar }}
                            style={styles.avatar}
                        />
                    </View>
                    <Text style={styles.name}>{fullName}</Text>
                    <Text style={styles.email}>{user.email}</Text>

                </View>

                <View style={styles.infoCard}>
                    <DetailRow label="Name" value={user.name} />
                    <View style={styles.divider} />
                    <DetailRow label="Email" value={user.email} />
                    <View style={styles.divider} />
                    <DetailRow label="ID" value={String(user.id)} />
                    <View style={styles.divider} />
                    <DetailRow label="Role" value={user.role} />
                </View>

                <View style={styles.actions}>
                    <AppButton
                        title="Edit User"
                        onPress={handleEdit}
                        variant="primary"
                        fullWidth
                        style={styles.actionBtn}
                    />
                    <AppButton
                        title={deleting ? 'Deleting…' : 'Delete User'}
                        onPress={handleDelete}
                        variant="danger"
                        loading={deleting}
                        fullWidth
                        style={styles.actionBtn}
                    />
                </View>
            </ScrollView>
        </View>
    )
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <View style={styles.row}>
            <Text style={styles.rowLabel}>{label}</Text>
            <Text style={styles.rowValue}>{value}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.basicWhite5,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        fontSize: FontSize._16,
        fontFamily: Fonts.MEDIUM,
        color: AppColors.black80,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    avatarSection: {
        alignItems: 'center',
        backgroundColor: AppColors.basicWhite5,
        paddingTop: 32,
        paddingBottom: 28,
        marginBottom: 16,
    },
    avatarContainer: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
        borderRadius: 55,
        marginBottom: 16,
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 3,
        borderColor: AppColors.primary100,
    },
    name: {
        fontSize: FontSize._22,
        fontFamily: Fonts.BOLD,
        color: AppColors.basicBlack,
        marginBottom: 4,
    },
    email: {
        fontSize: FontSize._14,
        fontFamily: Fonts.REGULAR,
        color: AppColors.black80,
        marginBottom: 10,
    },
    jobBadge: {
        backgroundColor: AppColors.primary100 + '22',
        paddingHorizontal: 14,
        paddingVertical: 4,
        borderRadius: 20,
    },
    jobText: {
        fontSize: FontSize._13,
        fontFamily: Fonts.MEDIUM,
        color: AppColors.primary100,
    },
    infoCard: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
    },
    rowLabel: {
        fontSize: FontSize._14,
        fontFamily: Fonts.MEDIUM,
        color: AppColors.black80,
    },
    rowValue: {
        fontSize: FontSize._14,
        fontFamily: Fonts.REGULAR,
        color: AppColors.basicBlack,
        flex: 1,
        textAlign: 'right',
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
    },
    actions: {
        paddingHorizontal: 16,
        gap: 12,
    },
    actionBtn: {
        borderRadius: 10,
    },
})
