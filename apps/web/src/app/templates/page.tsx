"use client";

import { ComingSoonPage } from "../../components/coming-soon-page";
import { RiLayoutGridLine } from "react-icons/ri";

export default function TemplatesPage() {
  return (
    <ComingSoonPage
      title="Templates"
      description="Choose from pre-built templates to create faster"
      icon={<RiLayoutGridLine size={80} />}
    />
  );
}
