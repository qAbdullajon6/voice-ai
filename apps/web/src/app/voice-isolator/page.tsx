"use client";

import { ComingSoonPage } from "../../components/coming-soon-page";
import { RiVolumeUpLine } from "react-icons/ri";

export default function VoiceIsolatorPage() {
  return (
    <ComingSoonPage
      title="Voice Isolator"
      description="Extract and isolate voices from audio"
      icon={<RiVolumeUpLine size={80} />}
    />
  );
}
