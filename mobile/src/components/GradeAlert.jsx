import React, { useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Modal,
    TouchableOpacity,
    Animated,
    Dimensions,
    Platform
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import colors from '../styles/colors';

const { width, height } = Dimensions.get('window');

const GradeAlert = ({ 
    visible, 
    subjectName, 
    grade, 
    activityName, 
    onView, 
    onNext, 
    onCancel, 
    isLast,
    totalAlerts
}) => {
    const scaleValue = useRef(new Animated.Value(0)).current;
    const opacityValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scaleValue, {
                    toValue: 1,
                    useNativeDriver: true,
                    friction: 8,
                    tension: 40,
                }),
                Animated.timing(opacityValue, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(scaleValue, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityValue, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [visible]);

    if (!visible && opacityValue._value === 0) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                {/* Blur background for premium feel */}
                <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                
                <Animated.View 
                    style={[
                        styles.alertContainer, 
                        { 
                            opacity: opacityValue,
                            transform: [{ scale: scaleValue }] 
                        }
                    ]}
                >
                    {/* Institutional Red Border Indicator */}
                    <View style={styles.topIndicator} />

                    <View style={styles.content}>
                        <View style={styles.header}>
                            <MaterialCommunityIcons name="alert-decagram" size={32} color={colors.primary} />
                            <Text style={styles.subjectTitle}>{subjectName}</Text>
                        </View>

                        <Text style={styles.message}>Se ha registrado una nota baja</Text>

                        {/* Grade Circle */}
                        <View style={styles.gradeContainer}>
                            <View style={styles.gradeCircle}>
                                <Text style={styles.gradeText}>{grade.toFixed(1)}</Text>
                            </View>
                        </View>

                        <View style={styles.activityInfo}>
                            <Text style={styles.activityLabel}>Actividad:</Text>
                            <Text style={styles.activityName}>{activityName}</Text>
                        </View>

                        <View style={styles.footerBadge}>
                            <MaterialCommunityIcons name="shield-alert" size={16} color={colors.primary} />
                            <Text style={styles.footerText}>Requiere atención inmediata</Text>
                        </View>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={styles.viewButton}
                                onPress={onView}
                            >
                                <Text style={styles.viewButtonText}>Ver</Text>
                            </TouchableOpacity>

                            {!isLast ? (
                                <TouchableOpacity
                                    style={styles.nextButton}
                                    onPress={onNext}
                                >
                                    <View style={styles.nextButtonContent}>
                                        <Text style={styles.nextButtonText}>Siguiente</Text>
                                        <MaterialCommunityIcons name="chevron-right" size={20} color={colors.white} />
                                    </View>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={onCancel}
                                >
                                    <Text style={styles.cancelButtonText}>Cerrar</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        
                        {totalAlerts > 1 && (
                            <Text style={styles.counterText}>Alerta pendiente</Text>
                        )}
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertContainer: {
        width: width * 0.88,
        backgroundColor: colors.white,
        borderRadius: 28,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 20,
    },
    topIndicator: {
        height: 6,
        backgroundColor: colors.primary,
        width: '100%',
    },
    content: {
        padding: 24,
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    subjectTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: colors.text,
        marginLeft: 10,
        textTransform: 'uppercase',
    },
    message: {
        fontSize: 16,
        color: colors.textMuted,
        marginBottom: 20,
        fontWeight: '500',
    },
    gradeContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(211, 47, 47, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(211, 47, 47, 0.1)',
    },
    gradeCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: colors.primary,
        ...Platform.select({
            ios: {
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
            },
            android: {
                elevation: 6,
            }
        })
    },
    gradeText: {
        fontSize: 42,
        fontWeight: '900',
        color: colors.primary,
    },
    activityInfo: {
        alignItems: 'center',
        marginBottom: 20,
    },
    activityLabel: {
        fontSize: 12,
        color: colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    activityName: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
        textAlign: 'center',
    },
    footerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(211, 47, 47, 0.08)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 25,
    },
    footerText: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.primary,
        marginLeft: 6,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    viewButton: {
        flex: 1,
        height: 54,
        borderRadius: 16,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    viewButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
    },
    nextButton: {
        flex: 1.5,
        height: 54,
        borderRadius: 16,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nextButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nextButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.white,
        marginRight: 4,
    },
    cancelButton: {
        flex: 1,
        height: 54,
        borderRadius: 16,
        backgroundColor: colors.textMuted,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.white,
    },
    counterText: {
        marginTop: 15,
        fontSize: 12,
        color: colors.textMuted,
        fontStyle: 'italic',
    }
});

export default GradeAlert;
