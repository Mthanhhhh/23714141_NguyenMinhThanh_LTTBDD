import { useEffect } from "react";
import { saveJSON } from "../storage/storage";

// HOOK CHUNG: mỗi khi `value` đổi (và đã nạp xong dữ liệu cũ) → tự ghi vào AsyncStorage.
// Dùng cho cart, wishlist… — không phải viết lại effect ở từng nơi.
export function useAutoPersist<T>(key: string, value: T, ready: boolean) {
  // BT8.7b: chưa ready thì KHÔNG ghi, tránh ghi đè dữ liệu cũ bằng giá trị rỗng ban đầu
  useEffect(() => {
    if (ready) saveJSON(key, value);
  }, [key, value, ready]);
}