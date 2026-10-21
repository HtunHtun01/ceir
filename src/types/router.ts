export type RouterProtocol = "rest" | "api" | "unknown";

export interface RouterCredentials {
  host: string;
  username: string;
  password: string;
  protocol: RouterProtocol;
  port?: number;
}

export interface RouterStatus {
  identity: string;
  model: string;
  routerOsVersion: string;
  uptime: string;
  cpuLoad: number;
  freeMemory: number;
  totalMemory: number;
  boardName?: string;
}

export interface TrafficSample {
  interfaceName: string;
  rxBytesPerSecond: number;
  txBytesPerSecond: number;
  timestamp: number;
}

export interface ConnectedUser {
  id: string;
  username: string;
  ipAddress: string;
  macAddress: string;
  uptime: string;
  bytesIn: number;
  bytesOut: number;
}

export interface HotspotUser {
  id: string;
  name: string;
  password: string;
  profile: string;
  disabled: boolean;
  comment?: string;
  limitUptime?: string;
  limitBytesTotal?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  rateLimit: string;
  sessionTimeout?: string;
  sharedUsers: number;
  price?: number;
}

export interface Voucher {
  id: string;
  code: string;
  profile: string;
  duration: string;
  dataLimit?: string;
  status: "unused" | "used" | "expired" | "disabled";
  createdAt: string;
}

export interface InterfaceInfo {
  name: string;
  type: string;
  running: boolean;
  disabled: boolean;
  ipAddress?: string;
}

export interface DhcpLease {
  address: string;
  macAddress: string;
  hostName?: string;
  status: string;
  expiresAfter?: string;
}

export interface FirewallRule {
  id: string;
  chain: string;
  action: string;
  protocol?: string;
  srcAddress?: string;
  dstAddress?: string;
  dstPort?: string;
  disabled: boolean;
  comment?: string;
}

export interface NatRule {
  id: string;
  chain: string;
  action: string;
  srcAddress?: string;
  dstAddress?: string;
  toAddresses?: string;
  disabled: boolean;
}

export interface DnsSettings {
  servers: string[];
  allowRemoteRequests: boolean;
}

export interface PppoeSettings {
  serviceName: string;
  interface: string;
  maxSessions: number;
  defaultProfile: string;
}

export interface QuickSetupInput {
  hotspotName: string;
  hotspotSubnet: string;
  dhcpRange: string;
  wifiSsid: string;
  wifiPassword: string;
}
