import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native'
import { useFormik } from 'formik'
import { addUserSchema } from '../../utils/validators'
import { useAppDispatch } from '../../hooks/useRedux'
import { upsertUser, User } from '../../store/reducers/usersSlice'
import { NavAction } from '../../utils/navigationService'
import AppHeader from '../../components/AppHeader'
import AppButton from '../../components/AppButton'
import AppTextInput from '../../components/AppTextInput'
import { AppColors } from '../../theme/AppColors'
import { Fonts, FontSize } from '../../assets/fonts'
import { _showToast } from '../../services/UIs/toastConfig'
import { launchImageLibrary } from 'react-native-image-picker'


export default function AddEditUser({ route }: any) {
    const mode = route.params?.mode || 'add'
    const userToEdit = route.params?.user as User | undefined
    const isEdit = mode === 'edit'
    
    const dispatch = useAppDispatch()
    const [submitting, setSubmitting] = useState(false)
    const [avatar, setAvatar] = useState<string | null>(userToEdit?.avatar || null)

    const formik = useFormik({
        initialValues: {
            name: userToEdit?.name || '',
            email: userToEdit?.email || '',
            role: userToEdit?.role || 'customer',
            password: '',
            isNew: !isEdit,
        },
        validationSchema: addUserSchema,
        onSubmit: async (values) => {
            setSubmitting(true)
            try {
                // randomuser.me is a read-only API, so we mock the POST/PUT
                // by just updating our local Redux store directly.
                
                // Simulate network delay
                await new Promise(resolve => setTimeout(() => resolve(null), 800))

                const finalUser: User = {
                    id: isEdit && userToEdit ? userToEdit.id : String(Date.now() + Math.random()),
                    name: values.name,
                    email: values.email,
                    role: values.role.toLowerCase(),
                    avatar: avatar || 'https://i.pravatar.cc/150',
                    isLocal: true,
                }

                if (!isEdit) {
                    finalUser.password = values.password
                }

                dispatch(upsertUser(finalUser))
                _showToast(`User ${isEdit ? 'updated' : 'added'} successfully`, 'success')
                NavAction.goBack()
            } catch (error: any) {
                _showToast(error.message || 'Something went wrong.', 'error')
            } finally {
                setSubmitting(false)
            }
        },
    })

    const handlePickImage = () => {
        launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
            if (response.assets && response.assets.length > 0) {
                setAvatar(response.assets[0].uri || null)
            }
        })
    }

    return (
        <View style={styles.container}>
            <AppHeader title={isEdit ? 'Edit User' : 'Add User'} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flex}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Avatar picker */}
                    <TouchableOpacity style={styles.avatarPickerContainer} onPress={handlePickImage} activeOpacity={0.8}>
                        <View style={styles.avatarWrapper}>
                            {avatar ? (
                                <Image source={{ uri: avatar }} style={styles.avatarImage} />
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                    <Text style={styles.placeholderIcon}>📷</Text>
                                </View>
                            )}
                            <View style={styles.editBadge}>
                                <Text style={styles.editIcon}>✎</Text>
                            </View>
                        </View>
                        <Text style={styles.avatarHint}>Tap to upload photo</Text>
                    </TouchableOpacity>

                    {/* Form fields */}
                    <View style={styles.formContainer}>
                        <AppTextInput
                            label="Full Name"
                            placeholder="John Doe"
                            value={formik.values.name}
                            onChangeText={formik.handleChange('name')}
                            onBlur={formik.handleBlur('name')}
                            error={formik.touched.name ? (formik.errors.name as string) : undefined}
                        />

                        <AppTextInput
                            label="Email Address"
                            placeholder="john@example.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={formik.values.email}
                            onChangeText={formik.handleChange('email')}
                            onBlur={formik.handleBlur('email')}
                            containerStyle={styles.fieldMargin}
                            error={formik.touched.email ? (formik.errors.email as string) : undefined}
                        />

                        <AppTextInput
                            label="Role"
                            placeholder="e.g. admin or customer"
                            autoCapitalize="none"
                            value={formik.values.role}
                            onChangeText={formik.handleChange('role')}
                            onBlur={formik.handleBlur('role')}
                            containerStyle={styles.fieldMargin}
                            error={formik.touched.role ? (formik.errors.role as string) : undefined}
                        />

                        {!isEdit && (
                            <AppTextInput
                                label="Password"
                                placeholder="Min 4 characters"
                                secureTextEntry
                                value={formik.values.password}
                                onChangeText={formik.handleChange('password')}
                                onBlur={formik.handleBlur('password')}
                                containerStyle={styles.fieldMargin}
                                error={formik.touched.password ? (formik.errors.password as string) : undefined}
                            />
                        )}

                        <AppButton
                            title={isEdit ? 'Save Changes' : 'Create User'}
                            onPress={formik.handleSubmit}
                            loading={submitting}
                            style={styles.submitBtn}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f6fa',
    },
    flex: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
        alignItems: 'center',
    },
    avatarPickerContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: AppColors.primary100,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: AppColors.basicGray,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: AppColors.primary100,
        borderStyle: 'dashed',
    },
    placeholderIcon: {
        fontSize: 32,
    },
    editBadge: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: AppColors.primary100,
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    editIcon: {
        color: '#fff',
        fontSize: 14,
    },
    avatarHint: {
        marginTop: 8,
        fontSize: FontSize._12,
        fontFamily: Fonts.REGULAR,
        color: AppColors.primary100,
    },
    formContainer: {
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 24,
    },
    fieldMargin: {
        marginTop: 16,
    },
    submitBtn: {
        marginTop: 32,
        borderRadius: 12,
    },
})
