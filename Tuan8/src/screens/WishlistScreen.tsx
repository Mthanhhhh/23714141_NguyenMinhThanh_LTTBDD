import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { BookGrid } from "../components/BookGrid"; // lưới 2 cột dùng lại
import { EmptyState } from "../components/EmptyState";
import { LoadingView } from "../components/LoadingView";
import { ErrorView } from "../components/ErrorView";
import { getBooks } from "../services/bookService";
import { getErrorMessage } from "../api/client";
import { useWishlist } from "../store/hooks";
import { RootScreenProps } from "../navigation/types";
import { Book } from "../types";
import { colors } from "../theme";

// BT8.8b: màn Danh sách yêu thích
export function WishlistScreen({ navigation }: RootScreenProps<"Wishlist">) {
  const { ids } = useWishlist();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1) lấy toàn bộ sách từ API (xử lý loading + lỗi + Thử lại)
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setBooks(await getBooks());
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  // 2) lọc theo id trong store: bỏ tim thì ids đổi → sách biến mất ngay
  const favorites = useMemo(() => books.filter((b) => ids.includes(b.id)), [books, ids]);

  // 3) loading / lỗi
  if (loading) return <LoadingView />;
  if (error) return <ErrorView message={error} onRetry={load} />;

  // 4) + 5) lưới sách và trạng thái trống
  return (
    <View style={styles.container}>
      <BookGrid
        data={favorites}
        onPressBook={(b) => navigation.navigate("BookDetail", { bookId: b.id })}
        ListEmptyComponent={
          <EmptyState
            emoji="💔"
            title="Chưa có sách yêu thích"
            message="Bấm vào biểu tượng ♡ trên bìa sách để lưu lại nhé."
            actionLabel="Khám phá sách"
            onAction={() => navigation.navigate("Tabs", { screen: "Home" })}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: colors.bg } });