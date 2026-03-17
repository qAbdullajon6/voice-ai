"use client";

import { ComingSoonPage } from "../../components/coming-soon-page";
import { RiPaletteLine } from "react-icons/ri";

export default function StudioPage() {
  return (
    <ComingSoonPage
      title="Studio"
      description="Professional audio studio with advanced editing tools"
      icon={<RiPaletteLine size={80} />}
    />
  );
}
