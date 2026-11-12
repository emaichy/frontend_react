import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

import MenuItem from "../components/MenuItem"; // Reutilizamos tu componente MenuItem
import { RootState, logout } from "../store/store";
import { removeStorage } from "../utils/authStorage";
import { getUserDisplayName } from "../utils/userDisplay";
import { useTheme } from "../context/ThemeContext";

export default function ProfileScreen() {
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const { colors, theme, toggleTheme } = useTheme();

    const displayName = getUserDisplayName(user);

    const initial = displayName.charAt(0).toUpperCase();

    const handleGoBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace("/home");
        }
    };

    const handleLogout = async () => {
        await removeStorage("user_token");
        await removeStorage("user_info");
        dispatch(logout());
        router.replace("/");
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header con botón regresar */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleGoBack}>
                    <Text style={[styles.back, { color: colors.text }]}>←</Text>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Mi Perfil</Text>
            </View>

            {/* Datos del Alumno */}
            <View style={styles.profile}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{initial}</Text>
                </View>
                <Text style={[styles.name, { color: colors.text }]}>{displayName}</Text>
                <Text style={[styles.email, { color: colors.secondary }]}>{user?.email || "Sin correo"}</Text>
                {user?.matricula ? (
                    <Text style={[styles.email, { color: colors.secondary }]}>Matrícula: {user.matricula}</Text>
                ) : null}
                {user?.matricula ? (
                    <Text style={[styles.matricula, { color: colors.secondary }]}>Matrícula: {user.matricula}</Text>
                ) : null}
            </View>

            <TouchableOpacity
                style={[styles.themeToggle, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={toggleTheme}
                accessibilityRole="button"
                accessibilityLabel={theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"}
            >
                <Text style={[styles.themeToggleLabel, { color: colors.text }]}>Modo oscuro</Text>
                <Text style={[styles.themeToggleValue, { color: colors.primary }]}>
                    {theme === "dark" ? "Activado 🌙" : "Desactivado ☀️"}
                </Text>
            </TouchableOpacity>

            {/* Opciones con MenuItem */}
            <View style={styles.options}>
                <MenuItem
                    title="Inicio"
                    icon="🏠"
                    onPress={() => router.replace("/home")}
                />

                <MenuItem
                    title="Mi Perfil"
                    icon="👤"
                    onPress={() => {}} // Ya estamos en Perfil
                />

                <MenuItem
                    title="Configuración"
                    icon="⚙️"
                    onPress={() => router.push("/settings")}
                />
            </View>

            <View style={styles.spacer} />

            {/* Cerrar sesión */}
            <TouchableOpacity
                style={[styles.logout, { borderTopColor: colors.border }]}
                onPress={handleLogout}
            >
                <Text style={styles.logoutIcon}>🚪</Text>
                <Text style={styles.logoutText}>Cerrar sesión</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 30,
        marginBottom: 20,
    },
    back: {
        fontSize: 24,
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
    },
    profile: {
        alignItems: "center",
        marginBottom: 25,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: "#2563EB",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    avatarText: {
        fontSize: 40,
        fontWeight: "bold",
        color: "#ffffff",
    },
    name: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 4,
    },
    email: {
        fontSize: 15,
    },
    matricula: {
        fontSize: 14,
        marginTop: 4,
    },
    themeToggle: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 12,
    },
    themeToggleLabel: {
        fontSize: 16,
        fontWeight: "500",
    },
    themeToggleValue: {
        fontSize: 15,
        fontWeight: "600",
    },
    options: {
        marginTop: 10,
    },
    spacer: {
        flex: 1,
    },
    logout: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 18,
        borderTopWidth: 1,
    },
    logoutIcon: {
        fontSize: 22,
        width: 40,
    },
    logoutText: {
        fontSize: 16,
        color: "#DC2626",
        fontWeight: "600",
    },
});