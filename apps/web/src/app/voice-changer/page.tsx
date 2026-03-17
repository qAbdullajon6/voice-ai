"use client";

import { ComingSoonPage } from "../../components/coming-soon-page";
import { RiMicLine } from "react-icons/ri";

export default function VoiceChangerPage() {
  return (
    <ComingSoonPage
      title="Voice Changer"
      description="Transform and modify voices with advanced AI"
      icon={<RiMicLine size={80} />}
    />
  );
}
