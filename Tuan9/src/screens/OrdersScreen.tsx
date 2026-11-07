import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { StatusBadge } from "../components/StatusBadge";
import { PrimaryButton } from "../components/PrimaryButton";
import { EmptyState } from "../components/EmptyState";
import { LoadingView } from "../components/LoadingView";
import { ErrorView } from "../components/ErrorView";
import { getOrdersByUser } from "../services/orderService";
import { getBooks } from "../services/bookService";
import { getErrorMessage } from "../api/client";
import { useAuth, useCart } from "../store/hooks";
import { formatDateTime } from "../utils/format";
import { showMessage } from "../utils/dialog";
import { RootScreenProps } from "../navigation/types";
import { Order, OrderStatus } from "../types";
import { colors, formatPrice, radius } from "../theme";

export const PAYMENT_LABEL = { cod: "Thanh toán khi nhận hàng (COD)", bank: "Chuyển khoản ngân hàng" } as const;

// Câu 5: các lựa chọn của bộ lọc trạng thái
const FILTERS: { key: "all" | OrderStatus; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ xác nhận" },
  { key: "shipping", label: "Đang giao" },
  { key: "completed", label: "Hoàn tất" },
  { key: "cancelled", label: "Đã huỷ" },
];

export function OrdersScreen({ navigation }: RootScreenProps<"Orders">) {
  const { user, isLoggedIn } = useAuth();
  const { items: cartItems, add, setQty } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<number | null>(null); // đơn đang mở rộng (xem chi tiết ngay tại màn này)
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all"); // Câu 5: trạng thái đang lọc
  const [reorderingId, setReorderingId] = useState<number | null>(null); // BT9.C1: đơn đang được "Mua lại"

  // BT9.3a: tải danh sách đơn của user, mới nhất lên đầu
  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getOrdersByUser(user.id);
      // sắp xếp lại ở client cho chắc (chuỗi ISO so sánh được)
      setOrders([...data].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [user]);
  useEffect(() => {
    load();
  }, [load]);

  // BT9.C1 (thử thách "Mua lại"): thêm lại toàn bộ sản phẩm của đơn vào giỏ hiện tại
  const reorder = async (order: Order) => {
    setReorderingId(order.id);
    try {
      // lấy giá và tồn kho MỚI NHẤT (giá trong đơn cũ có thể đã khác)
      const books = await getBooks();
      const skipped: string[] = []; // sách hết hàng hoặc không còn bán
      const reduced: string[] = []; // sách bị giảm số lượng vì không đủ tồn kho

      for (const it of order.items) {
        const book = books.find((b) => b.id === it.bookId);
        if (!book || book.stock <= 0) {
          skipped.push(it.title);
          continue;
        }
        const existing = cartItems.find((c) => c.bookId === it.bookId);
        const wanted = (existing?.quantity ?? 0) + it.quantity; // cùng sách thì CỘNG số lượng
        const finalQty = Math.min(wanted, book.stock); // không vượt tồn kho
        if (finalQty < wanted) reduced.push(book.title);

        if (!existing) {
          add({ bookId: book.id, title: book.title, price: book.price, emoji: book.emoji, color: book.color, stock: book.stock });
        }
        setQty(book.id, finalQty);
      }

      // thông báo kết quả rồi chuyển sang tab Giỏ
      let msg = "Đã thêm sản phẩm của đơn này vào giỏ hàng.";
      if (reduced.length) msg += `\nGiảm số lượng do không đủ tồn kho: ${reduced.join(", ")}.`;
      if (skipped.length) msg += `\nKhông thể thêm (hết hàng): ${skipped.join(", ")}.`;
      showMessage("Mua lại", msg, () => navigation.navigate("Tabs", { screen: "Cart" }));
    } catch (e) {
      showMessage("Không thể mua lại", getErrorMessage(e));
    } finally {
      setReorderingId(null);
    }
  };

  if (!isLoggedIn) {
    return <EmptyState emoji="🔒" title="Bạn cần đăng nhập" actionLabel="Đăng nhập" onAction={() => navigation.navigate("Login")} />;
  }
  if (loading) return <LoadingView />;
  if (error) return <ErrorView message={error} onRetry={load} />;

  // Câu 5: CHỖ SỬA DUY NHẤT trong dữ liệu truyền cho FlatList — lọc theo trạng thái
  const visibleOrders = statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter);

  return (
    <View style={styles.container}>
      {/* Câu 5: hàng nút lọc trạng thái */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar} contentContainerStyle={styles.filterRow}>
        {FILTERS.map((f) => (
          <Pressable
            key={f.key}
            onPress={() => setStatusFilter(f.key)}
            style={[styles.chip, statusFilter === f.key && styles.chipActive]}
          >
            <Text style={[styles.chipText, statusFilter === f.key && styles.chipTextActive]}>{f.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* BT9.3b: danh sách đơn hàng, mỗi thẻ bấm để mở rộng chi tiết */}
      <FlatList
        data={visibleOrders}
        keyExtractor={(o) => String(o.id)}
        contentContainerStyle={{ gap: 10, flexGrow: 1 }}
        renderItem={({ item: o }) => {
          const open = openId === o.id; // mỗi thẻ tự biết nó mở hay đóng
          return (
            <Pressable style={styles.card} onPress={() => setOpenId(open ? null : o.id)}>
              <View style={styles.row}>
                <Text style={styles.orderId}>Đơn #{o.id}</Text>
                <StatusBadge status={o.status} />
              </View>
              <Text style={styles.date}>{formatDateTime(o.createdAt)}</Text>
              <View style={styles.row}>
                <Text style={styles.total}>{formatPrice(o.total)}</Text>
                <Text style={styles.toggle}>Chi tiết {open ? "▲" : "▼"}</Text>
              </View>

              {open && (
                <View style={styles.detail}>
                  {o.items.map((it) => (
                    <View key={it.bookId} style={styles.row}>
                      <Text style={styles.itemTitle} numberOfLines={1}>{it.title} × {it.quantity}</Text>
                      <Text style={styles.itemPrice}>{formatPrice(it.price * it.quantity)}</Text>
                    </View>
                  ))}
                  <Text style={styles.label}>Giao đến</Text>
                  <Text style={styles.value}>{o.address.name} · {o.address.phone}</Text>
                  <Text style={styles.value}>{o.address.address}</Text>
                  <Text style={styles.label}>Thanh toán</Text>
                  <Text style={styles.value}>{PAYMENT_LABEL[o.paymentMethod]}</Text>
                  {/* BT9.C1: nút "Mua lại" chỉ hiện ở đơn đã hoàn tất */}
                  {o.status === "completed" && (
                    <View style={{ marginTop: 8 }}>
                      <PrimaryButton title="Mua lại" onPress={() => reorder(o)} loading={reorderingId === o.id} />
                    </View>
                  )}
                </View>
              )}
            </Pressable>
          );
        }}
        // BT9.3c: chưa có đơn thì hiện trạng thái rỗng (có đơn nhưng lọc không ra thì báo khác)
        ListEmptyComponent={
          orders.length > 0 ? (
            <EmptyState emoji="🔎" title="Không có đơn nào ở trạng thái này" />
          ) : (
            <EmptyState
              emoji="🧾"
              title="Bạn chưa có đơn hàng nào"
              actionLabel="Mua sắm ngay"
              onAction={() => navigation.navigate("Tabs", { screen: "Home" })}
            />
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 12, gap: 10 },
  filterBar: { flexGrow: 0 },
  filterRow: { gap: 8, paddingBottom: 2 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, backgroundColor: "#fff", borderWidth: 1, borderColor: colors.line },
  chipActive: { backgroundColor: colors.indigo, borderColor: colors.indigo },
  chipText: { color: colors.text, fontWeight: "600", fontSize: 13 },
  chipTextActive: { color: "#fff" },
  card: { backgroundColor: "#fff", borderRadius: radius.md, padding: 12, gap: 6 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
  orderId: { fontWeight: "800", color: colors.navy, fontSize: 16 },
  date: { color: colors.muted, fontSize: 12 },
  total: { fontWeight: "800", color: colors.indigo, fontSize: 17 },
  toggle: { color: colors.indigo, fontWeight: "700" },
  detail: { borderTopWidth: 1, borderTopColor: colors.line, marginTop: 6, paddingTop: 8, gap: 4 },
  itemTitle: { flex: 1, color: colors.text },
  itemPrice: { fontWeight: "700", color: colors.text },
  label: { color: colors.muted, fontSize: 12, marginTop: 6 },
  value: { color: colors.text },
});