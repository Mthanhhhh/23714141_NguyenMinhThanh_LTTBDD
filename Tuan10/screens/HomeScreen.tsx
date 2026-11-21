import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList, TabParamList } from "../navigation";
import { loadBooks } from "../data/books";
import { normalize } from "../utils";
import type { Book } from "../types";
import BookCard from "../components/BookCard";
import { colors } from "../theme";
import { USE_API } from "../config"; // BT10.11c
import { fetchBooks, selectBooksState } from "../store/booksSlice"; // BT10.11c
import { useAppDispatch, useAppSelector } from "../store/hooks"; // BT10.11c

type Props = CompositeScreenProps<BottomTabScreenProps<TabParamList, "Home">, NativeStackScreenProps<RootStackParamList>>;

export function HomeScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const api = useAppSelector(selectBooksState); // BT10.11c: { items, status, error } của slice books
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [isTile, setIsTile] = useState(false); // Switch "Dạng lưới"
  const [onlyInStock, setOnlyInStock] = useState(false); // T1: chỉ hiện sách còn hàng
  const [sortAsc, setSortAsc] = useState(false);         // T2: sắp xếp giá tăng dần
  // BT10.11c: đang đọc từ API hay từ mảng. Bắt đầu theo USE_API; nút "Dùng dữ liệu mảng" đổi về false
  const [useApi, setUseApi] = useState(USE_API);

  // Lần đầu: tải mảng (có độ trễ giả lập) rồi tắt trạng thái loading
  useEffect(() => {
    loadBooks().then((data) => {
      setBooks(data);
      setLoading(false);
    });
  }, []);

  // BT10.11c: khi đọc từ API thì gọi thunk fetchBooks (trạng thái nằm trong store)
  useEffect(() => {
    if (useApi) dispatch(fetchBooks());
  }, [useApi, dispatch]);

  // BT10.5b + BT10.11c: kéo để làm mới. API thì gọi lại thunk, mảng thì tải lại mảng.
  //   (finally để vòng xoay luôn tắt, kể cả khi có lỗi)
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (useApi) await dispatch(fetchBooks());
      else setBooks(await loadBooks());
    } finally {
      setRefreshing(false);
    }
  }, [useApi, dispatch]);

  // BT10.11c: nguồn dữ liệu của Home. categories và visible đều dùng sourceBooks
  const sourceBooks = useApi ? api.items : books;

  const categories = useMemo(() => Array.from(new Set(sourceBooks.map((b) => b.category))), [sourceBooks]);

  // BT10.6: dữ liệu suy ra (visible) tính từ state gốc, KHÔNG lưu thành state riêng.
  //   useMemo chỉ tính lại khi sourceBooks, keyword hoặc category đổi.
  const visible = useMemo(() => {
  const k = normalize(keyword);
  const list = sourceBooks.filter((b) => {
    const okCategory = category === null || b.category === category;
    const okKeyword = k === "" || normalize(b.title).includes(k) || normalize(b.author).includes(k);
    const okStock = !onlyInStock || b.inStock; // T1: thêm một điều kiện VÀ
    return okCategory && okKeyword && okStock;
  });
  // T2: sắp xếp trên một BẢN SAO, không sort trực tiếp trên state
  return sortAsc ? [...list].sort((a, b) => a.price - b.price) : list;
}, [sourceBooks, keyword, category, onlyInStock, sortAsc]); // T1, T2: thêm hai biến mới vào mảng phụ thuộc

  // BT10.3d: onSelect phải ỔN ĐỊNH giữa các lần render (useCallback) thì React.memo của BookCard mới có tác dụng
  const onSelect = useCallback(
    (id: string) => {
      // BT10.7d: chuyển sang màn Chi tiết, truyền id của sách qua route.params
      navigation.navigate("Detail", { id });
    },
    [navigation]
  );

  // BT10.5a: Switch bật thì 2 cột (tile), tắt thì 1 cột (row)
  const numColumns = isTile ? 2 : 1;

  // BT10.11c: đang tải? (API: chưa gọi hoặc đang gọi lần đầu, chưa có dữ liệu; mảng: cờ loading)
  const isLoading = useApi ? api.status === "idle" || (api.status === "loading" && api.items.length === 0) : loading;
  // BT10.11c: API lỗi và chưa có dữ liệu nào để hiện thì hiện màn lỗi
  const showError = useApi && api.status === "failed" && api.items.length === 0;

  return (
    // BT10.1b: SafeAreaView (chỉ chừa lề phía trên) làm gốc của màn Home,
    //   nội dung không bị đè bởi tai thỏ / thanh trạng thái
    <SafeAreaView style={styles.root} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>📚 BookStore</Text>
        <TextInput
          style={styles.search}
          placeholder="Tìm theo tên sách hoặc tác giả…"
          placeholderTextColor="#9AA3B8"
          value={keyword}
          onChangeText={setKeyword}
        />
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Dạng lưới</Text>
          <Switch value={isTile} onValueChange={setIsTile} testID="grid-switch" />
        </View>
      </View>

      <View style={styles.chips}>
  {[null, ...categories].map((c) => (
    <TouchableOpacity
      key={c ?? "all"}
      style={[styles.chip, category === c && styles.chipOn]}
      onPress={() => setCategory(c)}
      testID={`chip-${c ?? "all"}`}
    >
      <Text style={[styles.chipText, category === c && styles.chipTextOn]}>{c ?? "Tất cả"}</Text>
    </TouchableOpacity>
  ))}

  {/* T1: chỉ còn hàng */}
  <TouchableOpacity
    style={[styles.chip, onlyInStock && styles.chipOn]}
    onPress={() => setOnlyInStock((v) => !v)}
    testID="chip-instock"
  >
    <Text style={[styles.chipText, onlyInStock && styles.chipTextOn]}>Chỉ còn hàng</Text>
  </TouchableOpacity>

  {/* T2: giá tăng dần */}
  <TouchableOpacity
    style={[styles.chip, sortAsc && styles.chipOn]}
    onPress={() => setSortAsc((v) => !v)}
    testID="chip-sort"
  >
    <Text style={[styles.chipText, sortAsc && styles.chipTextOn]}>Giá tăng dần</Text>
  </TouchableOpacity>
</View>

      {isLoading ? (
        // BT10.2b: đang tải thì hiện vòng xoay kèm chữ
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.indigo} />
          <Text style={styles.empty}>Đang tải sách…</Text>
        </View>
      ) : showError ? (
        // BT10.11c: trạng thái "failed": thông báo lỗi + nút "Thử lại" + nút "Dùng dữ liệu mảng"
        <View style={styles.center}>
          <Text style={styles.errorTitle}>Không tải được danh sách sách</Text>
          <Text style={styles.errorText}>{api.error}</Text>
          <View style={styles.errorActions}>
            <TouchableOpacity style={styles.errBtn} onPress={() => dispatch(fetchBooks())}>
              <Text style={styles.errBtnText}>Thử lại</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.errBtn, styles.errBtnAlt]} onPress={() => setUseApi(false)}>
              <Text style={[styles.errBtnText, { color: colors.indigo }]}>Dùng dữ liệu mảng</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // BT10.2a: FlatList chỉ vẽ các dòng đang nằm trong màn hình (cuộn tới đâu vẽ tới đó)
        <FlatList
          // BT10.5a: FlatList KHÔNG cho đổi numColumns khi đang chạy, nên đổi key để React dựng lại FlatList mới
          key={String(numColumns)}
          numColumns={numColumns}
          // columnWrapperStyle chỉ dùng được khi numColumns > 1
          columnWrapperStyle={isTile ? styles.columnWrapper : undefined}
          data={visible}
          keyExtractor={(b) => b.id} // khoá duy nhất cho từng dòng, phải là chuỗi
          // BT10.3d: mỗi dòng là một BookCard
          renderItem={({ item }) => <BookCard book={item} layout={isTile ? "tile" : "row"} onSelect={onSelect} />}
          // BT10.11c: làm mới API thất bại nhưng vẫn còn dữ liệu cũ thì báo bằng dòng đỏ phía trên danh sách
          ListHeaderComponent={
            useApi && api.status === "failed" ? <Text style={styles.banner}>{api.error}</Text> : null
          }
          // BT10.6: lọc không ra kết quả thì hiện dòng này
          ListEmptyComponent={<Text style={styles.empty}>Không tìm thấy sách phù hợp.</Text>}
          contentContainerStyle={{ padding: 14 }}
          // BT10.5b: kéo danh sách xuống để làm mới
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { backgroundColor: colors.navy, paddingHorizontal: 14, paddingBottom: 12, paddingTop: 6, gap: 8 },
  title: { color: "#fff", fontSize: 22, fontWeight: "800" },
  search: { backgroundColor: "#fff", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9 },
  switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 8 },
  switchLabel: { color: "#D5DDF7", fontWeight: "600" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingHorizontal: 14, paddingTop: 10 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: "#fff", borderWidth: 1, borderColor: colors.line },
  chipOn: { backgroundColor: colors.indigo, borderColor: colors.indigo },
  chipText: { color: colors.text, fontWeight: "600", fontSize: 13 },
  chipTextOn: { color: "#fff" },
  columnWrapper: { justifyContent: "space-between" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10 },
  errorTitle: { fontSize: 16, fontWeight: "700", color: colors.text },
  errorText: { color: colors.muted, textAlign: "center", paddingHorizontal: 24 },
  errorActions: { flexDirection: "row", gap: 10, marginTop: 6 },
  errBtn: { backgroundColor: colors.indigo, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: colors.indigo },
  errBtnAlt: { backgroundColor: "#fff" },
  errBtnText: { color: "#fff", fontWeight: "700" },
  banner: { color: "#B42318", marginBottom: 8, textAlign: "center" },
  empty: { textAlign: "center", color: colors.muted, marginTop: 30 },
  plain: { fontSize: 15, color: colors.text, paddingVertical: 4 },
});