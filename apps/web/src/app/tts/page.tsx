"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TtsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/app/text-to-speech");
  }, [router]);

  return null;
}
