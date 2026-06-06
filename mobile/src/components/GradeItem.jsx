import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import colors from '../styles/colors';

const GradeItem = ({ activity, grade }) => {
    const numericGrade = parseFloat(grade);
    let bgColor = '#FFF0F0';
    let borderColor = colors.error;
    let textColor = colors.error;

    if (numericGrade >= 4.0) {
        bgColor = '#F1F8E9';
        borderColor = colors.success;
        textColor = colors.success;
    } else if (numericGrade >= 3.0) {
        bgColor = '#FFFDE7';
        borderColor = '#FBC02D';
        textColor = '#F57F17';
    }

    return (
        <View style={[styles.container, { backgroundColor: bgColor, borderColor: borderColor }]}>
            <View style={styles.info}>
                <Text style={styles.activity}>{activity}</Text>
                <Text style={styles.label}>Calificación</Text>
            </View>
            <View style={[styles.gradeBadge, { backgroundColor: textColor + '20' }]}>
                <Text style={[styles.grade, { color: textColor }]}>{grade}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        borderWidth: 1.5,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    info: {
        flex: 1,
    },
    activity: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
    },
    label: {
        fontSize: 12,
        color: colors.textMuted,
        marginTop: 4,
        fontWeight: '500',
    },
    gradeBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    grade: {
        fontSize: 18,
        fontWeight: '900',
    },
});

export default GradeItem;
