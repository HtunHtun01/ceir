import React, { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { useApp } from "../context/AppContext";
import { Button, Card, Input, SectionHeader } from "../components/ui";
import * as Print from "expo-print";

export function PortalScreen() {
  const { t } = useApp();
  const [title, setTitle] = useState("Welcome to Space Tik Hotspot");
  const [subtitle, setSubtitle] = useState("Please log in to continue");
  const [language, setLanguage] = useState("my");
  const [price, setPrice] = useState("1000");
  const [printerName, setPrinterName] = useState("No printer paired");

  async function previewVoucher() {
    const html = `<html><body style="font-family:sans-serif;padding:24px;text-align:center;">
      <h2>Voucher Preview</h2><p>Code: VKPREVIEW01</p><p>Duration: 1h</p><p>Data: 500MB</p></body></html>`;
    await Print.printAsync({ html });
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <SectionHeader title={t("captivePortal")} />
      <Card>
        <Input label="Portal title" value={title} onChangeText={setTitle} />
        <Input label="Portal subtitle" value={subtitle} onChangeText={setSubtitle} />
        <Input label="Language" value={language} onChangeText={setLanguage} autoCapitalize="none" />
        <Input label="Price" value={price} onChangeText={setPrice} keyboardType="numeric" />
        <Button label={t("save")} onPress={() => Alert.alert("OK", "Captive portal settings saved (demo)")} />
      </Card>
      <SectionHeader title={t("bluetoothPrinter")} />
      <Card>
        <Text style={{ color: "#475569", marginBottom: 8 }}>Paired printer: {printerName}</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Button label="Pair printer" variant="secondary" onPress={() => Alert.alert("Info", "Bluetooth pairing requires a development build")} />
          <Button label={t("preview")} onPress={previewVoucher} />
        </View>
      </Card>
    </ScrollView>
  );
}
