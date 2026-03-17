"use client";

import { ComingSoonPage } from "../../components/coming-soon-page";
import { RiBook3Line } from "react-icons/ri";

export default function AudiobooksPage() {
  return (
    <ComingSoonPage
      title="Audiobooks"
      description="Create long-form narration for audiobooks"
      icon={<RiBook3Line size={80} />}
    />
  );
}
