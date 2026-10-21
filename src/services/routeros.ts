import * as Network from "expo-network";
import {
  ConnectedUser,
  DhcpLease,
  DnsSettings,
  FirewallRule,
  HotspotUser,
  InterfaceInfo,
  NatRule,
  PppoeSettings,
  QuickSetupInput,
  RouterCredentials,
  RouterStatus,
  TrafficSample,
  UserProfile,
  Voucher,
} from "../types/router";
import { isValidIpv4 } from "../utils/format";

const mockStatus: RouterStatus = {
  identity: "SpaceTik-Router",
  model: "RouterBOARD (demo)",
  routerOsVersion: "7.x (protocol pending)",
  uptime: "3d 12:40:11",
  cpuLoad: 14,
  freeMemory: 184 * 1024 * 1024,
  totalMemory: 256 * 1024 * 1024,
};

const mockUsers: ConnectedUser[] = [
  {
    id: "u1",
    username: "admin-phone",
    ipAddress: "192.168.88.101",
    macAddress: "00:11:22:33:44:55",
    uptime: "00:42:10",
    bytesIn: 12_400_000,
    bytesOut: 3_100_000,
  },
  {
    id: "u2",
    username: "guest-01",
    ipAddress: "192.168.88.102",
    macAddress: "AA:BB:CC:DD:EE:FF",
    uptime: "00:08:03",
    bytesIn: 1_200_000,
    bytesOut: 400_000,
  },
];

const mockHotspotUsers: HotspotUser[] = [
  {
    id: "hs1",
    name: "alice",
    password: "****",
    profile: "default",
    disabled: false,
    comment: "Demo user",
  },
  {
    id: "hs2",
    name: "bob",
    password: "****",
    profile: "premium",
    disabled: false,
  },
];

const mockProfiles: UserProfile[] = [
  { id: "p1", name: "default", rateLimit: "5M/5M", sessionTimeout: "1h", sharedUsers: 1, price: 0 },
  { id: "p2", name: "premium", rateLimit: "20M/20M", sessionTimeout: "8h", sharedUsers: 2, price: 5000 },
];

let mockVouchers: Voucher[] = [
  {
    id: "v1",
    code: "VKAB12CD34",
    profile: "default",
    duration: "1h",
    dataLimit: "500MB",
    status: "unused",
    createdAt: new Date().toISOString(),
  },
  {
    id: "v2",
    code: "VKZX98YX76",
    profile: "premium",
    duration: "8h",
    dataLimit: "5GB",
    status: "used",
    createdAt: new Date().toISOString(),
  },
];

const mockInterfaces: InterfaceInfo[] = [
  { name: "ether1", type: "ether", running: true, disabled: false, ipAddress: "10.0.0.2/24" },
  { name: "bridge1", type: "bridge", running: true, disabled: false, ipAddress: "192.168.88.1/24" },
  { name: "wlan1", type: "wlan", running: true, disabled: false, ipAddress: "192.168.88.1/24" },
];

const mockLeases: DhcpLease[] = [
  { address: "192.168.88.101", macAddress: "00:11:22:33:44:55", hostName: "phone-1", status: "bound", expiresAfter: "00:45:00" },
  { address: "192.168.88.102", macAddress: "AA:BB:CC:DD:EE:FF", hostName: "phone-2", status: "bound", expiresAfter: "00:30:00" },
];

const mockFirewall: FirewallRule[] = [
  { id: "fw1", chain: "input", action: "accept", protocol: "tcp", dstPort: "8291", disabled: false, comment: "Winbox" },
  { id: "fw2", chain: "forward", action: "drop", disabled: false, comment: "Block invalid" },
];

const mockNat: NatRule[] = [
  { id: "nat1", chain: "srcnat", action: "masquerade", srcAddress: "192.168.88.0/24", disabled: false },
];

export async function detectDefaultGateway(): Promise<string | null> {
  try {
    const ip = await Network.getIpAddressAsync();
    if (ip && isValidIpv4(ip)) {
      const parts = ip.split(".");
      parts[3] = "1";
      return parts.join(".");
    }
  } catch {
    // ignore
  }
  return "192.168.88.1";
}

