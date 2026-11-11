import { useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";

import SideMenu from "../components/SideMenu";
import { RootState } from "../store/store";
import { getUserFirstName } from "../utils/userDisplay";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
import ConfirmDialog from "../components/ConfirmDialog";

export default function HomeScreen() {
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const [confirmLogout, setConfirmLogout] = useState(false);
    const { logout } = useAuth();
    const { colors } = useTheme();

    // Leer usuario dinámico desde Redux
    const user = useSelector((state: RootState) => state.auth.user);

    // Nombre para mostrar en el saludo
    const firstName = getUserFirstName(user);

    const handleLogout = () => {
        setMenuOpen(false);
        setConfirmLogout(true);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.card }]}>
                <TouchableOpacity onPress={() => setMenuOpen(true)}>
                    <Text style={[styles.menuIcon, { color: colors.text }]}>☰</Text>
                </TouchableOpacity>

                {/* Saludo dinámico con el nombre del estado global */}
                <Text style={[styles.greeting, { color: colors.text }]}>
                    Hola, {firstName} 👋
                </Text>

                <TouchableOpacity onPress={() => router.push("/profile")}>
                    <Text style={styles.profile}>👤</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Text style={[styles.title, { color: colors.text }]}>¡Bienvenido/a!</Text>
                <Text style={[styles.subtitle, { color: colors.secondary }]}>
                    Nos alegra verte nuevamente.
                </Text>
                <Text style={[styles.accountEmail, { color: colors.secondary }]}>{user?.email || "Correo no disponible"}</Text>
                <TouchableOpacity
                    style={styles.tabsButton}
                    onPress={() => router.push("/(tabs)")}
                    accessibilityRole="button"
                    accessibilityLabel="Ir a las pestañas"
                >
                    <Text style={styles.tabsButtonText}>Ir a las pestañas</Text>
                </TouchableOpacity>
            </View>

            <SideMenu
                visible={menuOpen}
                onClose={() => setMenuOpen(false)}
                onProfile={() => {
                    setMenuOpen(false);
                    router.push("/profile");
                }}
                onSettings={() => {
                    setMenuOpen(false);
                    router.push("/settings");
                }}
                onLogout={handleLogout}
            />
            <ConfirmDialog
                visible={confirmLogout}
                title="Cerrar sesión"
                message="¿Estás seguro de que quieres cerrar sesión?"
                confirmLabel="Cerrar sesión"
                destructive
                onCancel={() => setConfirmLogout(false)}
                onConfirm={() => {
                    setConfirmLogout(false);
                    void logout();
                }}
            />
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
        paddingTop: 40,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    menuIcon: {
        fontSize: 24,
    },
    greeting: {
        fontSize: 18,
        fontWeight: "bold",
    },
    profile: {
        fontSize: 24,
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
    },
    accountEmail: {
        marginTop: 8,
        fontSize: 14,
    },
    tabsButton: {
        alignSelf: "flex-start",
        marginTop: 24,
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: "#2563EB",
    },
    tabsButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
    },
});