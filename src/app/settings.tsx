import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import { useRouter } from "expo-router";

export default function SettingsScreen() {

    const router = useRouter();

    const handleLogout = () => {
        router.replace("/");
    };

    return (
        <View style={styles.container}>

            <View style={styles.header}>

                <TouchableOpacity
                    onPress={() => router.back()}
                >
                    <Text style={styles.back}>
                        ←
                    </Text>
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    Configuración
                </Text>

            </View>

            <View style={styles.options}>
                <Text>ⓘ  Información de la app</Text>
                <Text>⚙  Preferencias</Text>
                <Text>🔔  Notificaciones</Text>
                <Text>🔒  Privacidad</Text>
                <Text>❓  Ayuda y soporte</Text>
            </View>

            <TouchableOpacity
                style={styles.logout}
                onPress={handleLogout}
            >
                <Text>🚪  Cerrar sesión</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 20,
        backgroundColor: "#FFFFFF",
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
    logout: {
        backgroundColor: "#FF6B6B",
        padding: 20,
        marginHorizontal: 20,
        borderRadius: 10,
    },
});