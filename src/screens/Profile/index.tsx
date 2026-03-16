import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux'
import { logout } from '../../store/reducers/authSlice'
import { NavAction } from '../../utils/navigationService'
import { navigationKeys } from '../../constants/navigationKeys'
import { AppColors } from '../../theme/AppColors'
import { Fonts, FontSize } from '../../assets/fonts'
import AppButton from '../../components/AppButton'
import { AppShadow } from '../../constants/commonStyle'

export default function Profile() {
    const dispatch = useAppDispatch()
    const userData = useAppSelector(s => s.auth.userData)

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: () => {
                    dispatch(logout())
                    NavAction.reset(0, [{ name: navigationKeys.LoginScreen }])
                },
            },
        ])
    }

    const email = userData?.email ?? 'N/A'
    const initials = email.charAt(0).toUpperCase()

    return (
        <SafeAreaView style={styles.container} edges={['top']}>

            <View style={styles.headerBar}>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>


            <View style={styles.avatarSection}>
                <View style={styles.avatarCircle}>
                    <Text style={styles.avatarInitial}>{initials}</Text>
                </View>
                <Text style={styles.nameText}>Welcome back!</Text>
                <Text style={styles.emailText}>{email}</Text>
            </View>


            <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue} numberOfLines={1}>{email}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Role</Text>
                    <Text style={styles.infoValue}>Admin</Text>
                </View>
            </View>


            <View style={styles.logoutContainer}>
                <AppButton
                    title="Logout"
                    onPress={handleLogout}
                    variant="danger"
                    fullWidth
                />
            </View>
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
    avatarSection: {
        alignItems: 'center',
        backgroundColor: AppColors.basicWhite5,
        paddingTop: 32,
        paddingBottom: 28,
        marginBottom: 16,
    },
    avatarCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: AppColors.primary100,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
    },
    avatarInitial: {
        fontSize: FontSize._33,
        fontFamily: Fonts.BOLD,
        color: AppColors.basicWhite,
    },
    nameText: {
        fontSize: FontSize._18,
        fontFamily: Fonts.BOLD,
        color: AppColors.basicBlack,
        marginBottom: 4,
    },
    emailText: {
        fontSize: FontSize._14,
        fontFamily: Fonts.REGULAR,
        color: AppColors.black80,
    },
    infoCard: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        borderRadius: 12,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
    },
    infoLabel: {
        fontSize: FontSize._14,
        fontFamily: Fonts.MEDIUM,
        color: AppColors.black80,
    },
    infoValue: {
        fontSize: FontSize._14,
        fontFamily: Fonts.REGULAR,
        color: AppColors.basicBlack,
        flex: 1,
        textAlign: 'right',
    },
    divider: {
        height: 1,
        backgroundColor: AppColors.basicGray,
    },
    activeBadge: {
        backgroundColor: AppColors.warningGreen + '22',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 20,
    },
    activeBadgeText: {
        fontSize: FontSize._12,
        fontFamily: Fonts.MEDIUM,
        color: AppColors.warningGreen,
    },
    logoutContainer: {
        paddingHorizontal: 16,
        marginTop: 'auto',
        paddingBottom: 8,
    },
})