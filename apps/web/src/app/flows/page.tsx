"use client";

import { ComingSoonPage } from "../../components/coming-soon-page";
import { RiOrganizationChart } from "react-icons/ri";

export default function FlowsPage() {
  return (
    <ComingSoonPage
      title="Flows"
      description="Create complex conversation flows with AI"
      icon={<RiOrganizationChart size={80} />}
    />
  );
}
