import { PolicyDisplay } from "../components";
import { termsSections, TERMS_LAST_UPDATED } from "./constants";

export default function TermsPage() {
    return <PolicyDisplay header="Terms of Service" lastUpdated={TERMS_LAST_UPDATED} sections={termsSections} />;
}
