import type { Metadata } from "next";
import { VendorPortalClient } from "@/components/vendor/VendorPortalClient";

export const metadata: Metadata = {
  title: "Vendor Portal",
};

export default function VendorPage() {
  return <VendorPortalClient section="overview" />;
}
