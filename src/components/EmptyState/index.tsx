import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { AppColors } from '../../theme/AppColors'
import { Fonts, FontSize } from '../../assets/fonts'
import AppButton from '../AppButton'

interface EmptyStateProps {
    emoji?: string
    title: string
    subtitle?: string
    actionLabel?: string
    onAction?: () => void
}

export default function EmptyState({
    emoji = '📭',
    title,
    subtitle,
    actionLabel,
    onAction,
}: EmptyStateProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.emoji}>{emoji}</Text>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            {actionLabel && onAction ? (
                <AppButton
                    title={actionLabel}
                    onPress={onAction}
                    style={styles.button}
                />
            ) : null}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    emoji: {
        fontSize: 56,
        marginBottom: 16,
    },
    title: {
        fontSize: FontSize._18,
        fontFamily: Fonts.BOLD,
        color: AppColors.basicBlack,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: FontSize._14,
        fontFamily: Fonts.REGULAR,
        color: AppColors.black80,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 20,
    },
    button: {
        marginTop: 8,
        paddingHorizontal: 32,
    },
})
