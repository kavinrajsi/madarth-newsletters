'use client';

// Zoho Campaigns signup. Set NEXT_PUBLIC_ZOHO_SIGNUP_URL to the form's action URL
// (Zoho Campaigns > Signup Forms > Embed). Verify the email field name against the
// embed HTML: Zoho forms use CONTACT_EMAIL. Without the env var it falls back to mailto.
const ACTION = process.env.NEXT_PUBLIC_ZOHO_SIGNUP_URL;

export function SignupForm() {
  if (!ACTION) {
    return (
      <p>
        <a href="mailto:business@madarth.com?subject=Subscribe%20to%20Musings">Subscribe to Musings by email</a>
      </p>
    );
  }
  return (
    <form action={ACTION} method="post" target="_blank" className="signup">
      <label htmlFor="signup-email">Get Musings in your inbox</label>
      <div className="signup-row">
        <input id="signup-email" name="CONTACT_EMAIL" type="email" required placeholder="you@company.com" />
        <button type="submit">Subscribe</button>
      </div>
    </form>
  );
}
