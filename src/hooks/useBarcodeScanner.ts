import { useEffect } from "react";

export function useBarcodeScanner(onScan: (code: string) => void) {

  let buffer = "";
  let timer: number | undefined;

  useEffect(() => {

    const handleKeyDown = (e: KeyboardEvent) => {

      if (timer) clearTimeout(timer);

      timer = window.setTimeout(() => (buffer = ""), 40);

      if (e.key === "Enter") {
        if (buffer.length > 2) {
          onScan(buffer);
        }
        buffer = "";
        return;
      }

      if (e.key.length === 1) {
        buffer += e.key;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onScan]);
}
