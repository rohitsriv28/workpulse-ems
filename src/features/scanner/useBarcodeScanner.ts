import { useEffect, useState, useCallback } from "react";

interface UseBarcodeScannerProps {
  onScan: (barcode: string) => void;
  minLength?: number;
}

export function useBarcodeScanner({
  onScan,
  minLength = 3,
}: UseBarcodeScannerProps) {
  const [buffer, setBuffer] = useState("");
  const [lastKeyTime, setLastKeyTime] = useState(0);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore if user is focused on an input
      if (
        (e.target as HTMLElement).tagName === "INPUT" ||
        (e.target as HTMLElement).tagName === "TEXTAREA"
      ) {
        return;
      }

      const char = e.key;

      // Time check to ensure it's fast entry (scanner-like)
      const now = Date.now();
      const isRapid = now - lastKeyTime < 50; // Scanners usually send keys very fast (e.g., < 20-50ms)

      // If interval is too long, reset buffer (unless buffer is empty, then just start)
      if (!isRapid && buffer.length > 0) {
        setBuffer("");
      }

      setLastKeyTime(now);

      if (char === "Enter") {
        if (buffer.length >= minLength) {
          onScan(buffer);
          setBuffer("");
        }
      } else if (char.length === 1) {
        setBuffer((prev) => prev + char);
      }
    },
    [buffer, minLength, onScan, lastKeyTime]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return { currentBuffer: buffer };
}
