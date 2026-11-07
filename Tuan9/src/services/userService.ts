import { api } from "../api/client";
import { User } from "../types";

// BT9.4: PATCH /users/:id chỉ với { name, phone }.
// json-server trả cả `password` → PHẢI loại password khỏi kết quả trước khi return (đừng đưa mật khẩu vào store).
export async function updateProfile(id: number, data: Pick<User, "name" | "phone">): Promise<User> {
  // PATCH chỉ đổi các trường được gửi (PUT sẽ thay cả object, thiếu trường nào là mất trường đó)
  const res = await api.patch<User & { password?: string }>(`/users/${id}`, {
    name: data.name,
    phone: data.phone,
  });
  const { password, ...safeUser } = res.data; // bỏ password
  void password;
  return safeUser;
}