import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";
import { useAppDispatch, useAppSelector } from "../store/hooks"; // BT10.9b, BT10.10b
import { addToCart } from "../store/cartSlice"; // BT10.9b
import { selectIsFavorite, toggleFavorite } from "../store/favoritesSlice"; // BT10.10b
import { getBookById } from "../data/books";
import { formatPrice } from "../utils";
import { colors } from "../theme";

export function DetailScreen({ route }: NativeStackScreenProps<RootStackParamList, "Detail">) {
  const { id } = route.params; // tham số do màn Home truyền sang
  const dispatch = useAppDispatch(); // BT10.9b: dùng để gửi hành động tới store
  // BT10.10b: đọc từ store, tự cập nhật khi store đổi (trạng thái nằm trong store nên vào lại vẫn giữ)
  const favorite = useAppSelector(selectIsFavorite(id));
  const book = getBookById(id);

  if (!book) return <Text style={{ padding: 20 }}>Không tìm thấy sách.</Text>;

  return (
    <ScrollView contentContainerStyle={styles.box}>
      <Image source={{ uri: book.cover }} style={styles.cover} resizeMode="cover" />
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.sub}>{book.author} · {book.category}</Text>
      <Text style={styles.sub}>⭐ {book.rating.toFixed(1)} / 10</Text>
      <Text style={styles.price}>{formatPrice(book.price)}  {book.inStock ? "✅ Còn hàng" : "❌ Hết hàng"}</Text>
      <Text style={styles.desc}>{book.description}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.btn, !book.inStock && { opacity: 0.4 }]}
          disabled={!book.inStock}
          onPress={() => {
            // BT10.9b: book có id, title, price → khớp Pick<Book, "id" | "title" | "price">
            dispatch(addToCart(book));
          }}
          testID="add-cart"
        >
          <Text style={styles.btnText}>Thêm vào giỏ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.btnFav, favorite && styles.btnFavOn]}
          onPress={() => {
            // BT10.10b: có rồi thì bỏ, chưa có thì thêm (reducer toggleFavorite lo việc đó)
            dispatch(toggleFavorite(book.id));
          }}
          testID="toggle-fav"
        >
          <Text style={[styles.btnText, !favorite && { color: colors.indigo }]}>{favorite ? "♥ Đã yêu thích" : "♡ Yêu thích"}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  box: { padding: 16, gap: 8, backgroundColor: colors.bg },
  cover: { width: "100%", aspectRatio: 2 / 3, maxHeight: 360, borderRadius: 12, backgroundColor: colors.indigo },
  title: { fontSize: 22, fontWeight: "800", color: colors.navy, marginTop: 6 },
  sub: { color: colors.muted },
  price: { fontSize: 18, fontWeight: "800", color: colors.indigo },
  desc: { color: colors.text, lineHeight: 21 },
  actions: { flexDirection: "row", gap: 10, marginTop: 10 },
  btn: { flex: 1, backgroundColor: colors.indigo, paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  btnFav: { backgroundColor: "#fff", borderWidth: 1.5, borderColor: colors.indigo },
  btnFavOn: { backgroundColor: colors.red, borderColor: colors.red },
  btnText: { color: "#fff", fontWeight: "800" },
});