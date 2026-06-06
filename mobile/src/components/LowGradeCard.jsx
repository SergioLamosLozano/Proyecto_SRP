import React, { useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Animated,
    Platform
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../styles/colors';

const LowGradeCard = ({ subjectName, grade, onPress }) => {
    const scaleValue = useRef(new Animated.Value(1)).current;
    const opacityValue = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.parallel([
            Animated.spring(scaleValue, {
                toValue: 0.98,
                useNativeDriver: true,
            }),
            Animated.timing(opacityValue, {
                toValue: 0.9,
                duration: 150,
                useNativeDriver: true,
            })
        ]).start();
    };

    const handlePressOut = () => {
        Animated.parallel([
            Animated.spring(scaleValue, {
                toValue: 1,
                friction: 3,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.timing(opacityValue, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            })
        ]).start();
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleValue }], opacity: opacityValue }}>
            <TouchableOpacity
                activeOpacity={1}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={onPress}
                style={styles.card}
            >
                <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name="alert-circle-outline" size={28} color={colors.primary} />
                </View>
                
                <View style={styles.contentContainer}>
                    <View style={styles.headerRow}>
                        <Text style={styles.cardTitle}>Nota Baja Detectada</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>Requiere atención</Text>
                        </View>
                    </View>
                    
                    <Text style={styles.subjectInfo}>
                        {subjectName} - <Text style={styles.gradeText}>Calificación: {grade.toFixed(1)}</Text>
                    </Text>
                </View>

                <MaterialCommunityIcons name="chevron-right" size={20} color={colors.primary} />
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFF1F1', // Very soft red
        borderRadius: 20,
        padding: 18,
        marginBottom: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FFCDD2',
        borderLeftWidth: 6,
        borderLeftColor: colors.primary,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 3,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    contentContainer: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        flexWrap: 'wrap',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: colors.primary,
        marginRight: 8,
    },
    badge: {
        backgroundColor: 'rgba(211, 47, 47, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.primary,
        textTransform: 'uppercase',
    },
    subjectInfo: {
        fontSize: 14,
        color: colors.text,
        fontWeight: '500',
    },
    gradeText: {
        fontWeight: '800',
        color: colors.primary,
    },
});

export default LowGradeCard;
