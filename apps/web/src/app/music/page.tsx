"use client";

import { ComingSoonPage } from "../../components/coming-soon-page";
import { RiMusicLine } from "react-icons/ri";

export default function MusicPage() {
  return (
    <ComingSoonPage
      title="Music"
      description="Generate and create music beds for your projects"
      icon={<RiMusicLine size={80} />}
    />
  );
}
