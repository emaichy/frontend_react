import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Switch
} from "react-native";

import { useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext";

export default function SettingsScreen() {

    const router = useRouter();
    const { colors, theme, toggleTheme } = useTheme();

    const handleLogout = () => {
        router.replace("/");
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>

            <View style={[styles.header, { backgroundColor: colors.card }]}>

                <TouchableOpacity
                    onPress={() => router.back()}
                >
                    <Text style={[styles.back, { color: colors.text }]}>
                        ←
                    </Text>
                </TouchableOpacity>

                <Text style={[styles.headerTitle, { color: colors.text }]}>
                    Configuración
                </Text>

            </View>

            <View style={styles.options}>
                <Text style={[styles.optionText, { color: colors.text }]}>ⓘ  Información de la app</Text>
                <Text style={[styles.optionText, { color: colors.text }]}>⚙  Preferencias</Text>
                <Text style={[styles.optionText, { color: colors.text }]}>🔔  Notificaciones</Text>
                <Text style={[styles.optionText, { color: colors.text }]}>🔒  Privacidad</Text>
                <Text style={[styles.optionText, { color: colors.text }]}>❓  Ayuda y soporte</Text>
            </View>

            <View style={[styles.appearance, { backgroundColor: colors.card }]}>
                <Text style={[styles.appearanceLabel, { color: colors.text }]}>Modo oscuro</Text>
                <Switch
                    value={theme === "dark"}
                    onValueChange={toggleTheme}
                    trackColor={{ false: "#767577", true: colors.primary }}
                    thumbColor={theme === "dark" ? colors.primary : "#f4f3f4"}
                    accessibilityLabel="Modo oscuro"
                />
            </View>

            <TouchableOpacity
                style={styles.logout}
                onPress={handleLogout}
            >
                <Text style={styles.logoutText}>🚪  Cerrar sesión</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 20,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    back: {
        fontSize: 24,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    options: {
        padding: 20,
    },
    optionText: {
        fontSize: 16,
        paddingVertical: 6,
    },
    appearance: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: 20,
        marginBottom: 20,
        padding: 16,
        borderRadius: 10,
    },
    appearanceLabel: {
        fontSize: 16,
        fontWeight: "500",
    },
    logout: {
        backgroundColor: "#FF6B6B",
        padding: 20,
        marginHorizontal: 20,
        borderRadius: 10,
    },
    logoutText: {
        color: "#FFFFFF",
        fontWeight: "600",
    },
});