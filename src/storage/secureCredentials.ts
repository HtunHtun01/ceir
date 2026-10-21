import * as SecureStore from "expo-secure-store";
import { RouterCredentials } from "../types/router";

const KEY = "space_tik_router_credentials";

export async function saveCredentials(credentials: RouterCredentials): Promise<void> {
  await SecureStore.setItemAsync(KEY, JSON.stringify(credentials));
}

export async function loadCredentials(): Promise<RouterCredentials | null> {
  const raw = await SecureStore.getItemAsync(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as RouterCredentials;
  } catch {
    return null;
  }
}

export async function clearCredentials(): Promise<void> {
  await SecureStore.deleteItemAsync(KEY);
}
