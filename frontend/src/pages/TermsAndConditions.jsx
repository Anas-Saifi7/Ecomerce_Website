import LegalDocument from "../components/LegalDocument";
import { termsAndConditions } from "../data/legalPages";

export default function TermsAndConditions() {
  return <LegalDocument data={termsAndConditions} />;
}
