import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UserList from '../screens/UserList';
import Profile from '../screens/Profile';
import { navigationKeys } from '../constants/navigationKeys';
import { Icons } from '../assets/icons';
import { Fonts, FontSize } from '../assets/fonts';
import { AppColors } from '../theme/AppColors';
import { AppHeight, AppShadow } from '../constants/commonStyle';

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
    return (
        <BottomTab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconSource;
                    let iconSize = focused ? 24 : 20;
                    let iconStyle = { tintColor: color, width: iconSize, height: iconSize };

                    switch (route.name) {
                        case navigationKeys.UserList:
                            iconSource = Icons.icnUsers;
                            break;
                        case navigationKeys.Profile:
                            iconSource = Icons.icnProfile;
                            break;
                        default:
                            iconSource = Icons.icnUsers;
                    }

                    return (
                        <Image
                            source={iconSource}
                            style={[styles.tabIcon, iconStyle]}
                        />
                    );
                },
                tabBarActiveTintColor: '#000',
                tabBarInactiveTintColor: '#999',
                tabBarLabel: ({ focused, color, children }) => (
                    <Text style={[styles.tabLabel, { color }]}>
                        {children}
                    </Text>
                ),
                tabBarStyle: styles.tabBar,
                tabBarItemStyle: styles.tabBarItem,
                headerShown: false,
            })}
        >
            <BottomTab.Screen
                name={navigationKeys.UserList}
                component={UserList}
                options={{ tabBarLabel: 'Users' }}
            />

            <BottomTab.Screen
                name={navigationKeys.Profile}
                component={Profile}
                options={{ tabBarLabel: 'Profile' }}
            />
        </BottomTab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        height: AppHeight._90,
        backgroundColor: AppColors.basicWhite,
        borderTopWidth: 1,
        borderTopColor: AppColors.basicGray,
        paddingBottom: 5,
        paddingTop: 5,
        ...AppShadow,
    },
    tabBarItem: {
        paddingVertical: 5,
    },
    tabIcon: {
        width: 22,
        height: 22,
        resizeMode: 'contain',
    },
    tabLabel: {
        fontSize: FontSize._12,
        fontFamily: Fonts.MEDIUM,
        marginTop: 2,
    },
});