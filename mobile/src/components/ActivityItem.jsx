import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../styles/colors';

const ActivityItem = ({ activity }) => {
    return (
        <View style={styles.container}>
            <View style={[styles.statusIndicator, { backgroundColor: activity.grade >= 3.0 ? colors.success : colors.error }]} />
            <View style={styles.iconBox}>
                <MaterialCommunityIcons name={activity.subjectIcon} size={24} color={colors.primary} />
            </View>
            <View style={styles.content}>
                <Text style={styles.subjectName}>{activity.subjectName}</Text>
                <Text style={styles.activityName} numberOfLines={1}>{activity.activity}</Text>
            </View>
            <View style={styles.gradeBox}>
                <Text style={styles.gradeText}>{activity.grade}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    statusIndicator: {
        width: 4,
        height: '100%',
        borderRadius: 2,
        marginRight: 12,
    },
    iconBox: {
        width: 45,
        height: 45,
        borderRadius: 10,
        backgroundColor: '#F5F5F7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
    subjectName: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.primary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    activityName: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.text,
        marginTop: 2,
    },
    gradeBox: {
        backgroundColor: '#FFEBEE',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 10,
        marginLeft: 10,
    },
    gradeText: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.primary,
    },
});

export default ActivityItem;
