import React, { useState } from "react";
import {
    Button,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import { LoginFormProps } from "../interfaces/auth.interface";

export default function LoginForm({
    onLogin,
    loading,
    error
}: LoginFormProps) {
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
        <View style={styles.container}>
            <Text style={styles.title}>Iniciar sesión</Text>

            {/* CORREO ELECTRÓNICO */}
            <Text style={styles.label}>Correo Electrónico</Text>
            <TextInput
                style={[
                    styles.input,
                    emailError !== "" ? styles.inputError : null
                ]}
                placeholder="Ingresa tu correo electrónico"
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
            <Text style={styles.label}>Contraseña</Text>
            <View style={[
                styles.passwordContainer,
                passwordError !== "" ? styles.inputError : null
            ]}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Ingresa tu contraseña"
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
                    <Text style={styles.showButtonText}>
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
                <Button
                    title={loading ? "Validando..." : "Iniciar sesión"}
                    onPress={handleLogin}
                    disabled={loading}
                />
            </View>
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
        color: "#111827",
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 6,
        color: "#374151",
    },
    input: {
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 8,
        padding: 12,
        marginBottom: 4,
        backgroundColor: "#FFFFFF",
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 8,
        marginBottom: 4,
        backgroundColor: "#FFFFFF",
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
        color: "#3B82F6",
        fontWeight: "600",
        fontSize: 14,
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
});