import React from 'react'
import {
    TouchableOpacity,
    Text,
    ActivityIndicator,
    StyleSheet,
    StyleProp,
    ViewStyle,
} from 'react-native'
import { AppColors } from '../../theme/AppColors'
import { Fonts, FontSize } from '../../assets/fonts'
import { AppMargin } from '../../constants/commonStyle'

type Variant = 'primary' | 'secondary' | 'danger' | 'outline'

interface AppButtonProps {
    title: string
    onPress: () => void
    variant?: Variant
    loading?: boolean
    disabled?: boolean
    style?: StyleProp<ViewStyle>
    fullWidth?: boolean
}

export default function AppButton({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    style,
    fullWidth = false,
}: AppButtonProps) {
    const bgColor = {
        primary: AppColors.primary100,
        secondary: AppColors.secondary100,
        danger: AppColors.warningRed,
        outline: 'transparent',
    }[variant]

    const textColor = variant === 'outline' ? AppColors.primary100 : '#fff'
    const borderColor = variant === 'outline' ? AppColors.primary100 : 'transparent'

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: bgColor, borderColor, alignSelf: fullWidth ? 'stretch' : 'auto' },
                (disabled || loading) && styles.disabled,
                style,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading
                ? <ActivityIndicator color={textColor} size="small" />
                : <Text style={[styles.label, { color: textColor }]}>{title}</Text>
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: AppMargin._10,
        paddingHorizontal: AppMargin._20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        minHeight: 48,
    },
    disabled: {
        opacity: 0.6,
    },
    label: {
        fontSize: FontSize._15,
        fontFamily: Fonts.MEDIUM,
    },
})
