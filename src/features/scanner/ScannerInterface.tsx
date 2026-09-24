import { useState, useEffect } from "react";
import { useBarcodeScanner } from "./useBarcodeScanner";
import { ScanLine, CheckCircle, XCircle, WifiOff } from "lucide-react";

export default function ScannerInterface() {
  const [lastScan, setLastScan] = useState<{
    code: string;
    status: "success" | "error";
    message: string;
  } | null>(null);
  const [scannedCount, setScannedCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleScan = (code: string) => {
    // Simulate API call
    const isSuccess = Math.random() > 0.2; // 80% success

    setLastScan({
      code,
      status: isSuccess ? "success" : "error",
      message: isSuccess
        ? `Check-in successful: ${code}`
        : "Employee not found",
    });

    if (isSuccess) {
      setScannedCount((prev) => prev + 1);
      // Play sound
      const audio = new Audio("/beep.mp3"); // Assuming file exists or fails silently
      audio.play().catch(() => {});
    }
  };

  useBarcodeScanner({ onScan: handleScan });

  // Auto clear feedback after 3 seconds
  useEffect(() => {
    if (lastScan) {
      const timer = setTimeout(() => setLastScan(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastScan]);

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] p-6">
      <div
        className={`
        relative w-full max-w-2xl bg-surface rounded-2xl shadow-xl border-2 p-12 text-center
        transition-colors duration-300
        ${lastScan?.status === "success" ? "border-success bg-green-50" : ""}
        ${lastScan?.status === "error" ? "border-error bg-red-50" : ""}
        ${!lastScan ? "border-primary/20" : ""}
      `}
      >
        {!isOnline && (
          <div className="absolute top-4 right-4 flex items-center gap-2 text-warning bg-warning/10 px-3 py-1 rounded-full text-sm font-medium">
            <WifiOff className="w-4 h-4" />
            Offline Mode
          </div>
        )}

        <div className="mb-8 flex justify-center">
          <div
            className={`
            w-24 h-24 rounded-full flex items-center justify-center
            ${lastScan?.status === "success" ? "bg-success text-white" : ""}
            ${lastScan?.status === "error" ? "bg-error text-white" : ""}
            ${!lastScan ? "bg-blue-100 text-primary animate-pulse" : ""}
          `}
          >
            {lastScan?.status === "success" ? (
              <CheckCircle className="w-12 h-12" />
            ) : lastScan?.status === "error" ? (
              <XCircle className="w-12 h-12" />
            ) : (
              <ScanLine className="w-12 h-12" />
            )}
          </div>
        </div>

        <h2 className="text-3xl font-bold text-text-main mb-2">
          {lastScan
            ? lastScan.status === "success"
              ? "Success!"
              : "Error"
            : "Ready to Scan"}
        </h2>

        <p className="text-lg text-text-muted mb-8">
          {lastScan?.message ||
            "Please map your card to the scanner or enter ID manually."}
        </p>

        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <p className="text-sm text-text-muted mb-1">Session Scans</p>
            <p className="text-2xl font-bold text-primary">{scannedCount}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <p className="text-sm text-text-muted mb-1">Status</p>
            <p className="text-2xl font-bold text-success">Active</p>
          </div>
        </div>

        <div className="mt-8 text-sm text-text-muted">
          Manual input is disabled in this mode. Use keyboard if scanner fails.
        </div>
      </div>
    </div>
  );
}
