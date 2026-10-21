import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AppProvider, useApp } from "./src/context/AppContext";
import { ConnectionScreen } from "./src/screens/ConnectionScreen";
import { DashboardScreen } from "./src/screens/DashboardScreen";
import { HotspotScreen } from "./src/screens/HotspotScreen";
import { NetworkScreen } from "./src/screens/NetworkScreen";
import { PortalScreen } from "./src/screens/PortalScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";

type Tab = "connect" | "dashboard" | "hotspot" | "network" | "portal" | "settings";

function Shell() {
  const { t, connected } = useApp();
  const [tab, setTab] = useState<Tab>("dashboard");

  const tabs: { key: Tab; label: string }[] = [
    { key: "connect", label: t("routerConnection") },
    { key: "dashboard", label: t("dashboard") },
    { key: "hotspot", label: t("hotspot") },
    { key: "network", label: t("network") },
    { key: "portal", label: t("portal") },
    { key: "settings", label: t("settings") },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>{t("appName")}</Text>
        <Text style={styles.subtitle}>{connected ? t("connected") : t("disconnected")}</Text>
      </View>
      <View style={styles.content}>
        {tab === "connect" ? <ConnectionScreen /> : null}
        {tab === "dashboard" ? (connected ? <DashboardScreen /> : <ConnectionScreen />) : null}
        {tab === "hotspot" ? <HotspotScreen /> : null}
        {tab === "network" ? <NetworkScreen /> : null}
        {tab === "portal" ? <PortalScreen /> : null}
        {tab === "settings" ? <SettingsScreen /> : null}
      </View>
      <View style={styles.tabBar}>
        {tabs.map((item) => (
          <Text
            key={item.key}
            onPress={() => setTab(item.key)}
            style={[styles.tab, tab === item.key && styles.tabActive]}
          >
            {item.label}
          </Text>
        ))}
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0F172A" },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
  title: { color: "#FFFFFF", fontSize: 22, fontWeight: "800" },
  subtitle: { color: "#CBD5E1", fontSize: 12 },
  content: { flex: 1, backgroundColor: "#F8FAFC" },
  tabBar: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    padding: 8,
    gap: 6,
  },
  tab: { paddingHorizontal: 10, paddingVertical: 8, color: "#475569", fontSize: 12, borderRadius: 999 },
  tabActive: { backgroundColor: "#0F172A", color: "#FFFFFF" },
});
