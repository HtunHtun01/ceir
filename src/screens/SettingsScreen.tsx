import React from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { useApp } from "../context/AppContext";
import { Button, Card, SectionHeader } from "../components/ui";

export function SettingsScreen() {
  const { t, language, setLanguage } = useApp();

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <SectionHeader title={t("settings")} />
      <Card>
        <Text style={{ fontWeight: "600", marginBottom: 8 }}>{t("language")}</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Button label="မြန်မာ" onPress={() => setLanguage("my")} variant={language === "my" ? "primary" : "secondary"} />
          <Button label="English" onPress={() => setLanguage("en")} variant={language === "en" ? "primary" : "secondary"} />
        </View>
      </Card>
      <Card>
        <Text style={{ fontWeight: "600", marginBottom: 8 }}>{t("theme")}</Text>
        <Text style={{ color: "#475569" }}>Light theme is enabled by default.</Text>
      </Card>
      <Card>
        <Text style={{ fontWeight: "600", marginBottom: 8 }}>{t("privacy")}</Text>
        <Text style={{ color: "#475569" }}>Router credentials are stored securely on this device only.</Text>
      </Card>
      <Card>
        <Text style={{ fontWeight: "600", marginBottom: 8 }}>{t("terms")}</Text>
        <Text style={{ color: "#475569" }}>Use router/firewall changes only on a test router first.</Text>
      </Card>
      <Card>
        <Text style={{ fontWeight: "600", marginBottom: 8 }}>{t("account")}</Text>
        <Text style={{ color: "#475569" }}>Space Tik account features are available in a future release.</Text>
        <View style={{ marginTop: 8 }}>
          <Button label="Check updates" variant="secondary" onPress={() => Alert.alert("Space Tik", "You are on the latest version (demo)")} />
        </View>
      </Card>
    </ScrollView>
  );
}
