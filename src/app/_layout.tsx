import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Provider, useDispatch } from "react-redux";

import { setToken, setUser, store } from "../store/store";
import { getStorage } from "../utils/authStorage";
import { storage } from "../utils/storage";
import { getCurrentUser } from "../api/auth.api";
import ErrorBoundary from "../components/ErrorBoundary";
import { CartProvider } from "../context/CartContext";
import { NotificationProvider } from "../context/NotificationContext";
import { ThemeProvider } from "../context/ThemeContext";
import NotificationList from "../components/NotificationList";

// Previene que la pantalla de carga nativa se oculte automáticamente
SplashScreen.preventAutoHideAsync();

function AuthInitializer({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const [isRestoring, setIsRestoring] = useState(true);

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const token = await storage.getToken();
                if (token) {
                    try {
                        const currentUser = await getCurrentUser();
                        dispatch(setToken((await storage.getToken()) ?? token));
                        dispatch(setUser(currentUser));
                        return;
                    } catch (error) {
                        console.error("Error al validar la sesión guardada:", error);
                    }
                }

                // Mantiene compatibilidad con sesiones guardadas por la autenticación anterior.
                const legacyToken = await getStorage("user_token");
                const savedUser = await getStorage("user_info");

                if (legacyToken && savedUser) {
                    dispatch(setToken(legacyToken));
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
                                <View style={{ flex: 1 }}>
                                    <Stack screenOptions={{ headerShown: false }}>
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
                                    <NotificationList />
                                </View>
                            </AuthInitializer>
                        </CartProvider>
                    </NotificationProvider>
                </ThemeProvider>
            </ErrorBoundary>
        </Provider>
    );
}