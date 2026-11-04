import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

export const saveStorage = async (key: string, value: string) => {
    if (Platform.OS === "web") {
        sessionStorage.setItem(key, value);
        localStorage.removeItem(key);
    } else {
        await SecureStore.setItemAsync(key, value);
    }
};

export const getStorage = async (key: string) => {
    if (Platform.OS === "web") {
        const currentValue = sessionStorage.getItem(key);
        if (currentValue !== null) {
            return currentValue;
        }
        const legacyValue = localStorage.getItem(key);
        if (legacyValue !== null) {
            sessionStorage.setItem(key, legacyValue);
            localStorage.removeItem(key);
        }
        return legacyValue;
    } else {
        return await SecureStore.getItemAsync(key);
    }
};

export const removeStorage = async (key: string) => {
    if (Platform.OS === "web") {
        sessionStorage.removeItem(key);
        localStorage.removeItem(key);
    } else {
        await SecureStore.deleteItemAsync(key);
    }
};