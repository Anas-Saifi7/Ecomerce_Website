import LegalDocument from "../components/LegalDocument";
import { privacyPolicy } from "../data/legalPages";

export default function PrivacyPolicy() {
  return <LegalDocument data={privacyPolicy} />;
}
