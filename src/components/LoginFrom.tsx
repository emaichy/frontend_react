import React, { useState } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { LoginFormProps } from "../interfaces/auth.interface";
import { useTheme } from "../context/ThemeContext";

export default function LoginForm({
    onLogin,
    onRegister,
    loading,
    error
}: LoginFormProps) {
    const { colors } = useTheme();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleEmailChange = (text: string) => {
        setEmail(text);
        if (text.trim() !== "") setEmailError("");
    };

    const handlePasswordChange = (text: string) => {
        setPassword(text);
        if (text.trim() !== "") setPasswordError("");
    };

    const handleLogin = () => {
        let valid = true;

        setEmailError("");
        setPasswordError("");

        if (email.trim() === "") {
            setEmailError("El correo electrónico es obligatorio");
            valid = false;
        }

        if (password.trim() === "") {
            setPasswordError("La contraseña es obligatoria");
            valid = false;
        }

        if (!valid) return;

        onLogin(email.trim(), password);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.text }]}>Iniciar sesión</Text>

            {/* CORREO ELECTRÓNICO */}
            <Text style={[styles.label, { color: colors.text }]}>Correo Electrónico</Text>
            <TextInput
                style={[
                    styles.input,
                    { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
                    emailError !== "" ? styles.inputError : null
                ]}
                placeholder="Ingresa tu correo electrónico"
                placeholderTextColor={colors.secondary}
                value={email}
                onChangeText={handleEmailChange}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                editable={!loading}
            />
            {emailError !== "" && (
                <Text style={styles.errorText}>{emailError}</Text>
            )}

            {/* CONTRASEÑA */}
            <Text style={[styles.label, { color: colors.text }]}>Contraseña</Text>
            <View style={[
                styles.passwordContainer,
                { backgroundColor: colors.card, borderColor: colors.border },
                passwordError !== "" ? styles.inputError : null
            ]}>
                <TextInput
                    style={[styles.passwordInput, { color: colors.text }]}
                    placeholder="Ingresa tu contraseña"
                    placeholderTextColor={colors.secondary}
                    value={password}
                    onChangeText={handlePasswordChange}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    editable={!loading}
                />
                <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.showButton}
                    disabled={loading}
                    accessibilityRole="button"
                    accessibilityLabel={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                    <Text style={[styles.showButtonText, { color: colors.primary }]}>
                        {showPassword ? "Ocultar" : "Mostrar"}
                    </Text>
                </Pressable>
            </View>
            {passwordError !== "" && (
                <Text style={styles.errorText}>{passwordError}</Text>
            )}

            {/* ERROR DE AUTENTICACIÓN (BACKEND) */}
            {error !== "" && (
                <Text style={[styles.errorText, styles.globalError]}>
                    {error}
                </Text>
            )}

            {/* BOTÓN SUBMIT */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.primary }]}
                    onPress={handleLogin}
                    disabled={loading}
                    accessibilityRole="button"
                >
                    <Text style={styles.buttonText}>
                        {loading ? "Validando..." : "Iniciar sesión"}
                    </Text>
                </TouchableOpacity>
            </View>
            <Pressable
                onPress={onRegister}
                style={styles.registerLink}
                disabled={loading}
                accessibilityRole="button"
            >
                <Text style={[styles.registerLinkText, { color: colors.primary }]}>
                    ¿No tienes cuenta? Regístrate
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 30,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 4,
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 4,
    },
    passwordInput: {
        flex: 1,
        padding: 12,
    },
    showButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    showButtonText: {
        fontWeight: "600",
        fontSize: 14,
    },
    button: {
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    inputError: {
        borderColor: "#EF4444",
    },
    errorText: {
        color: "#EF4444",
        fontSize: 12,
        marginBottom: 12,
    },
    globalError: {
        fontSize: 14,
        textAlign: "center",
        marginVertical: 8,
    },
    buttonContainer: {
        marginTop: 12,
    },
    registerLink: {
        alignItems: "center",
        paddingVertical: 16,
    },
    registerLinkText: {
        fontSize: 14,
        fontWeight: "600",
    },
});