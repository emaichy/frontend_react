import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Provider, useDispatch } from "react-redux";

import { setToken, setUser, store } from "../store/store";
import { getStorage } from "../utils/authStorage";
import ErrorBoundary from "../components/ErrorBoundary";
import { CartProvider } from "../context/CartContext";
import { NotificationProvider } from "../context/NotificationContext";
import { ThemeProvider } from "../context/ThemeContext";

// Previene que la pantalla de carga nativa se oculte automáticamente
SplashScreen.preventAutoHideAsync();

function AuthInitializer({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const [isRestoring, setIsRestoring] = useState(true);

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const token = await getStorage("user_token");
                const savedUser = await getStorage("user_info");

                if (token && savedUser) {
                    dispatch(setToken(token));
                    dispatch(setUser(JSON.parse(savedUser)));
                }
            } catch (error) {
                console.error("Error al restaurar sesión:", error);
            } finally {
                setIsRestoring(false);
                await SplashScreen.hideAsync();
            }
        };

        restoreSession();
    }, [dispatch]);

    if (isRestoring) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#18181b" }}>
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        );
    }

    return <>{children}</>;
}

export default function RootLayout() {
    return (
        <Provider store={store}>
            <ErrorBoundary>
                <ThemeProvider>
                    <NotificationProvider>
                        <CartProvider>
                            <AuthInitializer>
                                <Stack>
                                    <Stack.Screen
                                        name="index"
                                        options={{ headerShown: false }}
                                    />
                                    <Stack.Screen
                                        name="(tabs)"
                                        options={{ headerShown: false }}
                                    />
                                    <Stack.Screen
                                        name="student/[id]"
                                        options={{
                                            headerShown: false,
                                            title: "Detalle de Estudiante",
                                            headerStyle: { backgroundColor: "#FFFFFF" },
                                            headerTitleStyle: { fontWeight: "600" },
                                            headerTintColor: "#111827",
                                        }}
                                    />
                                </Stack>
                            </AuthInitializer>
                        </CartProvider>
                    </NotificationProvider>
                </ThemeProvider>
            </ErrorBoundary>
        </Provider>
    );
}