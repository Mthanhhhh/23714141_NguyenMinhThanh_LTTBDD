import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { PHONES } from "../data/phones";
import { ProductRow } from "./ProductRow";
import { useFavorites } from "./FavoritesContext";
import { TabProps } from "./types";
import { colors } from "../theme";

export function FavoritesTab({ navigation }: TabProps<"Favorites">) {
  const { ids } = useFavorites();
  const saved = PHONES.filter((p) => ids.includes(p.id));

  if (saved.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>Chưa có sản phẩm nào được lưu.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={saved}
      keyExtractor={(p) => p.id}
      style={{ backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 16, gap: 10 }}
      renderItem={({ item }) => (
        <ProductRow
          phone={item}
          onPress={() => navigation.navigate("ProductDetails", { id: item.id })}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg },
  empty: { fontSize: 15, color: colors.muted },
});