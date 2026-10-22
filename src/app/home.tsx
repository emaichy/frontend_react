import { useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

import SideMenu from "../components/SideMenu";
import { RootState, logout } from "../store/store";
import { removeStorage } from "../utils/authStorage";

export default function HomeScreen() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [menuOpen, setMenuOpen] = useState(false);

    // Leer usuario dinámico desde Redux
    const user = useSelector((state: RootState) => state.auth.user);

    // Nombre para mostrar en el saludo
    const firstName = user?.nombre
        ? user.nombre
        
        : user?.email ? user.email.split("@")[0] : "Usuario";

    const handleLogout = async () => {
        setMenuOpen(false);
        await removeStorage("user_token");
        await removeStorage("user_info");
        dispatch(logout());
        router.replace("/");
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => setMenuOpen(true)}>
                    <Text style={styles.menuIcon}>☰</Text>
                </TouchableOpacity>

                {/* Saludo dinámico con el nombre del estado global */}
                <Text style={styles.greeting}>
                    Hola, {firstName} 👋
                </Text>

                <TouchableOpacity onPress={() => router.push("/profile")}>
                    <Text style={styles.profile}>👤</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>¡Bienvenido/a!</Text>
                <Text style={styles.subtitle}>
                    Nos alegra verte nuevamente.
                </Text>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#18181b", // Fondo adaptado al tema oscuro
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 20,
        paddingTop: 40,
        backgroundColor: "#27272a",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    menuIcon: {
        fontSize: 24,
        color: "#ffffff",
    },
    greeting: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#ffffff",
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
        color: "#ffffff",
    },
    subtitle: {
        fontSize: 16,
        color: "#a1a1aa",
    },
});