export async function connectToRouter(credentials: RouterCredentials): Promise<RouterStatus> {
  if (!isValidIpv4(credentials.host)) {
    throw new Error("Invalid router IP address");
  }
  if (!credentials.username.trim()) {
    throw new Error("Username is required");
  }
  // Protocol is determined after RouterOS version/API details are known.
  // This starter uses a safe mock until a real protocol is selected.
  return { ...mockStatus, identity: `Router @ ${credentials.host}` };
}

export async function fetchStatus(): Promise<RouterStatus> {
  return { ...mockStatus, cpuLoad: Math.max(1, Math.min(99, mockStatus.cpuLoad + Math.round(Math.random() * 6 - 3))) };
}

export async function fetchConnectedUsers(): Promise<ConnectedUser[]> {
  return mockUsers.map((user) => ({ ...user }));
}

export async function disconnectUser(id: string): Promise<void> {
  const index = mockUsers.findIndex((user) => user.id === id);
  if (index >= 0) mockUsers.splice(index, 1);
}

export async function fetchHotspotUsers(): Promise<HotspotUser[]> {
  return mockHotspotUsers.map((user) => ({ ...user }));
}

export async function createHotspotUser(user: Omit<HotspotUser, "id">): Promise<HotspotUser> {
  const created = { ...user, id: `hs${Date.now()}` };
  mockHotspotUsers.push(created);
  return created;
}

export async function updateHotspotUser(id: string, patch: Partial<HotspotUser>): Promise<void> {
  const user = mockHotspotUsers.find((item) => item.id === id);
  if (user) Object.assign(user, patch);
}

export async function deleteHotspotUser(id: string): Promise<void> {
  const index = mockHotspotUsers.findIndex((item) => item.id === id);
  if (index >= 0) mockHotspotUsers.splice(index, 1);
}

export async function fetchProfiles(): Promise<UserProfile[]> {
  return mockProfiles.map((profile) => ({ ...profile }));
}

export async function createProfile(profile: Omit<UserProfile, "id">): Promise<UserProfile> {
  const created = { ...profile, id: `p${Date.now()}` };
  mockProfiles.push(created);
  return created;
}

export async function fetchVouchers(): Promise<Voucher[]> {
  return mockVouchers.map((voucher) => ({ ...voucher }));
}

export async function createVoucher(input: Omit<Voucher, "id" | "createdAt">): Promise<Voucher> {
  const voucher: Voucher = {
    ...input,
    id: `v${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  mockVouchers = [voucher, ...mockVouchers];
  return voucher;
}

export async function fetchInterfaces(): Promise<InterfaceInfo[]> {
  return mockInterfaces.map((item) => ({ ...item }));
}

export async function fetchDhcpLeases(): Promise<DhcpLease[]> {
  return mockLeases.map((item) => ({ ...item }));
}

export async function fetchFirewallRules(): Promise<FirewallRule[]> {
  return mockFirewall.map((item) => ({ ...item }));
}

export async function fetchNatRules(): Promise<NatRule[]> {
  return mockNat.map((item) => ({ ...item }));
}

export async function fetchDns(): Promise<DnsSettings> {
  return { servers: ["8.8.8.8", "1.1.1.1"], allowRemoteRequests: true };
}

export async function fetchPppoe(): Promise<PppoeSettings> {
  return { serviceName: "pppoe-service", interface: "ether1", maxSessions: 50, defaultProfile: "default" };
}

export async function quickSetup(input: QuickSetupInput): Promise<void> {
  // Real implementation would push commands to RouterOS. Kept as a validated no-op demo.
  if (!input.wifiSsid.trim()) throw new Error("Wi-Fi SSID is required");
}

export async function fetchTraffic(): Promise<TrafficSample[]> {
  return [
    { interfaceName: "ether1", rxBytesPerSecond: 1_200_000, txBytesPerSecond: 320_000, timestamp: Date.now() },
    { interfaceName: "wlan1", rxBytesPerSecond: 480_000, txBytesPerSecond: 120_000, timestamp: Date.now() },
  ];
}
