import React from "react";
import { FlatList } from "react-native";
import { PHONES } from "../data/phones";
import { ProductRow } from "./ProductRow";
import { TabProps } from "./types";
import { colors } from "../theme";

export function ProductsTab({ navigation }: TabProps<"Products">) {
  return (
    <FlatList
      data={PHONES}
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