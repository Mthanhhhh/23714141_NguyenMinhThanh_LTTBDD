import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Book } from "../types";
import { API_URL } from "../config";
import type { RootState } from "./index";

type Status = "idle" | "loading" | "succeeded" | "failed";

// BT10.11a: createAsyncThunk = một hàm bất đồng bộ + ba hành động tự sinh (pending, fulfilled, rejected)
//   rejectWithValue(msg): gửi thông báo lỗi tiếng Việt làm payload của hành động rejected
export const fetchBooks = createAsyncThunk<Book[], void, { rejectValue: string }>(
  "books/fetchBooks",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/books`);
      // HTTP lỗi (404, 500...) không làm fetch ném lỗi, nên phải tự kiểm tra res.ok
      if (!res.ok) return rejectWithValue(`Máy chủ trả về lỗi ${res.status}`);
      return (await res.json()) as Book[];
    } catch {
      // lỗi mạng (server tắt, sai địa chỉ...) thì fetch ném lỗi
      return rejectWithValue(`Không kết nối được tới ${API_URL}`);
    }
  }
);

const booksSlice = createSlice({
  name: "books",
  initialState: { items: [] as Book[], status: "idle" as Status, error: null as string | null },
  reducers: {},
  extraReducers: (builder) => {
    // BT10.11b: extraReducers lắng nghe ba hành động của thunk để cập nhật state của slice
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = "loading"; // vừa bắt đầu gọi
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = "succeeded"; // gọi xong, có dữ liệu
        state.items = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = "failed"; // lỗi mạng hoặc HTTP lỗi
        state.error = action.payload ?? "Không tải được dữ liệu";
      });
  },
});

export default booksSlice.reducer;

export const selectBooksState = (s: RootState) => s.books;