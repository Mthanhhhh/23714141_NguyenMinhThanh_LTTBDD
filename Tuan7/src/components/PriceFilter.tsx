import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { PRICE_RANGES, PriceRange } from "../utils/filters";
import { colors, radius } from "../theme";

interface Props {
  value: PriceRange;
  onChange: (v: PriceRange) => void;
}

export function PriceFilter({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {PRICE_RANGES.map((r) => {
        const active = value === r.key;
        return (
          <Pressable
            key={r.key}
            style={[styles.btn, active && styles.btnActive]}
            onPress={() => onChange(active ? null : r.key)}
          >
            <Text style={[styles.text, active && styles.textActive]}>{r.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 8, paddingHorizontal: 12, paddingBottom: 8 },
  btn: { flex: 1, paddingVertical: 8, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.cyan, alignItems: "center", backgroundColor: "#fff" },
  btnActive: { backgroundColor: colors.cyan },
  text: { color: colors.cyan, fontWeight: "700", fontSize: 13 },
  textActive: { color: "#fff" },
});