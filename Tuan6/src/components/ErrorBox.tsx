import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors } from "../theme";

export function ErrorBox({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>Có lỗi xảy ra</Text>
      <Text style={styles.message}>{message}</Text>
      <Pressable style={styles.btn} onPress={onRetry}>
        <Text style={styles.btnText}>THỬ LẠI</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 10, backgroundColor: "#fff" },
  title: { fontSize: 18, fontWeight: "bold", color: colors.red },
  message: { fontSize: 14, color: colors.muted, textAlign: "center" },
  btn: { marginTop: 8, paddingHorizontal: 28, height: 44, borderRadius: 6, backgroundColor: colors.red, alignItems: "center", justifyContent: "center" },
  btnText: { color: "#fff", fontWeight: "bold" },
});