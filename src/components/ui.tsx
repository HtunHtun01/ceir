import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}

export function Button({ label, onPress, variant = "primary", disabled }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "danger" && styles.danger,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={[styles.buttonText, variant === "secondary" && styles.secondaryText]}>{label}</Text>
    </Pressable>
  );
}

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "numeric" | "email-address";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

export function Input({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, autoCapitalize }: InputProps) {
  return (
    <View style={styles.inputWrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={styles.input}
      />
    </View>
  );
}

export function Card({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

export function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

export function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: { backgroundColor: "#0F172A" },
  secondary: { backgroundColor: "#E2E8F0" },
  secondaryText: { color: "#0F172A" },
  danger: { backgroundColor: "#DC2626" },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.85 },
  buttonText: { color: "#FFFFFF", fontWeight: "600" },
  inputWrap: { marginBottom: 12 },
  label: { marginBottom: 6, fontWeight: "600", color: "#0F172A" },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sectionHeader: { fontSize: 18, fontWeight: "700", color: "#0F172A", marginBottom: 8, marginTop: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  rowLabel: { color: "#475569", flex: 1 },
  rowValue: { color: "#0F172A", fontWeight: "600", flex: 1, textAlign: "right" },
});
