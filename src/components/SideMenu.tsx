import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useSelector } from "react-redux";

import { SideMenuProps } from "../interfaces/menu.interface";
import { RootState } from "../store/store";
import MenuItem from "./MenuItem";
import { getUserDisplayName } from "../utils/userDisplay";
import { useTheme } from "../context/ThemeContext";

export default function SideMenu({
    visible,
    onClose,
    onProfile,
    onSettings,
    onLogout
}: SideMenuProps) {

    // Obtener usuario del estado global de Redux
    const user = useSelector((state: RootState) => state.auth.user);
    const { colors } = useTheme();

    if (!visible) {
        return null;
    }

    // Calcular el nombre completo o email por defecto
    const displayName = getUserDisplayName(user);

    const initial = displayName.charAt(0).toUpperCase();

    return (
        <View style={styles.overlay}>

            {/* MENÚ LATERAL */}
        <View style={[styles.menu, { backgroundColor: colors.background }]}>

                {/* INFORMACIÓN DEL USUARIO */}
                <View style={[styles.userContainer, { borderBottomColor: colors.border }]}>

                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {initial}
                        </Text>
                    </View>

                    <Text style={[styles.name, { color: colors.text }]}>
                        {displayName}
                    </Text>

                    <Text style={[styles.email, { color: colors.secondary }]}>
                        {user?.email || "Sin correo"}
                    </Text>

                </View>

                {/* OPCIÓN INICIO */}
                <MenuItem
                    title="Inicio"
                    icon="🏠"
                    onPress={onClose}
                />

                {/* OPCIÓN PERFIL */}
                <MenuItem
                    title="Mi Perfil"
                    icon="👤"
                    onPress={onProfile}
                />

                {/* OPCIÓN CONFIGURACIÓN */}
                <MenuItem
                    title="Configuración"
                    icon="⚙️"
                    onPress={onSettings}
                />

                {/* ESPACIO */}
                <View style={styles.spacer} />

                {/* CERRAR SESIÓN */}
                <TouchableOpacity
                    style={[styles.logout, { borderTopColor: colors.border }]}
                    onPress={onLogout}
                >

                    <Text style={styles.logoutIcon}>
                        🚪
                    </Text>

                    <Text style={styles.logoutText}>
                        Cerrar sesión
                    </Text>

                </TouchableOpacity>

            </View>

            <TouchableOpacity
                style={styles.background}
                onPress={onClose}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: "row",
        zIndex: 1000,
    },
    menu: {
        width: "80%",
        height: "100%",
        paddingTop: 50,
        paddingBottom: 20,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
    },
    userContainer: {
        paddingHorizontal: 20,
        paddingBottom: 25,
        borderBottomWidth: 1,
        alignItems: "center",
    },
    avatar: {
        width: 75,
        height: 75,
        borderRadius: 38,
        backgroundColor: "#2563EB",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    avatarText: {
        color: "#FFFFFF",
        fontSize: 30,
        fontWeight: "bold",
    },
    name: {
        fontSize: 19,
        fontWeight: "bold",
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
    },
    spacer: {
        flex: 1,
    },
    logout: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
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
    background: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.45)",
    },
});