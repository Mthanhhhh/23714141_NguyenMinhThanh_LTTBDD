import React, { createContext, useContext, useMemo, useState } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";

type DrawerParamList = { Home: undefined; Profile: undefined; Settings: undefined };
const Drawer = createDrawerNavigator<DrawerParamList>();

// ===== TODO 3: Context cho notify / dark =====
type SettingsCtx = {
  notify: boolean;
  setNotify: (v: boolean) => void;
  dark: boolean;
  setDark: (v: boolean) => void;
};
const SettingsContext = createContext<SettingsCtx | null>(null);

function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings phải nằm trong <SettingsContext.Provider>");
  return ctx;
}

// màu theo chế độ sáng/tối
const theme = (dark: boolean) => ({
  bg: dark ? "#14171F" : "#FFFFFF",
  text: dark ? "#F3F4F6" : colors.text,
  muted: dark ? "#9CA3AF" : colors.muted,
  line: dark ? "#2A2F3A" : colors.line,
});

// ===== Home (có sẵn) =====
function HomeScreen() {
  const { dark } = useSettings();
  const t = theme(dark);
  return (
    <View style={[s.center, { backgroundColor: t.bg }]}>
      <Text style={[s.big, { color: t.text }]}>Xin chào 👋</Text>
    </View>
  );
}

// ===== Profile (có sẵn) =====
function ProfileScreen() {
  const { dark } = useSettings();
  const t = theme(dark);
  return (
    <View style={[s.center, { backgroundColor: t.bg }]}>
      <View style={s.avatar}>
        <Text style={s.avatarText}>NA</Text>
      </View>
      <Text style={[s.big, { color: t.text }]}>Nguyễn Minh Thành</Text>
      <Text style={[s.muted, { color: t.muted }]}>ngmthanh147258@gmail.com</Text>
    </View>
  );
}

// ===== TODO 1: Settings =====
function SettingsScreen() {
  const { notify, setNotify, dark, setDark } = useSettings();
  const t = theme(dark);
  return (
    <View style={[s.settingsRoot, { backgroundColor: t.bg }]}>
      <View style={[s.settingRow, { borderBottomColor: t.line }]}>
        <Text style={[s.label, { color: t.text }]}>Nhận thông báo</Text>
        <Switch value={notify} onValueChange={setNotify} />
      </View>
      <View style={[s.settingRow, { borderBottomColor: t.line }]}>
        <Text style={[s.label, { color: t.text }]}>Giao diện tối</Text>
        <Switch value={dark} onValueChange={setDark} />
      </View>
      <Text style={[s.status, { color: t.muted }]}>
        Thông báo: {notify ? "BẬT" : "TẮT"} · Giao diện: {dark ? "tối" : "sáng"}
      </Text>
    </View>
  );
}

// ===== TODO 2: Drawer =====
const ICONS: Record<keyof DrawerParamList, keyof typeof Ionicons.glyphMap> = {
  Home: "home-outline",
  Profile: "person-outline",
  Settings: "settings-outline",
};

function DrawerNav() {
  const { dark } = useSettings();
  const t = theme(dark);
  return (
    <Drawer.Navigator
      screenOptions={({ route }) => ({
        drawerActiveTintColor: colors.red,
        drawerInactiveTintColor: t.muted,
        drawerStyle: { backgroundColor: t.bg },
        headerStyle: { backgroundColor: t.bg },
        headerTintColor: t.text,
        drawerIcon: ({ color, size }) => (
          <Ionicons name={ICONS[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Drawer.Screen name="Home" component={HomeScreen} options={{ title: "Trang chủ" }} />
      <Drawer.Screen name="Profile" component={ProfileScreen} options={{ title: "Hồ sơ" }} />
      <Drawer.Screen name="Settings" component={SettingsScreen} options={{ title: "Cài đặt" }} />
    </Drawer.Navigator>
  );
}

export function DrawerApp() {
  const [notify, setNotify] = useState(true);
  const [dark, setDark] = useState(false);
  const value = useMemo(() => ({ notify, setNotify, dark, setDark }), [notify, dark]);

  return (
    <SettingsContext.Provider value={value}>
      <NavigationContainer>
        <DrawerNav />
      </NavigationContainer>
    </SettingsContext.Provider>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 6 },
  big: { fontSize: 22, fontWeight: "bold" },
  muted: { fontSize: 14 },
  avatar: {
    width: 96, height: 96, borderRadius: 48, backgroundColor: colors.blue,
    alignItems: "center", justifyContent: "center", marginBottom: 8,
  },
  avatarText: { color: "#fff", fontSize: 36, fontWeight: "bold" },
  settingsRoot: { flex: 1, padding: 16 },
  settingRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingVertical: 14, borderBottomWidth: 1,
  },
  label: { fontSize: 16 },
  status: { marginTop: 20, fontSize: 14 },
});