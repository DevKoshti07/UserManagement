import {
    StyleSheet, Text, View, TouchableOpacity, Image,
    StatusBar, ActivityIndicator, KeyboardAvoidingView,
    ScrollView, Platform
} from 'react-native'
import React, { useRef } from 'react'
import { TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFormik } from 'formik'
import { loginSchema } from '../../../utils/validators'
import { AppColors } from '../../../theme/AppColors'
import { AppMargin, WindowHeight } from '../../../constants/commonStyle'
import { Fonts, FontSize } from '../../../assets/fonts'
import { Images } from '../../../assets/images'
import { Icons } from '../../../assets/icons'
import { NavAction } from '../../../utils/navigationService'
import { navigationKeys } from '../../../constants/navigationKeys'
import { _showToast } from '../../../services/UIs/toastConfig'
import { useAppDispatch } from '../../../hooks/useRedux'
import { setIsLogin, setUserData } from '../../../store/reducers/authSlice'
import AppTextInput from '../../../components/AppTextInput'

const STATIC_EMAIL = 'admin@gmail.com'
const STATIC_PASSWORD = 'Test@123'

export default function LoginScreen() {

    const dispatch = useAppDispatch()
    const passwordRef = useRef<TextInput>(null)

    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: loginSchema,
        validateOnChange: false,
        validateOnBlur: true,
        onSubmit: (values, { setSubmitting }) => {
            const { email, password } = values

            if (email !== STATIC_EMAIL || password !== STATIC_PASSWORD) {
                _showToast('Invalid email or password', 'error')
                setSubmitting(false)
                return
            }

            setTimeout(() => {
                dispatch(setUserData({ email }))
                dispatch(setIsLogin(true))
                _showToast('Login Success', 'success')
                setTimeout(() => {
                    NavAction.reset(0, [{ name: navigationKeys.BottomTabNavigator }])
                }, 800)
                setSubmitting(false)
            }, 500)
        },
    })

    const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } = formik

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={AppColors.basicWhite} />

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                >
                    <View style={styles.topContainer}>
                        <Text style={styles.appTitle}>Welcome back 👋</Text>
                        <Text style={styles.subtitle}>Sign in to your account</Text>
                    </View>

                    <View style={styles.contentContainer}>
                        <AppTextInput
                            label="Email"
                            placeholder="email@email.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            returnKeyType="next"
                            value={values.email}
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            onSubmitEditing={() => passwordRef.current?.focus()}
                            error={touched.email && errors.email ? errors.email : undefined}
                        />

                        <AppTextInput
                            ref={passwordRef}
                            label="Password"
                            placeholder="Password"
                            isPassword
                            returnKeyType="done"
                            containerStyle={styles.passwordContainer}
                            value={values.password}
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            onSubmitEditing={() => handleSubmit()}
                            error={touched.password && errors.password ? errors.password : undefined}
                        />

                        <TouchableOpacity style={styles.forgotPasswordContainer}>
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.signInContainer, isSubmitting && styles.signInContainerDisabled]}
                            onPress={() => handleSubmit()}
                            disabled={isSubmitting}
                            activeOpacity={0.8}
                        >
                            {isSubmitting
                                ? <ActivityIndicator color="#fff" size="small" />
                                : <Text style={styles.signInText}>Sign In</Text>
                            }
                        </TouchableOpacity>

                        <View style={styles.signUpContainer}>
                            <Text style={styles.signUpText}>Don't have an account? </Text>
                            <TouchableOpacity activeOpacity={0.7}>
                                <Text style={styles.signUpLink}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.dividerContainer}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>or Sign In with:</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <View style={styles.socialContainer}>
                            <TouchableOpacity style={styles.socialButton}>
                                <Image source={Icons.icnGoogle} style={styles.socialIconImage} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialButton}>
                                <Image source={Icons.icnApple} style={styles.socialIconImage} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialButton}>
                                <Image source={Icons.icnFacebook} style={styles.socialIconImage} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.basicWhite,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    topContainer: {
        paddingHorizontal: AppMargin._30,
        paddingTop: 80,
        paddingBottom: 20,
    },
    appTitle: {
        fontSize: 32,
        fontFamily: Fonts.BOLD,
        color: AppColors.basicBlack,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: FontSize._16,
        fontFamily: Fonts.REGULAR,
        color: AppColors.black80,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: AppMargin._30,
        paddingTop: AppMargin._20,
        paddingBottom: AppMargin._40,
    },
    passwordContainer: {
        marginTop: AppMargin._20,
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginBottom: AppMargin._30,
        marginTop: AppMargin._10,
    },
    forgotPasswordText: {
        color: AppColors.primary100,
        fontSize: FontSize._13,
        fontFamily: Fonts.MEDIUM,
    },
    signInContainer: {
        backgroundColor: AppColors.primary100,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: AppMargin._30,
        shadowColor: AppColors.primary100,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 8,
    },
    signInContainerDisabled: {
        opacity: 0.7,
        shadowOpacity: 0.1,
        elevation: 2,
    },
    signInText: {
        color: AppColors.basicWhite,
        fontSize: FontSize._16,
        fontFamily: Fonts.BOLD,
        letterSpacing: 0.5,
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: AppMargin._20,
    },
    signUpText: {
        color: AppColors.black80,
        fontSize: FontSize._14,
        fontFamily: Fonts.REGULAR,
    },
    signUpLink: {
        color: AppColors.primary100,
        fontSize: FontSize._14,
        fontFamily: Fonts.BOLD,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 50,
        marginBottom: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: AppColors.basicGray,
    },
    dividerText: {
        color: AppColors.black80,
        fontSize: FontSize._14,
        fontFamily: Fonts.MEDIUM,
        marginHorizontal: 10,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
    },
    socialButton: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    socialIconImage: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
})
