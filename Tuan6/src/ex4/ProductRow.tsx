import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Phone } from "../types";
import { PHONE_COLORS } from "../data/phones";
import { colors, formatPrice } from "../theme";

export function ProductRow({ phone, onPress }: { phone: Phone; onPress: () => void }) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <Image source={PHONE_COLORS[phone.defaultColor].image} style={styles.img} resizeMode="contain" />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{phone.name.split(" - ")[0]}</Text>
        <Text style={styles.price}>{formatPrice(phone.price)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row", alignItems: "center", gap: 12, padding: 12,
    backgroundColor: "#fff", borderRadius: 8, borderWidth: 1, borderColor: colors.line,
  },
  img: { width: 56, height: 72 },
  info: { flex: 1, gap: 4 },
  name: { fontSize: 15, fontWeight: "600", color: colors.text },
  price: { fontSize: 14, color: colors.red, fontWeight: "bold" },
});