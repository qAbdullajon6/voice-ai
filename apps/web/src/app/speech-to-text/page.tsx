"use client";

import { ComingSoonPage } from "../../components/coming-soon-page";
import { RiVoiceprintLine } from "react-icons/ri";

export default function SpeechToTextPage() {
  return (
    <ComingSoonPage
      title="Speech to Text"
      description="Convert audio to text with high accuracy"
      icon={<RiVoiceprintLine size={80} />}
    />
  );
}
