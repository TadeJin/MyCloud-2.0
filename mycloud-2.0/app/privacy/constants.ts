import { PolicySection } from "../components";

export const PRIVACY_LAST_UPDATED = "September 1, 2026";

export const privacySections: PolicySection[] = [
    {
        heading: "1. Overview",
        body: "MyCloud is a personal, self-hosted file storage project built and run by an individual developer as a portfolio project — not a company. This policy explains what data the app collects when you create an account and use it, and why.",
    },
    {
        heading: "2. Information we collect",
        body: [
            "Account data: the email address and password you register with. Your password is hashed and is never stored or visible in plain text.",
            "Your files: the files and folders you upload, along with their names and metadata (size, type, upload date).",
            "Technical data: a session cookie used to keep you signed in, and your IP address, used only for rate-limiting to prevent abuse (e.g. brute-force login attempts).",
        ],
    },
    {
        heading: "3. How your information is used",
        body: "Your data is used solely to operate the service: authenticating you, storing and serving your files back to you, sending account-related emails (email verification, password reset), and protecting the service from abuse. Nothing is used for advertising, profiling, or analytics.",
    },
    {
        heading: "4. Cookies",
        body: "MyCloud sets one functional session cookie to keep you logged in. There are no tracking, advertising, or analytics cookies, so there's no cookie consent banner — the only cookie set is one the app can't function without.",
    },
    {
        heading: "5. Third-party services",
        body: [
            "Resend is used to deliver transactional emails (verification and password reset links) — your email address is shared with them only to send these emails.",
            "Upstash is used for rate-limiting requests to the app; it briefly sees your IP address for this purpose.",
            "Your data is never sold, shared for advertising, or given to any other third party.",
        ],
    },
    {
        heading: "6. Data storage & security",
        body: "MyCloud is self-hosted on the developer's own hardware. Passwords are hashed, and reasonable care is taken to keep the server secure, but as a hobby project it comes with no formal security guarantees, uptime commitment, or SLA — see the Terms of Service for details.",
    },
    {
        heading: "7. Your rights",
        body: "You can view and change your email or password at any time from Settings. You can permanently delete your account and all associated files at any time from Settings — this immediately and irreversibly removes your data from the server.",
    },
    {
        heading: "8. Children's privacy",
        body: "MyCloud is not directed at children, and knowingly collects no data from anyone under 16.",
    },
    {
        heading: "9. Changes to this policy",
        body: "This policy may be updated occasionally as the app changes. The date at the top of this page always reflects the latest revision.",
    },
    {
        heading: "10. Contact",
        body: "See the contact link above for questions about this policy or your data.",
    },
];
