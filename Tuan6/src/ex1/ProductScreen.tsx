import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { SelectPhoneParamList } from "./SelectPhoneApp";
import { Phone } from "../types";
import { PHONE_COLORS } from "../data/phones";
import { Stars } from "../components/Starts";
import { colors, formatPrice } from "../theme";

type Props = NativeStackScreenProps<SelectPhoneParamList, "Product"> & { phone: Phone };

export function ProductScreen({ navigation, route, phone }: Props) {
  const picked = route.params?.color;
  const shown = picked ?? phone.defaultColor;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.imageWrap}>
        <Image source={PHONE_COLORS[shown].image} style={styles.image} resizeMode="contain" />
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{phone.name}</Text>
        <View style={styles.row}>
          <Stars value={phone.rating} />
          <Text style={styles.review}>(Xem {phone.reviewCount} đánh giá)</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.price}>{formatPrice(phone.price)}</Text>
          <Text style={styles.oldPrice}>{formatPrice(phone.oldPrice)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.badge}>{phone.badge}</Text>
          <View style={styles.help}>
            <Text style={styles.helpText}>?</Text>
          </View>
        </View>

        {/* TODO 1: nút chọn màu */}
        <Pressable
          style={styles.chooseBtn}
          onPress={() => navigation.navigate("ChooseColor", { color: picked })}
        >
          <Text style={styles.chooseText}>
            {picked ? "4 MÀU-CHỌN LOẠI" : "4 MÀU-CHỌN MÀU"}
          </Text>
          <Text style={styles.arrow}>{">"}</Text>
        </Pressable>
      </View>

      {/* TODO 2: nút CHỌN MUA sát đáy */}
      <Pressable style={styles.buyBtn}>
        <Text style={styles.buyText}>CHỌN MUA</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
  imageWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  image: { width: "80%", height: "100%" },
  info: { paddingVertical: 12, gap: 8 },
  name: { fontSize: 15, color: colors.text },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  review: { fontSize: 13, color: colors.muted },
  price: { fontSize: 18, fontWeight: "bold", color: colors.text },
  oldPrice: { fontSize: 15, color: colors.muted, textDecorationLine: "line-through" },
  badge: { fontSize: 12, fontWeight: "bold", color: colors.red },
  help: {
    width: 16, height: 16, borderRadius: 8,
    borderWidth: 1, borderColor: colors.red,
    alignItems: "center", justifyContent: "center",
  },
  helpText: { fontSize: 10, color: colors.red, fontWeight: "bold" },
  chooseBtn: {
    marginTop: 8, height: 44, borderRadius: 6,
    borderWidth: 1, borderColor: colors.grey,
    alignItems: "center", justifyContent: "center",
  },
  chooseText: { fontSize: 14, fontWeight: "600", color: colors.text },
  arrow: { position: "absolute", right: 12, fontSize: 16, color: colors.text },
  buyBtn: {
    height: 48, borderRadius: 6, backgroundColor: colors.red,
    alignItems: "center", justifyContent: "center", marginBottom: 8,
  },
  buyText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});