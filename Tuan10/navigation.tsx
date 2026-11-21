import React from "react";
import { Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "./screens/HomeScreen";
import { DetailScreen } from "./screens/DetailScreen";
import { CartScreen } from "./screens/CartScreen";
import { FavoritesScreen } from "./screens/FavoritesScreen";
import { useAppSelector } from "./store/hooks";
import { selectCartCount } from "./store/cartSlice";
import { colors } from "./theme";

// 1. Khai báo kiểu cho từng màn và tham số của nó
export type RootStackParamList = {
  Tabs: undefined;
  Detail: { id: string };
};
export type TabParamList = { Home: undefined; Cart: undefined; Favorites: undefined };

// 2. Navigator tạo bằng hàm create...Navigator<kiểu>()
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function Tabs() {
  // BT10.7b: Bottom Tabs (không có header) gồm 3 tab: Sách, Giỏ hàng, Yêu thích
  // BT10.9c: badge trên tab Cart = tổng số lượng trong giỏ, tự cập nhật khi store đổi
  const count = useAppSelector(selectCartCount);
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.indigo }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Sách", tabBarIcon: () => <Text>📚</Text> }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        // undefined thì badge bị ẩn (khi giỏ trống)
        options={{ title: "Giỏ hàng", tabBarIcon: () => <Text>🛒</Text>, tabBarBadge: count > 0 ? count : undefined }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: "Yêu thích", tabBarIcon: () => <Text>♥</Text> }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  // BT10.7a: Native Stack gồm Tabs (không có header) và Detail (tiêu đề "Chi tiết sách")
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
      <Stack.Screen name="Detail" component={DetailScreen} options={{ title: "Chi tiết sách" }} />
    </Stack.Navigator>
  );
}