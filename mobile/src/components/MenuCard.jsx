import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../styles/colors';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

const MenuCard = ({ title, icon, color, onPress, description }) => {
    return (
        <TouchableOpacity
            style={[styles.card, { borderTopColor: color }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
                <MaterialCommunityIcons name={icon} size={32} color={color} />
            </View>
            <Text style={styles.title}>{title}</Text>
            {description && <Text style={styles.description}>{description}</Text>}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: cardWidth,
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        borderTopWidth: 4,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
        alignItems: 'center',
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
        textAlign: 'center',
    },
    description: {
        fontSize: 12,
        color: colors.textMuted,
        textAlign: 'center',
        marginTop: 5,
    },
});

export default MenuCard;
