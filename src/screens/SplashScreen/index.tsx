import { StyleSheet, Text, View, Animated, StatusBar } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { NavAction } from '../../utils/navigationService';
import { navigationKeys } from '../../constants/navigationKeys';
import { useAppSelector } from '../../hooks/useRedux';
import type { RootState } from '../../store';
import { Fonts, FontSize } from '../../assets/fonts';
import { AppColors } from '../../theme/AppColors';
import { AppShadow } from '../../constants/commonStyle';

export default function SplashScreen() {
    const isLogin = useAppSelector((s: RootState) => s.auth.isLogin);
    const scaleAnim = useRef(new Animated.Value(0.5)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 6,
                tension: 40,
                useNativeDriver: true,
            })
        ]).start();

        const timer = setTimeout(() => {
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }).start(() => {
                if (isLogin) {
                    NavAction.replace(navigationKeys.BottomTabNavigator);
                } else {
                    NavAction.replace(navigationKeys.LoginScreen);
                }
            });
        }, 2200);

        return () => clearTimeout(timer);
    }, [isLogin, opacityAnim, scaleAnim]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={AppColors.primary100} />
            <Animated.View style={[
                styles.logoContainer,
                {
                    opacity: opacityAnim,
                    transform: [{ scale: scaleAnim }]
                }
            ]}>
                <View style={styles.iconCircle}>
                    <Text style={styles.iconLetter}>P</Text>
                </View>
                <Text style={styles.logo}>PeopleManager</Text>
                <Text style={styles.subtitle}>Manage your people</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: AppColors.primary100,
    },
    logoContainer: {
        alignItems: 'center',
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: AppColors.basicWhite,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        ...AppShadow,
    },
    iconLetter: {
        fontSize: FontSize._40,
        color: AppColors.primary100,
        fontFamily: Fonts.BOLD,
    },
    logo: {
        fontSize: FontSize._30,
        color: AppColors.basicWhite,
        fontFamily: Fonts.BOLD,
        letterSpacing: 1,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: FontSize._12,
        color: AppColors.basicWhite,
        opacity: 0.8,
        letterSpacing: 2,
        fontFamily: Fonts.REGULAR,
        textTransform: 'uppercase',
    }
})