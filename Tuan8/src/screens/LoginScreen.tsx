import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { FormField } from "../components/FormField";
import { PrimaryButton } from "../components/PrimaryButton";
import { login } from "../services/authService";
import { getErrorMessage } from "../api/client";
import { useAuth } from "../store/hooks";
import { validateEmail, validatePassword } from "../utils/validators";
import { RootScreenProps } from "../navigation/types";
import { colors } from "../theme";

export function LoginScreen({ navigation, route }: RootScreenProps<"Login">) {
  const { signIn } = useAuth();

  // BT8.1 - Bước 1: state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string | null; password?: string | null }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // BT8.1 - Bước 1: hàm submit
  const submit = async () => {
    // 1) validate 2 ô, còn lỗi thì dừng
    const e = { email: validateEmail(email), password: validatePassword(password) };
    setErrors(e);
    setSubmitError(null);
    if (e.email || e.password) return;

    // 2) gọi API
    setLoading(true);
    try {
      const { user, token } = await login(email.trim(), password);
      signIn(user, token);

      // 3) điều hướng
      if (route.params?.redirectTo === "Checkout") {
        navigation.replace("Checkout", { total: route.params.total ?? 0 });
      } else {
        navigation.navigate("Tabs", { screen: "Home" });
      }
    } catch (err) {
      // 4) báo lỗi chung
      setSubmitError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>📚</Text>
        <Text style={styles.title}>Đăng nhập BookStore</Text>

        {/* BT8.1 - Bước 2: form (đã thay TodoBox) */}
        <FormField
          label="Email"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          keyboardType="email-address"
        />
        <View>
          <FormField
            label="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            secureTextEntry={!showPassword}
          />
          <Pressable
            onPress={() => setShowPassword((s) => !s)}
            style={{ position: "absolute", right: 12, top: 32 }}
            accessibilityLabel={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            <Text style={{ fontSize: 20 }}>{showPassword ? "🙈" : "👁"}</Text>
          </Pressable>
        </View>
        {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}
        <PrimaryButton title="Đăng nhập" onPress={submit} loading={loading} />

        <Pressable onPress={() => navigation.replace("Register", route.params)}>
          <Text style={styles.link}>Chưa có tài khoản? Đăng ký</Text>
        </Pressable>
        <View style={styles.hint}>
          <Text style={styles.hintText}>Tài khoản demo: demo@bookstore.vn / 123456</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, gap: 14 },
  logo: { fontSize: 56, textAlign: "center" },
  title: { fontSize: 22, fontWeight: "800", color: colors.navy, textAlign: "center", marginBottom: 6 },
  submitError: { color: colors.danger, textAlign: "center" },
  link: { color: colors.indigo, fontWeight: "700", textAlign: "center" },
  hint: { backgroundColor: "#E0F2FE", padding: 10, borderRadius: 10 },
  hintText: { color: colors.navy, textAlign: "center", fontSize: 12 },
});