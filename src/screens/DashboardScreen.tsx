import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useApp } from "../context/AppContext";
import { Button, Card, Row, SectionHeader } from "../components/ui";
import { fetchStatus, fetchConnectedUsers, fetchTraffic } from "../services/routeros";
import { formatBytes, formatPercent, formatRate } from "../utils/format";
import { ConnectedUser, TrafficSample } from "../types/router";

export function DashboardScreen() {
  const { t, connected } = useApp();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Awaited<ReturnType<typeof fetchStatus>> | null>(null);
  const [users, setUsers] = useState<ConnectedUser[]>([]);
  const [traffic, setTraffic] = useState<TrafficSample[]>([]);

  async function refresh() {
    if (!connected) return;
    setLoading(true);
    try {
      const [s, u, tr] = await Promise.all([fetchStatus(), fetchConnectedUsers(), fetchTraffic()]);
      setStatus(s);
      setUsers(u);
      setTraffic(tr);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, [connected]);

  if (!connected) {
    return (
      <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
        <Card>
          <Text style={{ color: "#475569", textAlign: "center" }}>{t("disconnected")}</Text>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <SectionHeader title={t("dashboard")} />
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ color: "#475569" }}>{t("status")}</Text>
        <Button label="Refresh" onPress={refresh} variant="secondary" />
      </View>
      {loading ? <ActivityIndicator style={{ marginVertical: 12 }} /> : null}
      {status ? (
        <Card>
          <Row label="Identity" value={status.identity} />
          <Row label="Model" value={status.model} />
          <Row label="RouterOS" value={status.routerOsVersion} />
          <Row label="Uptime" value={status.uptime} />
          <Row label={t("cpu")} value={formatPercent(status.cpuLoad)} />
          <Row label={t("memory")} value={`${formatBytes(status.freeMemory)} free / ${formatBytes(status.totalMemory)}`} />
        </Card>
      ) : null}
      <SectionHeader title={t("traffic")} />
      {traffic.map((sample) => (
        <Card key={sample.interfaceName}>
          <Row label="Interface" value={sample.interfaceName} />
          <Row label="RX" value={formatRate(sample.rxBytesPerSecond)} />
          <Row label="TX" value={formatRate(sample.txBytesPerSecond)} />
        </Card>
      ))}
      <SectionHeader title={t("users")} />
      {users.map((user) => (
        <Card key={user.id}>
          <Row label="User" value={user.username} />
          <Row label="IP" value={user.ipAddress} />
          <Row label="MAC" value={user.macAddress} />
          <Row label="Uptime" value={user.uptime} />
          <Row label="Traffic" value={`${formatBytes(user.bytesIn)} / ${formatBytes(user.bytesOut)}`} />
        </Card>
      ))}
      <Card>
        <Text style={{ color: "#475569", fontSize: 12 }}>{t("noMetrics")}</Text>
      </Card>
    </ScrollView>
  );
}
