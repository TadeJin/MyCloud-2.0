import { PolicySection } from "../components";

export const TERMS_LAST_UPDATED = "September 1, 2026";

export const termsSections: PolicySection[] = [
    {
        heading: "1. Acceptance of these terms",
        body: "By creating an account and using MyCloud, you agree to these Terms of Service and the Privacy Policy. If you don't agree, please don't use the app.",
    },
    {
        heading: "2. About the service",
        body: "MyCloud is a personal, self-hosted file storage project, built and maintained by an individual developer as a portfolio project — not a commercial product or company. It's run on the developer's own hardware, on a best-effort basis.",
    },
    {
        heading: "3. Your account",
        body: "You're responsible for keeping your password confidential and for all activity under your account. Provide a real, working email address, since it's used for verification and password recovery — accounts aren't recoverable without access to it.",
    },
    {
        heading: "4. Acceptable use",
        body: [
            "Use MyCloud only for lawful purposes. Don't upload or store illegal content, don't attempt to access other users' accounts or data, and don't attempt to disrupt, overload, or abuse the service (e.g. automated scraping, brute-forcing, denial-of-service attempts).",
            "Accounts found violating these rules may be suspended or deleted without notice.",
        ],
    },
    {
        heading: "5. Your content",
        body: "You retain full ownership of everything you upload. The service is only used to store and return your files to you — no license to your content is claimed beyond what's technically necessary to provide storage.",
    },
    {
        heading: "6. Storage limits & availability",
        body: "Accounts default to a limited storage capacity (currently 1GB). As a self-hosted hobby project, MyCloud is provided on a best-effort basis: there's no guaranteed uptime, no SLA, and features, limits, or availability may change or be interrupted at any time — including permanently, if the project is ever discontinued.",
    },
    {
        heading: "7. Termination",
        body: "You may delete your account and all associated data at any time from Settings. Accounts may also be suspended or removed for violating these terms or for prolonged inactivity.",
    },
    {
        heading: "8. Disclaimer of warranty",
        body: "MyCloud is provided \"as is\", without warranties of any kind, express or implied — including any warranty of availability, reliability, or fitness for a particular purpose. Back up anything genuinely important elsewhere; this is a hobby project, not a managed cloud storage provider.",
    },
    {
        heading: "9. Limitation of liability",
        body: "To the fullest extent permitted by law, the developer isn't liable for any data loss, service interruption, or damages arising from the use of MyCloud.",
    },
    {
        heading: "10. Open source",
        body: "MyCloud's source code is open source under the MIT license, which covers reuse of the code itself. It does not extend to, or affect, the data or files you store using the hosted instance of the app — that's governed by this Terms of Service and the Privacy Policy.",
    },
    {
        heading: "11. Changes to these terms",
        body: "These terms may be updated occasionally as the app changes. The date at the top of this page always reflects the latest revision.",
    },
    {
        heading: "12. Contact",
        body: "See the contact link above for questions about these terms.",
    },
];
