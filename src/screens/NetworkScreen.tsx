import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { useApp } from "../context/AppContext";
import { Button, Card, Input, Row, SectionHeader } from "../components/ui";
import {
  fetchInterfaces,
  fetchDhcpLeases,
  fetchFirewallRules,
  fetchNatRules,
  fetchDns,
  fetchPppoe,
  quickSetup,
} from "../services/routeros";
import { InterfaceInfo, DhcpLease, FirewallRule, NatRule } from "../types/router";
import { QuickSetupInput } from "../types/router";

type Tab = "interfaces" | "dhcp" | "firewall" | "nat" | "dns" | "pppoe" | "quick";

export function NetworkScreen() {
  const { t } = useApp();
  const [tab, setTab] = useState<Tab>("interfaces");
  const [interfaces, setInterfaces] = useState<InterfaceInfo[]>([]);
  const [leases, setLeases] = useState<DhcpLease[]>([]);
  const [firewall, setFirewall] = useState<FirewallRule[]>([]);
  const [nat, setNat] = useState<NatRule[]>([]);
  const [dns, setDns] = useState<{ servers: string[]; allowRemoteRequests: boolean } | null>(null);
  const [pppoe, setPppoe] = useState<{ serviceName: string; interface: string; maxSessions: number; defaultProfile: string } | null>(null);
  const [quick, setQuick] = useState<QuickSetupInput>({
    hotspotName: "SpaceTik-Hotspot",
    hotspotSubnet: "192.168.88.0/24",
    dhcpRange: "192.168.88.10-192.168.88.254",
    wifiSsid: "SpaceTik",
    wifiPassword: "password123",
  });

  useEffect(() => {
    (async () => {
      const [i, l, f, n, d, p] = await Promise.all([
        fetchInterfaces(),
        fetchDhcpLeases(),
        fetchFirewallRules(),
        fetchNatRules(),
        fetchDns(),
        fetchPppoe(),
      ]);
      setInterfaces(i);
      setLeases(l);
      setFirewall(f);
      setNat(n);
      setDns(d);
      setPppoe(p);
    })();
  }, []);

  function confirmChange(action: () => Promise<void>, message: string) {
    Alert.alert(t("warning"), message, [
      { text: t("cancel"), style: "cancel" },
      { text: t("confirm"), style: "destructive", onPress: () => action().catch((e) => Alert.alert(t("warning"), String(e))) },
    ]);
  }

  async function runQuickSetup() {
    confirmChange(async () => {
      await quickSetup(quick);
      Alert.alert("OK", "Quick setup completed (demo)");
    }, "Quick Setup will change router network settings. Use a test router first.");
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "quick", label: t("quickSetup") },
    { key: "interfaces", label: t("interfaces") },
    { key: "dhcp", label: t("dhcp") },
    { key: "firewall", label: t("firewall") },
    { key: "nat", label: t("nat") },
    { key: "dns", label: t("dns") },
    { key: "pppoe", label: t("pppoe") },
  ];

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <SectionHeader title={t("network")} />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        {tabs.map((item) => (
          <Button key={item.key} label={item.label} onPress={() => setTab(item.key)} variant={tab === item.key ? "primary" : "secondary"} />
        ))}
      </View>

      {tab === "quick" ? (
        <Card>
          <Input label="Hotspot name" value={quick.hotspotName} onChangeText={(v) => setQuick({ ...quick, hotspotName: v })} />
          <Input label="Hotspot subnet" value={quick.hotspotSubnet} onChangeText={(v) => setQuick({ ...quick, hotspotSubnet: v })} autoCapitalize="none" />
          <Input label="DHCP range" value={quick.dhcpRange} onChangeText={(v) => setQuick({ ...quick, dhcpRange: v })} autoCapitalize="none" />
          <Input label="Wi-Fi SSID" value={quick.wifiSsid} onChangeText={(v) => setQuick({ ...quick, wifiSsid: v })} autoCapitalize="none" />
          <Input label="Wi-Fi password" value={quick.wifiPassword} onChangeText={(v) => setQuick({ ...quick, wifiPassword: v })} secureTextEntry autoCapitalize="none" />
          <Button label={t("quickSetup")} onPress={runQuickSetup} />
        </Card>
      ) : null}

      {tab === "interfaces" ? (
        interfaces.map((item) => (
          <Card key={item.name}>
            <Row label="Name" value={item.name} />
            <Row label="Type" value={item.type} />
            <Row label="Running" value={item.running ? "Yes" : "No"} />
            <Row label="Disabled" value={item.disabled ? "Yes" : "No"} />
            <Row label="IP" value={item.ipAddress ?? "-"} />
          </Card>
        ))
      ) : null}

      {tab === "dhcp" ? (
        <>
          <SectionHeader title="Leases" />
          {leases.map((lease) => (
            <Card key={lease.address}>
              <Row label="Address" value={lease.address} />
              <Row label="MAC" value={lease.macAddress} />
              <Row label="Host" value={lease.hostName ?? "-"} />
              <Row label="Status" value={lease.status} />
              <Row label="Expires" value={lease.expiresAfter ?? "-"} />
            </Card>
          ))}
        </>
      ) : null}

      {tab === "firewall" ? (
        firewall.map((rule) => (
          <Card key={rule.id}>
            <Row label="Chain" value={rule.chain} />
            <Row label="Action" value={rule.action} />
            <Row label="Protocol" value={rule.protocol ?? "any"} />
            <Row label="Src" value={rule.srcAddress ?? "any"} />
            <Row label="Dst port" value={rule.dstPort ?? "any"} />
            <Row label="Disabled" value={rule.disabled ? "Yes" : "No"} />
            <Row label="Comment" value={rule.comment ?? "-"} />
            <View style={{ marginTop: 8 }}>
              <Button
                label={t("delete")}
                variant="danger"
                onPress={() =>
                  confirmChange(async () => {
                    Alert.alert(t("warning"), "Demo: rule would be removed");
                  }, "This changes firewall settings and may disconnect users.")
                }
              />
            </View>
          </Card>
        ))
      ) : null}

      {tab === "nat" ? (
        nat.map((rule) => (
          <Card key={rule.id}>
            <Row label="Chain" value={rule.chain} />
            <Row label="Action" value={rule.action} />
            <Row label="Src" value={rule.srcAddress ?? "any"} />
            <Row label="Dst" value={rule.dstAddress ?? "any"} />
            <Row label="To" value={rule.toAddresses ?? "-"} />
          </Card>
        ))
      ) : null}

      {tab === "dns" ? (
        <Card>
          {dns ? (
            <>
              <Row label="Servers" value={dns.servers.join(", ")} />
              <Row label="Remote requests" value={dns.allowRemoteRequests ? "Yes" : "No"} />
            </>
          ) : null}
        </Card>
      ) : null}

      {tab === "pppoe" ? (
        <Card>
          {pppoe ? (
            <>
              <Row label="Service" value={pppoe.serviceName} />
              <Row label="Interface" value={pppoe.interface} />
              <Row label="Max sessions" value={String(pppoe.maxSessions)} />
              <Row label="Default profile" value={pppoe.defaultProfile} />
            </>
          ) : null}
        </Card>
      ) : null}
    </ScrollView>
  );
}
