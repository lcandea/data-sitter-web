import { useAppSelector } from "@/hooks/useStore";
import { Loader2 } from "lucide-react";

export function LoadingOverlay() {
  const { isLoading, message } = useAppSelector((state) => state.loading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground text-center">
            {message || "Loading... Please wait."}
          </p>
        </div>
      </div>
    </div>
  );
}
