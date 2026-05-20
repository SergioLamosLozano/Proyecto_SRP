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
import ActivityItem from '../components/ActivityItem';
import { allActivities } from '../models/subjectsData';
import colors from '../styles/colors';

const SeguimientoScreen = ({ navigation }) => {
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
                            <Text style={styles.headerTitle}>Seguimiento</Text>
                            <View style={{ width: 44 }} />
                        </View>
                        <View style={styles.summaryBox}>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryCount}>{allActivities.length}</Text>
                                <Text style={styles.summaryLabel}>Actividades</Text>
                            </View>
                            <View style={styles.summaryDivider} />
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryCount}>
                                    {allActivities.filter(a => a.grade >= 4.0).length}
                                </Text>
                                <Text style={styles.summaryLabel}>Sobresalientes</Text>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <FlatList
                data={allActivities}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <ActivityItem activity={item} />}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={() => (
                    <Text style={styles.sectionTitle}>Registro de Calificaciones</Text>
                )}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="clipboard-text-outline" size={60} color={colors.border} />
                        <Text style={styles.emptyText}>No hay actividades registradas aún.</Text>
                    </View>
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
        fontSize: 22,
        fontWeight: '800',
        color: colors.white,
        letterSpacing: 0.5,
    },
    summaryBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
    },
    summaryCount: {
        fontSize: 28,
        fontWeight: '900',
        color: colors.white,
    },
    summaryLabel: {
        fontSize: 13,
        color: colors.textSecondary,
        marginTop: 2,
    },
    summaryDivider: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
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
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 16,
        color: colors.textMuted,
        marginTop: 15,
    },
});

export default SeguimientoScreen;
