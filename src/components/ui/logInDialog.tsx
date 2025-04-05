import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/services/supabase"; // esto ya lo tendrás tú exportao de forma limpia
import { useEffect } from "react";

interface LogInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogInDialog({ open, onOpenChange }: LogInDialogProps) {
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          onOpenChange(false);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Log In</DialogTitle>
        </DialogHeader>

        <div className="pt-4">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "hsl(var(--primary))",
                    brandAccent: "hsl(var(--ring))",
                    inputBorder: "hsl(var(--border))",
                    inputBackground: "hsl(var(--input))",
                    // messageText: "hsl(var(--foreground))",
                  },
                  radii: {
                    borderRadiusButton: "var(--radius)",
                    inputBorderRadius: "var(--radius)",
                  },
                },
              },
            }}
            theme="default"
            providers={["github", "google"]}
            showLinks={true}
            redirectTo="/"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
