import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { useApp } from "../context/AppContext";
import { Button, Card, Input, SectionHeader } from "../components/ui";
import { detectDefaultGateway, connectToRouter } from "../services/routeros";
import { saveCredentials, loadCredentials, clearCredentials } from "../storage/secureCredentials";
import { isValidIpv4 } from "../utils/format";

export function ConnectionScreen() {
  const { t, credentials, setCredentials, setRouterStatus, connected } = useApp();
  const [host, setHost] = useState(credentials?.host ?? "");
  const [username, setUsername] = useState(credentials?.username ?? "");
  const [password, setPassword] = useState(credentials?.password ?? "");
  const [busy, setBusy] = useState(false);
  const [statusText, setStatusText] = useState("");

  useEffect(() => {
    loadCredentials().then((stored) => {
      if (stored) {
        setHost(stored.host);
        setUsername(stored.username);
        setPassword(stored.password);
      }
    });
  }, []);

  async function autoDetect() {
    setBusy(true);
    try {
      const gateway = await detectDefaultGateway();
      if (gateway) {
        setHost(gateway);
        setStatusText(`${t("autoDetect")}: ${gateway}`);
      }
    } finally {
      setBusy(false);
    }
  }

  async function connect() {
    if (!isValidIpv4(host)) {
      Alert.alert(t("warning"), "Invalid IPv4 address");
      return;
    }
    setBusy(true);
    try {
      const creds = { host: host.trim(), username: username.trim(), password, protocol: "unknown" as const };
      const status = await connectToRouter(creds);
      await saveCredentials(creds);
      setCredentials(creds);
      setRouterStatus(status);
      setStatusText(t("connected"));
    } catch (error) {
      Alert.alert(t("warning"), error instanceof Error ? error.message : "Connection failed");
      setStatusText(t("disconnected"));
    } finally {
      setBusy(false);
    }
  }

  async function disconnect() {
    await clearCredentials();
    setCredentials(null);
    setRouterStatus(null);
    setStatusText(t("disconnected"));
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <SectionHeader title={t("routerConnection")} />
      <Card>
        <Button label={t("autoDetect")} onPress={autoDetect} variant="secondary" disabled={busy} />
        <View style={{ height: 12 }} />
        <Input label={t("host")} value={host} onChangeText={setHost} placeholder="192.168.88.1" keyboardType="default" autoCapitalize="none" />
        <Input label={t("username")} value={username} onChangeText={setUsername} autoCapitalize="none" />
        <Input label={t("password")} value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" />
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Button label={t("connect")} onPress={connect} disabled={busy} />
          <Button label={t("disconnect")} onPress={disconnect} variant="secondary" disabled={busy} />
        </View>
        <Text style={{ marginTop: 12, color: connected ? "#16A34A" : "#DC2626", fontWeight: "600" }}>
          {connected ? t("connected") : t("disconnected")} {statusText ? `· ${statusText}` : ""}
        </Text>
      </Card>
      <Card>
        <Text style={{ color: "#475569" }}>
          Router administrator credentials are stored only in this phone's secure storage. They are not embedded in the APK, backend, or logs.
        </Text>
      </Card>
    </ScrollView>
  );
}
