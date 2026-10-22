
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import LoginForm from "../components/LoginFrom";
import { useLogin } from "../hooks/useLogin";

export default function LoginScreen() {

    const router = useRouter();

    const {
        login,
        loading,
        error
    } = useLogin();

    const handleLogin = async (
        email: string,
        password: string
    ) => {

        const success = await login(
            email,
            password
        );

        if (success) {
            router.replace("/home");
        }
    };

    return (
        <View style={styles.container}>

            <LoginForm
                onLogin={handleLogin}
                loading={loading}
                error={error}
            />

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },

});
