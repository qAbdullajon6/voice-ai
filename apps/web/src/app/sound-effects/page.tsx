"use client";

import { ComingSoonPage } from "../../components/coming-soon-page";
import { RiMusicLine } from "react-icons/ri";

export default function SoundEffectsPage() {
  return (
    <ComingSoonPage
      title="Sound Effects"
      description="Add professional sound effects to your projects"
      icon={<RiMusicLine size={80} />}
    />
  );
}
