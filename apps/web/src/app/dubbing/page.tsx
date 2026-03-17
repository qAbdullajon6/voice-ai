"use client";

import { ComingSoonPage } from "../../components/coming-soon-page";
import { RiMicLine } from "react-icons/ri";

export default function DubbingPage() {
  return (
    <ComingSoonPage
      title="Dubbing"
      description="Localize media with automatic dubbing"
      icon={<RiMicLine size={80} />}
    />
  );
}
