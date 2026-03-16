import React from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AppColors } from '../../theme/AppColors'
import { Fonts, FontSize } from '../../assets/fonts'
import { NavAction } from '../../utils/navigationService'

interface AppHeaderProps {
    title: string
    showBack?: boolean
    onBackPress?: () => void
    rightComponent?: React.ReactNode
}

export default function AppHeader({
    title,
    showBack = true,
    onBackPress,
    rightComponent,
}: AppHeaderProps) {
    const handleBack = () => {
        if (onBackPress) {
            onBackPress()
        } else {
            NavAction.goBack()
        }
    }

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor={AppColors.basicWhite} />
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={styles.container}>
                    {/* Left — Back button */}
                    <View style={styles.side}>
                        {showBack && (
                            <TouchableOpacity
                                onPress={handleBack}
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                style={styles.backButton}
                            >
                                <Text style={styles.backArrow}>{'←'}</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Center — Title */}
                    <Text style={styles.title} numberOfLines={1}>
                        {title}
                    </Text>

                    {/* Right — optional action */}
                    <View style={styles.side}>
                        {rightComponent ?? null}
                    </View>
                </View>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: AppColors.basicWhite,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: AppColors.basicWhite,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    side: {
        width: 44,
    },
    backButton: {
        padding: 4,
    },
    backArrow: {
        fontSize: 22,
        color: AppColors.basicBlack,
        fontFamily: Fonts.MEDIUM,
    },
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: FontSize._18,
        fontFamily: Fonts.BOLD,
        color: AppColors.basicBlack,
    },
})
