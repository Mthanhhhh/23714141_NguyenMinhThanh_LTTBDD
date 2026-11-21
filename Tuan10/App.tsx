import React from "react";
import { Provider } from "react-redux"; // BT10.8c
import { store } from "./store"; // BT10.8c
import { SafeAreaProvider } from "react-native-safe-area-context"; // BT10.1a
import { NavigationContainer } from "@react-navigation/native"; // BT10.7c
import { RootNavigator } from "./navigation"; // BT10.7c

export default function App() {
  // BT10.8c: Provider ở NGOÀI CÙNG để mọi màn hình (kể cả các tab) đều dùng được store
  // BT10.1a: SafeAreaProvider đặt MỘT LẦN ở gốc ứng dụng để tính vùng an toàn của thiết bị
  // BT10.7c: NavigationContainer bao ngoài cùng của phần điều hướng, một lần duy nhất
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}