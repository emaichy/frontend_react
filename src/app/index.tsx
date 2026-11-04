import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import LoginForm from "../components/LoginFrom";
import { useLogin } from "../hooks/useLogin";
import { LoginRequest } from "../interfaces/auth.interface";

export default function LoginScreen() {
  const router = useRouter();
  const { login, loading, error } = useLogin();

  const handleLogin = async (data: LoginRequest) => {
    const success = await login(data.email, data.password);
    if (success) {
      router.replace("/home");
    }
  };

  return (
    <View style={styles.container}>
      <LoginForm
        onLogin={(email, password) => handleLogin({ email, password })}
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