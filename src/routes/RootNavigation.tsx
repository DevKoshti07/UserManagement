import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { navigationKeys } from '../constants/navigationKeys';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import SplashScreen from '../screens/SplashScreen';
import UserDetail from '../screens/UserDetail';
import AddEditUser from '../screens/AddEditUser';
import { navigationRef } from '../utils/navigationService';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createNativeStackNavigator();

export default function RootNavigation() {
    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator initialRouteName={navigationKeys.SplashScreen} screenOptions={{ headerShown: false, gestureEnabled: false }}>
                <Stack.Screen name={navigationKeys.SplashScreen} component={SplashScreen} />
                <Stack.Screen name={navigationKeys.LoginScreen} component={LoginScreen} />
                <Stack.Screen name={navigationKeys.SignUpScreen} component={SignUpScreen} />
                <Stack.Screen name={navigationKeys.BottomTabNavigator} component={BottomTabNavigator} />
                <Stack.Screen
                    name={navigationKeys.UserDetail}
                    component={UserDetail}
                    options={{ gestureEnabled: true }}
                />
                <Stack.Screen
                    name={navigationKeys.AddEditUser}
                    component={AddEditUser}
                    options={{ gestureEnabled: true }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({})