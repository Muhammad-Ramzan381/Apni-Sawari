export function isValidPakistaniPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s|-/g, "");
  // Pakistani numbers: 03XX-XXXXXXX (11 digits) or +923XX-XXXXXXX
  return /^(0[3][0-9]{9}|\+92[3][0-9]{9})$/.test(cleaned);
}

export function formatPhoneForFirebase(phone: string): string {
  const cleaned = phone.replace(/\s|-/g, "");
  if (cleaned.startsWith("0")) {
    return `+92${cleaned.slice(1)}`;
  }
  if (cleaned.startsWith("+92")) {
    return cleaned;
  }
  return `+92${cleaned}`;
}

export function maskPhone(phone: string): string {
  if (phone.length < 7) return phone;
  return phone.slice(0, 4) + "****" + phone.slice(-3);
}
