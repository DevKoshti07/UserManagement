import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
    email: Yup.string()
        .trim()
        .email('Please enter a valid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
});

export const addUserSchema = Yup.object().shape({
    name: Yup.string().trim().min(2, 'Too Short!').required('Name is required'),
    email: Yup.string().trim().email('Invalid email').required('Email is required'),
    role: Yup.string().trim().required('Role is required'),
    password: Yup.string()
        .when('isNew', {
            is: true,
            then: (schema) => schema.min(4, 'Min 4 chars').required('Password required'),
            otherwise: (schema) => schema.notRequired(),
        }),
});
