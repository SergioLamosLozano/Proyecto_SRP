import React, { useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Modal,
    TouchableOpacity,
    Animated,
    Dimensions
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../styles/colors';

const CustomAlert = ({ visible, type, title, message, onClose, showCancel, onCancel, cancelText = "Cancelar", okText = "OK" }) => {
    const scaleValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.spring(scaleValue, {
                toValue: 1,
                useNativeDriver: true,
                friction: 7,
                tension: 40,
            }).start();
        } else {
            Animated.timing(scaleValue, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Animated.View style={[styles.alertContainer, { transform: [{ scale: scaleValue }] }]}>
                    <View style={styles.iconContainer}>
                        {type === 'success' ? (
                            <View style={[styles.iconCircle, { borderColor: colors.success }]}>
                                <MaterialCommunityIcons name="check" size={60} color={colors.success} />
                            </View>
                        ) : type === 'info' ? (
                            <View style={[styles.iconCircle, { borderColor: colors.primary }]}>
                                <MaterialCommunityIcons name="fingerprint" size={60} color={colors.primary} />
                            </View>
                        ) : (
                            <View style={[styles.iconCircle, { borderColor: colors.error }]}>
                                <MaterialCommunityIcons name="close" size={60} color={colors.error} />
                            </View>
                        )}
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttonRow}>
                        {showCancel && (
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={onCancel}
                            >
                                <Text style={styles.cancelButtonText}>{cancelText}</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: type === 'success' ? colors.success : colors.primary }]}
                            onPress={onClose}
                        >
                            <Text style={styles.buttonText}>{okText}</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertContainer: {
        width: Dimensions.get('window').width * 0.85,
        backgroundColor: colors.white,
        borderRadius: 24,
        padding: 30,
        alignItems: 'center',
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 15,
        elevation: 10,
    },
    iconContainer: {
        marginBottom: 20,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 10,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: colors.textMuted,
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 22,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 12,
        minWidth: 100,
        alignItems: 'center',
        marginHorizontal: 10,
    },
    cancelButton: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    cancelButtonText: {
        color: colors.textMuted,
        fontSize: 16,
        fontWeight: '600',
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
});

export default CustomAlert;
