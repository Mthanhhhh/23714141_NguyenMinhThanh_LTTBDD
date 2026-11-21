import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index";

// Slice thứ hai, độc lập với giỏ hàng. State chỉ giữ id, thông tin sách vẫn lấy từ mảng BOOKS
const favoritesSlice = createSlice({
  name: "favorites",
  initialState: { ids: [] as string[] }, // state chỉ giữ id, không lưu cả sách
  reducers: {
    toggleFavorite(state, action: PayloadAction<string>) {
      // BT10.10a: id đã có trong state.ids thì bỏ ra, chưa có thì thêm vào
      const i = state.ids.indexOf(action.payload);
      if (i >= 0) state.ids.splice(i, 1); // có rồi thì bỏ ra
      else state.ids.push(action.payload); // chưa có thì thêm vào
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;

export const selectFavoriteIds = (s: RootState) => s.favorites.ids;
// Selector trả về selector: nhận id, trả về hàm đọc state
export const selectIsFavorite = (id: string) => (s: RootState) => s.favorites.ids.includes(id);