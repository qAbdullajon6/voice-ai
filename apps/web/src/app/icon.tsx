import { readFile } from "fs/promises";
import { join } from "path";
import { ImageResponse } from "next/og";

/** 48x48 — Google qidiruvda sayt ikonkasi uchun tavsiya etiladi */
export const size = { width: 48, height: 48 };
export const contentType = "image/png";

export default async function Icon() {
  const pixel = 48;
  let logoDataUrl: string;
  try {
    const logoPath = join(process.cwd(), "public", "logo.png");
    const buf = await readFile(logoPath);
    logoDataUrl = `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    logoDataUrl = "";
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: pixel,
          height: pixel,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        {logoDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoDataUrl}
            alt="Voice AI"
            width={pixel}
            height={pixel}
            style={{ objectFit: "contain" }}
          />
        ) : (
          <div
            style={{
              width: pixel,
              height: pixel,
              background: "#0b0f1a",
              color: "#fff",
              fontSize: 24,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            V
          </div>
        )}
      </div>
    ),
    { width: pixel, height: pixel },
  );
}
