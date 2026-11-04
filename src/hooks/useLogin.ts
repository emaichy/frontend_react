import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser, setToken } from "../store/store";
import { saveStorage } from "../utils/authStorage";
import { authApi } from "../api/auth.api";
import { storage } from "../utils/storage";
import { handleApiError } from "../utils/errorHandler";

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const dispatch = useDispatch();

    const login = async (email: string, password: string): Promise<boolean> => {
        setLoading(true);
        setError("");

        try {
            const data = await authApi.login({ email, password });
            const tokenReceived = data.accessToken ?? data.token;
            if (!tokenReceived) {
                throw new Error("La API no devolvió un token válido");
            }

            const fullUser = { ...data.user, email: data.user.email || email };

            await storage.saveToken(tokenReceived);
            if (data.refreshToken) {
                await storage.saveRefreshToken(data.refreshToken);
            } else {
                await storage.removeRefreshToken();
            }
            await saveStorage("user_token", tokenReceived);
            await saveStorage("user_info", JSON.stringify(fullUser));

            dispatch(setToken(tokenReceived));
            dispatch(setUser(fullUser));

            return true;

        } catch (err) {
            setError(handleApiError(err).message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
};