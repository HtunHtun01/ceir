import React, { useEffect, useState } from "react";
import { Alert, Modal, ScrollView, Text, View } from "react-native";
import { useApp } from "../context/AppContext";
import { Button, Card, Input, Row, SectionHeader } from "../components/ui";
import {
  ConnectedUser,
  HotspotUser,
  UserProfile,
  Voucher,
} from "../types/router";
import {
  fetchConnectedUsers,
  disconnectUser,
  fetchHotspotUsers,
  createHotspotUser,
  deleteHotspotUser,
  fetchProfiles,
  createProfile,
  fetchVouchers,
  createVoucher,
} from "../services/routeros";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { generateVoucherCode } from "../utils/format";

type Tab = "users" | "profiles" | "vouchers" | "sessions";

export function HotspotScreen() {
  const { t } = useApp();
  const [tab, setTab] = useState<Tab>("users");
  const [users, setUsers] = useState<HotspotUser[]>([]);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [sessions, setSessions] = useState<ConnectedUser[]>([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showVoucherForm, setShowVoucherForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", password: "", profile: "default" });
  const [newProfile, setNewProfile] = useState({ name: "", rateLimit: "5M/5M", sessionTimeout: "1h", sharedUsers: "1", price: "0" });
  const [newVoucher, setNewVoucher] = useState({ profile: "default", duration: "1h", dataLimit: "500MB" });

  async function refresh() {
    const [u, p, v, s] = await Promise.all([
      fetchHotspotUsers(),
      fetchProfiles(),
      fetchVouchers(),
      fetchConnectedUsers(),
    ]);
    setUsers(u);
    setProfiles(p);
    setVouchers(v);
    setSessions(s);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function addUser() {
    if (!newUser.name.trim() || !newUser.password.trim()) {
      Alert.alert(t("warning"), "Name and password required");
      return;
    }
    await createHotspotUser({ ...newUser, disabled: false });
    setNewUser({ name: "", password: "", profile: "default" });
    setShowUserForm(false);
    refresh();
  }

  async function removeUser(id: string) {
    await deleteHotspotUser(id);
    refresh();
  }

  async function addProfile() {
    if (!newProfile.name.trim()) {
      Alert.alert(t("warning"), "Profile name required");
      return;
    }
    await createProfile({
      name: newProfile.name.trim(),
      rateLimit: newProfile.rateLimit,
      sessionTimeout: newProfile.sessionTimeout,
      sharedUsers: Number(newProfile.sharedUsers) || 1,
      price: Number(newProfile.price) || 0,
    });
    setNewProfile({ name: "", rateLimit: "5M/5M", sessionTimeout: "1h", sharedUsers: "1", price: "0" });
    setShowProfileForm(false);
    refresh();
  }

  async function addVoucher() {
    const code = generateVoucherCode();
    await createVoucher({
      code,
      profile: newVoucher.profile,
      duration: newVoucher.duration,
      dataLimit: newVoucher.dataLimit,
      status: "unused",
    });
    setShowVoucherForm(false);
    refresh();
  }

  async function disconnectSession(id: string) {
    await disconnectUser(id);
    refresh();
  }

  async function printVoucher(voucher: Voucher) {
    const html = `
      <html><body style="font-family: sans-serif; text-align:center; padding:24px;">
        <h2>Space Tik Voucher</h2>
        <p><strong>Code:</strong> ${voucher.code}</p>
        <p>Profile: ${voucher.profile}</p>
        <p>Duration: ${voucher.duration}</p>
        <p>Data: ${voucher.dataLimit ?? "-"}</p>
        <p>Status: ${voucher.status}</p>
      </body></html>`;
    const { uri } = await Print.printToFileAsync({ html });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    }
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "users", label: t("users") },
    { key: "profiles", label: t("profiles") },
    { key: "vouchers", label: t("vouchers") },
    { key: "sessions", label: "Sessions" },
  ];

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <SectionHeader title={t("hotspot")} />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        {tabs.map((item) => (
          <Button
            key={item.key}
            label={item.label}
            onPress={() => setTab(item.key)}
            variant={tab === item.key ? "primary" : "secondary"}
          />
        ))}
      </View>

      {tab === "users" ? (
        <>
          <Button label={t("add")} onPress={() => setShowUserForm(true)} />
          <View style={{ height: 8 }} />
          {users.map((user) => (
            <Card key={user.id}>
              <Row label="Name" value={user.name} />
              <Row label="Profile" value={user.profile} />
              <Row label="Status" value={user.disabled ? "Disabled" : "Enabled"} />
              <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
                <Button label={t("delete")} onPress={() => removeUser(user.id)} variant="danger" />
              </View>
            </Card>
          ))}
        </>
      ) : null}

      {tab === "profiles" ? (
        <>
          <Button label={t("add")} onPress={() => setShowProfileForm(true)} />
          <View style={{ height: 8 }} />
          {profiles.map((profile) => (
            <Card key={profile.id}>
              <Row label="Name" value={profile.name} />
              <Row label="Rate limit" value={profile.rateLimit} />
              <Row label="Session timeout" value={profile.sessionTimeout ?? "-"} />
              <Row label="Shared users" value={String(profile.sharedUsers)} />
              <Row label="Price" value={String(profile.price ?? 0)} />
            </Card>
          ))}
        </>
      ) : null}

      {tab === "vouchers" ? (
        <>
          <Button label={t("createVoucher")} onPress={() => setShowVoucherForm(true)} />
          <View style={{ height: 8 }} />
          {vouchers.map((voucher) => (
            <Card key={voucher.id}>
              <Row label="Code" value={voucher.code} />
              <Row label="Profile" value={voucher.profile} />
              <Row label="Duration" value={voucher.duration} />
              <Row label="Data" value={voucher.dataLimit ?? "-"} />
              <Row label="Status" value={voucher.status} />
              <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
                <Button label={t("preview")} onPress={() => printVoucher(voucher)} variant="secondary" />
                <Button label={t("print")} onPress={() => printVoucher(voucher)} />
              </View>
            </Card>
          ))}
        </>
      ) : null}

      {tab === "sessions" ? (
        <>
          {sessions.map((session) => (
            <Card key={session.id}>
              <Row label="User" value={session.username} />
              <Row label="IP" value={session.ipAddress} />
              <Row label="MAC" value={session.macAddress} />
              <Row label="Uptime" value={session.uptime} />
              <View style={{ marginTop: 8 }}>
                <Button label="Disconnect" onPress={() => disconnectSession(session.id)} variant="danger" />
              </View>
            </Card>
          ))}
        </>
      ) : null}

      <Modal visible={showUserForm} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: "center", padding: 16, backgroundColor: "rgba(0,0,0,0.4)" }}>
          <Card>
            <SectionHeader title={t("add")} />
            <Input label="Name" value={newUser.name} onChangeText={(v) => setNewUser({ ...newUser, name: v })} autoCapitalize="none" />
            <Input label="Password" value={newUser.password} onChangeText={(v) => setNewUser({ ...newUser, password: v })} secureTextEntry autoCapitalize="none" />
            <Input label="Profile" value={newUser.profile} onChangeText={(v) => setNewUser({ ...newUser, profile: v })} autoCapitalize="none" />
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Button label={t("save")} onPress={addUser} />
              <Button label={t("cancel")} onPress={() => setShowUserForm(false)} variant="secondary" />
            </View>
          </Card>
        </View>
      </Modal>

      <Modal visible={showProfileForm} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: "center", padding: 16, backgroundColor: "rgba(0,0,0,0.4)" }}>
          <Card>
            <SectionHeader title={t("add")} />
            <Input label="Name" value={newProfile.name} onChangeText={(v) => setNewProfile({ ...newProfile, name: v })} autoCapitalize="none" />
            <Input label="Rate limit" value={newProfile.rateLimit} onChangeText={(v) => setNewProfile({ ...newProfile, rateLimit: v })} autoCapitalize="none" />
            <Input label="Session timeout" value={newProfile.sessionTimeout} onChangeText={(v) => setNewProfile({ ...newProfile, sessionTimeout: v })} autoCapitalize="none" />
            <Input label="Shared users" value={newProfile.sharedUsers} onChangeText={(v) => setNewProfile({ ...newProfile, sharedUsers: v })} keyboardType="numeric" />
            <Input label="Price" value={newProfile.price} onChangeText={(v) => setNewProfile({ ...newProfile, price: v })} keyboardType="numeric" />
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Button label={t("save")} onPress={addProfile} />
              <Button label={t("cancel")} onPress={() => setShowProfileForm(false)} variant="secondary" />
            </View>
          </Card>
        </View>
      </Modal>

      <Modal visible={showVoucherForm} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: "center", padding: 16, backgroundColor: "rgba(0,0,0,0.4)" }}>
          <Card>
            <SectionHeader title={t("createVoucher")} />
            <Input label="Profile" value={newVoucher.profile} onChangeText={(v) => setNewVoucher({ ...newVoucher, profile: v })} autoCapitalize="none" />
            <Input label="Duration" value={newVoucher.duration} onChangeText={(v) => setNewVoucher({ ...newVoucher, duration: v })} autoCapitalize="none" />
            <Input label="Data limit" value={newVoucher.dataLimit} onChangeText={(v) => setNewVoucher({ ...newVoucher, dataLimit: v })} autoCapitalize="none" />
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Button label={t("save")} onPress={addVoucher} />
              <Button label={t("cancel")} onPress={() => setShowVoucherForm(false)} variant="secondary" />
            </View>
          </Card>
        </View>
      </Modal>
    </ScrollView>
  );
}
