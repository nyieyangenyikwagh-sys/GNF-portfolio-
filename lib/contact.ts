export type Inquiry = { name: string; email: string; organization: string; message: string; website: string };
export type InquiryErrors = Partial<Record<keyof Inquiry, "required" | "invalidEmail" | "tooLong">>;
export function validEmail(value: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254 && !/[\r\n]/.test(value); }
export function validateInquiry(input: Inquiry): InquiryErrors {
  const errors: InquiryErrors = {};
  for (const key of ["name", "email", "message"] as const) if (!input[key].trim()) errors[key] = "required";
  if (input.email && !validEmail(input.email)) errors.email = "invalidEmail";
  for (const [key, limit] of [["name", 100], ["email", 254], ["organization", 150], ["message", 5000]] as const) if (input[key].length > limit) errors[key] = "tooLong";
  return errors;
}
