import React from 'react'
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
} from 'react-native'
import { AppColors } from '../../theme/AppColors'
import { Fonts, FontSize } from '../../assets/fonts'
import { User } from '../../store/reducers/usersSlice'

interface UserCardProps {
    user: User
    onPress: (user: User) => void
}

export default function UserCard({ user, onPress }: UserCardProps) {
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => onPress(user)}
            activeOpacity={0.75}
        >
            <Image
                source={{ uri: user.avatar }}
                style={styles.avatar}
                defaultSource={require('../../assets/images/imgPicture.png')}
            />
            <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>
                   <Text style={styles.name}>{user.name}</Text>
                </Text>
                <Text style={styles.email} numberOfLines={1}>
                    {user.email}
                </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginHorizontal: 16,
        marginVertical: 6,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: AppColors.basicGray,
    },
    info: {
        flex: 1,
        marginLeft: 14,
    },
    name: {
        fontSize: FontSize._15,
        fontFamily: Fonts.BOLD,
        color: AppColors.basicBlack,
        marginBottom: 3,
    },
    email: {
        fontSize: FontSize._13,
        fontFamily: Fonts.REGULAR,
        color: AppColors.black80,
    },
    chevron: {
        fontSize: 22,
        color: '#ccc',
        fontFamily: Fonts.MEDIUM,
    },
})
