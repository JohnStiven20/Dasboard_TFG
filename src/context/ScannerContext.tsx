import { createContext, useState, useCallback } from "react";
import { useBarcodeScanner } from "../hooks/useBarcodeScanner";

interface ScannerContextType {
  lastScan: string | null;
  clearScan: () => void;
}

export const ScannerContext = createContext<ScannerContextType>({
  lastScan: null,
  clearScan: () => {}
});

export const ScannerProvider = ({ children }: { children: React.ReactNode }) => {

  const [lastScan, setLastScan] = useState<string | null>(null);

  const handleScan = useCallback((code: string) => {
    setLastScan(code);
  }, []);

  const clearScan = useCallback(() => {
    setLastScan(null);
  }, []);

  useBarcodeScanner(handleScan);

  return (
    <ScannerContext.Provider value={{ lastScan, clearScan }}>
      {children}
    </ScannerContext.Provider>
  );
};
