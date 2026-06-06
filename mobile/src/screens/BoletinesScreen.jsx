import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
    Linking,
    Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useSession } from '../context/SessionContext';
import boletinService from '../services/boletinService';
import colors from '../styles/colors';
import { nombrePeriodo } from '../utils/periodo';
// Usar la API legacy de expo-file-system
import * as FileSystem from 'expo-file-system/legacy';
import * as SecureStore from 'expo-secure-store';

// Importar expo-sharing de forma condicional
let Sharing;
try {
    Sharing = require('expo-sharing');
} catch (e) {
    console.warn('expo-sharing no disponible:', e);
    Sharing = null;
}

const BoletinesScreen = ({ navigation }) => {
    const { currentStudent } = useSession();
    const [periodos, setPeriodos] = useState([]);
    const [periodoSeleccionado, setPeriodoSeleccionado] = useState(null);
    const [descargaHabilitada, setDescargaHabilitada] = useState(true);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [currentStudent])
    );

    const loadData = async () => {
        try {
            setLoading(true);
            
            // Cargar estado de descarga
            const estadoResponse = await boletinService.getEstadoDescarga();
            if (estadoResponse.success) {
                setDescargaHabilitada(estadoResponse.data.descarga_habilitada);
            }

            // Cargar periodos
            const periodosResponse = await boletinService.getPeriodos();
            if (periodosResponse.success) {
                setPeriodos(periodosResponse.data);
                if (periodosResponse.data.length > 0) {
                    setPeriodoSeleccionado(periodosResponse.data[0].id_periodo);
                }
            }
        } catch (error) {
            console.error('💥 Error en loadData:', error);
        } finally {
            setLoading(false);
        }
    };

    const descargarBoletin = async () => {
        if (!descargaHabilitada) {
            Alert.alert(
                'Descarga no disponible',
                'La descarga de boletines está temporalmente deshabilitada. Por favor, contacte con la institución.',
                [{ text: 'Entendido', style: 'default' }]
            );
            return;
        }

        if (!periodoSeleccionado) {
            Alert.alert(
                'Periodo requerido',
                'Por favor seleccione un periodo académico',
                [{ text: 'OK', style: 'default' }]
            );
            return;
        }

        if (!currentStudent?.id) {
            Alert.alert(
                'Error',
                'No se pudo identificar al estudiante',
                [{ text: 'OK', style: 'cancel' }]
            );
            return;
        }

        try {
            setDownloading(true);

            const url = boletinService.getBoletinDownloadUrl(
                periodoSeleccionado,
                currentStudent.id
            );

            console.log('📥 Descargando boletín desde:', url);

            // Nombre del archivo
            const fileName = `Boletin_${currentStudent.nombre}_Periodo_${periodoSeleccionado}.pdf`;
            const fileUri = FileSystem.documentDirectory + fileName;

            // El endpoint requiere autenticación: enviamos el JWT del padre
            const token = await SecureStore.getItemAsync('auth_token');
            const downloadResult = await FileSystem.downloadAsync(url, fileUri, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            if (downloadResult.status === 200) {
                console.log('✅ Boletín descargado:', downloadResult.uri);

                // Verificar si expo-sharing está disponible
                if (Sharing) {
                    try {
                        const canShare = await Sharing.isAvailableAsync();
                        
                        if (canShare) {
                            // Compartir el archivo (esto abrirá opciones para guardar/abrir)
                            await Sharing.shareAsync(downloadResult.uri, {
                                mimeType: 'application/pdf',
                                dialogTitle: 'Guardar Boletín',
                                UTI: 'com.adobe.pdf'
                            });

                            Alert.alert(
                                '¡Éxito!',
                                'Boletín descargado correctamente. Puedes guardarlo o abrirlo desde las opciones.',
                                [{ text: 'OK', style: 'default' }]
                            );
                        } else {
                            // Fallback: mostrar la ubicación del archivo
                            Alert.alert(
                                'Descarga completada',
                                `El boletín se ha descargado en: ${downloadResult.uri}`,
                                [{ text: 'OK', style: 'default' }]
                            );
                        }
                    } catch (shareError) {
                        console.error('Error al compartir:', shareError);
                        Alert.alert(
                            'Descarga completada',
                            `El boletín se ha descargado. Ubicación: ${downloadResult.uri}`,
                            [{ text: 'OK', style: 'default' }]
                        );
                    }
                } else {
                    // Si expo-sharing no está disponible, mostrar ubicación
                    Alert.alert(
                        'Descarga completada',
                        `El boletín se ha descargado en: ${downloadResult.uri}\n\nPuedes encontrarlo en la carpeta de descargas de tu dispositivo.`,
                        [{ text: 'OK', style: 'default' }]
                    );
                }
            } else {
                throw new Error('Error al descargar el archivo');
            }
        } catch (error) {
            console.error('❌ Error descargando boletín:', error);
            Alert.alert(
                'Error',
                'No se pudo descargar el boletín. Por favor, intente nuevamente.',
                [{ text: 'OK', style: 'cancel' }]
            );
        } finally {
            setDownloading(false);
        }
    };

    const getPeriodoInfo = () => {
        if (!periodoSeleccionado) return null;
        return periodos.find(p => p.id_periodo === periodoSeleccionado);
    };

    const periodoInfo = getPeriodoInfo();

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={styles.headerGradient}
            >
                <SafeAreaView>
                    <View style={styles.headerContent}>
                        <View style={styles.headerTop}>
                            <TouchableOpacity
                                onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Dashboard')}
                                style={styles.backButton}
                            >
                                <MaterialCommunityIcons name="arrow-left" size={24} color={colors.white} />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Boletines Académicos</Text>
                            <View style={{ width: 44 }} />
                        </View>

                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="file-document" size={60} color={colors.white} />
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollPadding}
            >
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={styles.loadingText}>Cargando información...</Text>
                    </View>
                ) : (
                    <>
                        {/* Información del estudiante */}
                        <View style={styles.infoCard}>
                            <MaterialCommunityIcons name="account" size={24} color={colors.primary} />
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Estudiante</Text>
                                <Text style={styles.infoValue}>{currentStudent?.nombre || 'No disponible'}</Text>
                            </View>
                        </View>

                        {/* Selector de periodo */}
                        <Text style={styles.sectionTitle}>Seleccionar Periodo</Text>
                        
                        {periodos.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <MaterialCommunityIcons name="calendar-blank" size={60} color={colors.textMuted} />
                                <Text style={styles.emptyText}>No hay periodos disponibles</Text>
                            </View>
                        ) : (
                            <View style={styles.periodosContainer}>
                                {periodos.map((periodo) => (
                                    <TouchableOpacity
                                        key={periodo.id_periodo}
                                        style={[
                                            styles.periodoCard,
                                            periodoSeleccionado === periodo.id_periodo && styles.periodoCardSelected
                                        ]}
                                        onPress={() => setPeriodoSeleccionado(periodo.id_periodo)}
                                        disabled={!descargaHabilitada}
                                    >
                                        <View style={styles.periodoInfo}>
                                            <Text style={[
                                                styles.periodoTitle,
                                                periodoSeleccionado === periodo.id_periodo && styles.periodoTitleSelected
                                            ]}>
                                                {nombrePeriodo(periodo)}
                                            </Text>
                                            <Text style={[
                                                styles.periodoDate,
                                                periodoSeleccionado === periodo.id_periodo && styles.periodoDateSelected
                                            ]}>
                                                {periodo.fecha_inicio} - {periodo.fecha_fin}
                                            </Text>
                                        </View>
                                        {periodoSeleccionado === periodo.id_periodo && (
                                            <MaterialCommunityIcons 
                                                name="check-circle" 
                                                size={24} 
                                                color={colors.primary} 
                                            />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {/* Mensaje de advertencia si está deshabilitado */}
                        {!descargaHabilitada && (
                            <View style={styles.warningCard}>
                                <MaterialCommunityIcons name="alert" size={24} color="#f57c00" />
                                <Text style={styles.warningText}>
                                    La descarga de boletines está temporalmente deshabilitada
                                </Text>
                            </View>
                        )}

                        {/* Botón de descarga */}
                        <TouchableOpacity
                            style={[
                                styles.downloadButton,
                                (!descargaHabilitada || !periodoSeleccionado || downloading) && styles.downloadButtonDisabled
                            ]}
                            onPress={descargarBoletin}
                            disabled={!descargaHabilitada || !periodoSeleccionado || downloading}
                        >
                            <LinearGradient
                                colors={
                                    descargaHabilitada && periodoSeleccionado && !downloading
                                        ? [colors.primary, colors.secondary]
                                        : ['#ccc', '#999']
                                }
                                style={styles.downloadButtonGradient}
                            >
                                {downloading ? (
                                    <>
                                        <ActivityIndicator size="small" color={colors.white} />
                                        <Text style={styles.downloadButtonText}>Descargando...</Text>
                                    </>
                                ) : (
                                    <>
                                        <MaterialCommunityIcons name="download" size={24} color={colors.white} />
                                        <Text style={styles.downloadButtonText}>Descargar Boletín (PDF)</Text>
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Información adicional */}
                        <View style={styles.footerInfo}>
                            <MaterialCommunityIcons name="information" size={20} color={colors.textMuted} />
                            <Text style={styles.footerText}>
                                El boletín contiene todas las calificaciones del periodo seleccionado. 
                                Una vez descargado, podrás guardarlo en tu dispositivo o compartirlo.
                            </Text>
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.background,
    },
    headerGradient: {
        paddingBottom: 30,
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
    },
    headerContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.white,
    },
    iconContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    content: {
        flex: 1,
    },
    scrollPadding: {
        padding: 25,
        paddingBottom: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: colors.textMuted,
        fontWeight: '500',
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 20,
        marginBottom: 25,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 2,
    },
    infoContent: {
        marginLeft: 15,
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: colors.textMuted,
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.text,
        marginBottom: 15,
    },
    periodosContainer: {
        marginBottom: 20,
    },
    periodoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.white,
        borderRadius: 15,
        padding: 18,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: 'transparent',
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 1,
    },
    periodoCardSelected: {
        borderColor: colors.primary,
        backgroundColor: '#E3F2FD',
    },
    periodoInfo: {
        flex: 1,
    },
    periodoTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 4,
    },
    periodoTitleSelected: {
        color: colors.primary,
    },
    periodoDate: {
        fontSize: 13,
        color: colors.textMuted,
    },
    periodoDateSelected: {
        color: colors.primary,
        fontWeight: '600',
    },
    warningCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff3cd',
        borderRadius: 15,
        padding: 18,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ffc107',
    },
    warningText: {
        flex: 1,
        marginLeft: 12,
        fontSize: 14,
        color: '#856404',
        fontWeight: '600',
    },
    downloadButton: {
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 20,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 3,
    },
    downloadButtonDisabled: {
        shadowOpacity: 0,
        elevation: 0,
    },
    downloadButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: 30,
        gap: 10,
    },
    downloadButtonText: {
        fontSize: 16,
        fontWeight: '800',
        color: colors.white,
    },
    footerInfo: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignItems: 'flex-start',
    },
    footerText: {
        flex: 1,
        fontSize: 13,
        color: colors.textMuted,
        marginLeft: 10,
        lineHeight: 18,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        marginTop: 15,
        fontSize: 16,
        color: colors.textMuted,
        textAlign: 'center',
    },
});

export default BoletinesScreen;
