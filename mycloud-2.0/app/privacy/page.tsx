import { PolicyDisplay } from "../components";
import { privacySections, PRIVACY_LAST_UPDATED } from "./constants";

export default function PrivacyPage() {
    return <PolicyDisplay header="Privacy Policy" lastUpdated={PRIVACY_LAST_UPDATED} sections={privacySections} />;
}
