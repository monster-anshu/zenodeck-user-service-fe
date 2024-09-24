export function maskEmail(email: string): string {
  // Split the email address into username and domain parts
  const [username = '', domain] = email.split('@');

  // Determine how many characters to mask in the username (keep the first 3 visible)
  const numVisibleChars = Math.min(3, username.length);
  const maskedChars = '*'.repeat(username.length - numVisibleChars);

  // Reconstruct the masked email
  const maskedEmail =
    username.substring(0, numVisibleChars) + maskedChars + '@' + domain;

  return maskedEmail;
}
