import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { Header } from "../components/Header";
import { CartItemRow } from "../components/CartItemRow";
import { PrimaryButton } from "../components/PrimaryButton";

import { EmptyState } from "../components/EmptyState";
import { useAuth, useCart } from "../store/hooks";
import { confirmDialog } from "../utils/dialog";
import { TabScreenProps } from "../navigation/types";
import { colors, formatPrice, radius } from "../theme";

// BT8.C2: mã giảm giá cố định ở phía client, mỗi mã trả về số tiền được giảm
const COUPONS: Record<string, (total: number) => number> = {
  SALE10: (t) => Math.round(t * 0.1), // giảm 10%
  GIAM50K: (t) => Math.min(50000, t), // giảm 50.000đ (không quá tổng tiền)
};

export function CartScreen({ navigation }: TabScreenProps<"Cart">) {
  const { items, totalPrice, setQty, remove } = useCart();
  const { isLoggedIn } = useAuth();

  // BT8.C2: state mã giảm giá
  const [code, setCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Giảm giá tính từ mã đã áp dụng, nên đổi số lượng thì giảm giá tự tính lại
  const discount = appliedCode ? COUPONS[appliedCode](totalPrice) : 0;
  const finalTotal = totalPrice - discount;

  const applyCoupon = () => {
    const c = code.trim().toUpperCase();
    if (!c) {
      setCouponError("Vui lòng nhập mã giảm giá");
      return;
    }
    if (!COUPONS[c]) {
      setAppliedCode(null);
      setCouponError("Mã giảm giá không hợp lệ");
      return;
    }
    setAppliedCode(c);
    setCouponError(null);
  };

  // BT8.7a: xóa có xác nhận
  const askRemove = (bookId: number) => {
    const item = items.find((i) => i.bookId === bookId);
    confirmDialog("Xóa sản phẩm", `Xóa "${item?.title ?? "sản phẩm này"}" khỏi giỏ hàng?`, () => remove(bookId));
  };

  // BT8.4: bảo vệ Checkout (tổng tiền truyền đi đã trừ giảm giá)
  const goCheckout = () => {
    if (isLoggedIn) {
      navigation.navigate("Checkout", { total: finalTotal });
    } else {
      navigation.navigate("Login", { redirectTo: "Checkout", total: finalTotal });
    }
  };

  return (
    <View style={styles.container}>
      <Header title="🛒 Giỏ hàng" />
      <FlatList
        data={items}
        keyExtractor={(i) => String(i.bookId)}
        renderItem={({ item }) => <CartItemRow item={item} onChangeQty={setQty} onRemove={askRemove} />}
        contentContainerStyle={{ paddingVertical: 8, flexGrow: 1 }}
        ListEmptyComponent={
          <EmptyState emoji="🛒" title="Giỏ hàng trống" message="Hãy chọn vài cuốn sách yêu thích nhé." actionLabel="Khám phá sách" onAction={() => navigation.navigate("Home")} />
        }
      />
      {items.length > 0 && (
        <View style={styles.footer}>
          {/* BT8.C2: ô nhập mã + nút Áp dụng */}
          <View style={styles.couponRow}>
            <TextInput
              style={[styles.couponInput, couponError ? styles.couponInputError : null]}
              value={code}
              onChangeText={setCode}
              placeholder="Mã giảm giá (SALE10, GIAM50K)"
              placeholderTextColor={colors.muted}
              autoCapitalize="characters"
            />
            <View style={{ width: 110 }}>
              <PrimaryButton title="Áp dụng" onPress={applyCoupon} />
            </View>
          </View>
          {couponError ? <Text style={styles.couponError}>{couponError}</Text> : null}
          {appliedCode ? <Text style={styles.couponOk}>Đã áp dụng mã {appliedCode}</Text> : null}

          <View style={styles.line}><Text style={styles.muted}>Tạm tính</Text><Text style={styles.value}>{formatPrice(totalPrice)}</Text></View>
          {discount > 0 && (
            <View style={styles.line}><Text style={styles.muted}>Giảm giá</Text><Text style={styles.discount}>-{formatPrice(discount)}</Text></View>
          )}
          <View style={styles.line}><Text style={styles.total}>Tổng cộng</Text><Text style={styles.total}>{formatPrice(finalTotal)}</Text></View>
          <PrimaryButton title="Thanh toán" onPress={goCheckout} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  footer: { backgroundColor: "#fff", padding: 14, gap: 8, borderTopWidth: 1, borderTopColor: colors.line },
  couponRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  couponInput: { flex: 1, backgroundColor: "#fff", borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 10, color: colors.text },
  couponInputError: { borderColor: colors.danger },
  couponError: { color: colors.danger, fontSize: 12 },
  couponOk: { color: "#16A34A", fontSize: 12, fontWeight: "700" },
  line: { flexDirection: "row", justifyContent: "space-between" },
  muted: { color: colors.muted },
  value: { fontWeight: "700", color: colors.text },
  discount: { fontWeight: "700", color: "#16A34A" },
  total: { fontSize: 17, fontWeight: "800", color: colors.navy },
});