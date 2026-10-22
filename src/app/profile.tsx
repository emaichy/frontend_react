import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

import MenuItem from "../components/MenuItem"; // Reutilizamos tu componente MenuItem
import { RootState, logout } from "../store/store";
import { removeStorage } from "../utils/authStorage";

export default function ProfileScreen() {
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);

    const displayName = user?.nombre
        ? `${user.nombre} ${user.apellido}`.trim()
        : user?.email ? user.email.split("@")[0] : "Alumno";

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
        <View style={styles.container}>
            {/* Header con botón regresar */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleGoBack}>
                    <Text style={styles.back}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mi Perfil</Text>
            </View>

            {/* Datos del Alumno */}
            <View style={styles.profile}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{initial}</Text>
                </View>
                <Text style={styles.name}>{displayName}</Text>
                <Text style={styles.email}>{user?.email || "Sin correo"}</Text>
                {user?.matricula ? (
                    <Text style={styles.matricula}>Matrícula: {user.matricula}</Text>
                ) : null}
            </View>

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
                style={styles.logout}
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
        backgroundColor: "#18181b",
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
        color: "#ffffff",
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#ffffff",
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
        color: "#ffffff",
        marginBottom: 4,
    },
    email: {
        fontSize: 15,
        color: "#a1a1aa",
    },
    matricula: {
        fontSize: 14,
        color: "#71717a",
        marginTop: 4,
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
        borderTopColor: "#27272a",
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