import React from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { PHONES, PHONE_COLORS } from "../data/phones";
import { Stars } from "../components/Starts";
import { useFavorites } from "./FavoritesContext";
import { RootProps } from "./types";
import { colors, formatPrice } from "../theme";

export function ProductDetailsScreen({ route }: RootProps<"ProductDetails">) {
  const { id } = route.params;                          // TODO 4
  const phone = PHONES.find((p) => p.id === id);
  const { has, toggle } = useFavorites();

  // TODO 5: không tìm thấy
  if (!phone) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>Không tìm thấy sản phẩm #{id}</Text>
      </View>
    );
  }

  const saved = has(phone.id);

  // TODO 6: hiển thị thông tin
  return (
    <ScrollView contentContainerStyle={styles.root}>
      <Image source={PHONE_COLORS[phone.defaultColor].image} style={styles.image} resizeMode="contain" />
      <Text style={styles.name}>{phone.name}</Text>
      <Stars value={phone.rating} />
      <Text style={styles.price}>{formatPrice(phone.price)}</Text>
      <Text style={styles.supplier}>
        Cung cấp bởi <Text style={styles.bold}>{phone.supplier}</Text>
      </Text>

      {/* TODO 7: nút yêu thích */}
      <Pressable
        style={[styles.favBtn, saved && styles.favBtnOn]}
        onPress={() => toggle(phone.id)}
      >
        <Text style={[styles.favText, saved && styles.favTextOn]}>
          {saved ? "♥ Đã lưu" : "♡ Lưu vào yêu thích"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { padding: 16, gap: 10, alignItems: "center", backgroundColor: "#fff", flexGrow: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  empty: { fontSize: 16, color: colors.muted },
  image: { width: "70%", height: 260 },
  name: { fontSize: 18, fontWeight: "bold", color: colors.text, textAlign: "center" },
  price: { fontSize: 22, fontWeight: "bold", color: colors.red },
  supplier: { fontSize: 14, color: colors.text },
  bold: { fontWeight: "bold" },
  favBtn: {
    marginTop: 12, alignSelf: "stretch", height: 46, borderRadius: 6,
    borderWidth: 1, borderColor: colors.red, alignItems: "center", justifyContent: "center",
  },
  favBtnOn: { backgroundColor: colors.red },
  favText: { fontSize: 16, fontWeight: "bold", color: colors.red },
  favTextOn: { color: "#fff" },
});