import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../styles/colors';

const SubjectCard = ({ subject, onPress }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={subject.icon} size={28} color={colors.primary} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.name}>{subject.name}</Text>
                <Text style={styles.average}>Promedio: {subject.average}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={colors.border} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#FFEBEE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
    },
    average: {
        fontSize: 14,
        color: colors.textMuted,
        marginTop: 2,
    },
});

export default SubjectCard;
