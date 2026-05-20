import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    FlatList
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { scheduleData } from '../models/subjectsData';
import colors from '../styles/colors';

const HorarioScreen = ({ navigation }) => {
    const renderItem = ({ item }) => (
        <View style={styles.scheduleItem}>
            <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{item.time}</Text>
                <View style={styles.indicator} />
            </View>
            <View style={styles.detailsContainer}>
                <Text style={styles.subjectText}>{item.subject}</Text>
                <View style={styles.roomRow}>
                    <MaterialCommunityIcons name="map-marker" size={14} color={colors.textMuted} />
                    <Text style={styles.roomText}>{item.room}</Text>
                    <View style={styles.dayBadge}>
                        <Text style={styles.dayLabel}>{item.day}</Text>
                    </View>
                </View>
            </View>
        </View>
    );

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
                            <Text style={styles.headerTitle}>Horario de Clases</Text>
                            <View style={{ width: 44 }} />
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <FlatList
                data={scheduleData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={() => (
                    <Text style={styles.sectionTitle}>Cronograma Semanal</Text>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.background,
    },
    headerGradient: {
        paddingBottom: 25,
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
        marginBottom: 10,
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
    listContent: {
        paddingHorizontal: 25,
        paddingTop: 20,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.text,
        marginBottom: 20,
    },
    scheduleItem: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    timeContainer: {
        width: 85,
        alignItems: 'center',
        paddingTop: 5,
    },
    timeText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.textMuted,
        textAlign: 'center',
    },
    indicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.primary,
        marginTop: 10,
        borderWidth: 2,
        borderColor: colors.white,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 3,
    },
    detailsContainer: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: 18,
        padding: 15,
        marginLeft: 10,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 2,
    },
    subjectText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 5,
    },
    roomRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    roomText: {
        fontSize: 13,
        color: colors.textMuted,
        marginLeft: 4,
    },
    dayBadge: {
        marginLeft: 'auto',
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    dayLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#2E7D32',
    },
});

export default HorarioScreen;
