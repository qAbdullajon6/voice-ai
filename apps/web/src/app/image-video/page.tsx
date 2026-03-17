"use client";

import { ComingSoonPage } from "../../components/coming-soon-page";
import { RiVideoLine } from "react-icons/ri";

export default function ImageVideoPage() {
  return (
    <ComingSoonPage
      title="Image & Video"
      description="Create voiceovers and audio for your visual content"
      icon={<RiVideoLine size={80} />}
    />
  );
}
