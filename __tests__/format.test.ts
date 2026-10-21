import { formatBytes, isValidIpv4, generateVoucherCode, maskSecret } from "../src/utils/format";

describe("format utilities", () => {
  it("formats bytes", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(1024)).toBe("1.0 KB");
    expect(formatBytes(1536)).toBe("1.5 KB");
  });

  it("validates IPv4", () => {
    expect(isValidIpv4("192.168.88.1")).toBe(true);
    expect(isValidIpv4("256.1.1.1")).toBe(false);
    expect(isValidIpv4("1.2.3")).toBe(false);
  });

  it("generates voucher codes", () => {
    const code = generateVoucherCode("VK", 4);
    expect(code.startsWith("VK")).toBe(true);
    expect(code.length).toBe(6);
  });

  it("masks secrets", () => {
    expect(maskSecret("password")).toBe("p******d");
    expect(maskSecret("ab")).toBe("**");
  });
});
