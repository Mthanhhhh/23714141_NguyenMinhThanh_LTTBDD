import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Book, CartItem } from "../types";
import type { RootState } from "./index";

// slice = state + reducer + action cho một mảng chức năng (ở đây là giỏ hàng)
const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] as CartItem[] },
  reducers: {
    addToCart(state, action: PayloadAction<Pick<Book, "id" | "title" | "price">>) {
      // BT10.8a: Immer cho phép viết như sửa trực tiếp state (thực chất tạo state mới)
      const { id, title, price } = action.payload;
      const found = state.items.find((i) => i.bookId === id);
      if (found) {
        found.quantity += 1; // đã có trong giỏ: tăng số lượng
      } else {
        state.items.push({ bookId: id, title, price, quantity: 1 }); // chưa có: thêm mới
      }
    },
    decrease(state, action: PayloadAction<string>) {
      // BT10.9a: giảm quantity đi 1; nếu quantity đang là 1 thì xoá sách khỏi giỏ
      const found = state.items.find((i) => i.bookId === action.payload);
      if (!found) return;
      if (found.quantity <= 1) {
        state.items = state.items.filter((i) => i.bookId !== action.payload);
      } else {
        found.quantity -= 1;
      }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.bookId !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, decrease, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

// selector: hàm đọc dữ liệu từ state, dùng với useAppSelector
export const selectCartItems = (s: RootState) => s.cart.items;
// BT10.8b: tổng số lượng (cộng quantity của mọi dòng)
export const selectCartCount = (s: RootState): number => s.cart.items.reduce((n, i) => n + i.quantity, 0);
// BT10.8b: tổng tiền = tổng (price * quantity)
export const selectCartTotal = (s: RootState): number => s.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);