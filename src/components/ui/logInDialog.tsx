import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/services/supabase/supabase"; // esto ya lo tendrás tú exportao de forma limpia
import { useEffect } from "react";

interface LogInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const dataSitterThemeVariables = {
  default: {
    colors: {
      brand: "hsl(var(--primary))", // Primary color, e.g., blue-500
      brandAccent: "hsl(var(--accent))", // Accent color, e.g., gray-200
      brandButtonText: "hsl(var(--primary-foreground))", // Text color for brand buttons
      defaultButtonBackground: "hsl(var(--secondary))", // Secondary color, e.g., gray-100
      defaultButtonBackgroundHover: "hsl(var(--secondary-foreground))", // Darker shade on hover
      defaultButtonBorder: "hsl(var(--border))", // Border color, e.g., gray-200
      defaultButtonText: "hsl(var(--foreground))", // Default text color
      dividerBackground: "hsl(var(--muted))", // Muted background color, e.g., gray-100
      inputBackground: "hsl(var(--input))", // Input background color, e.g., gray-50
      inputBorder: "hsl(var(--border))", // Input border color, e.g., gray-200
      inputBorderFocus: "hsl(var(--ring))", // Ring color on focus, e.g., blue-500
      inputBorderHover: "hsl(var(--input))",
      inputLabelText: "hsl(var(--foreground))", // Label text color
      inputPlaceholder: "hsl(var(--muted-foreground))", // Placeholder text color
      inputText: "hsl(var(--foreground))", // Input text color
      messageText: "hsl(var(--foreground))", // General message text color
      messageBackground: "hsl(var(--card))", // Card background color
      messageBorder: "hsl(var(--border))", // Border color, e.g., gray-200
      messageTextDanger: "hsl(var(--destructive-foreground))", // Error message text color
      messageBackgroundDanger: "hsl(var(--destructive))", // Error message background
      messageBorderDanger: "hsl(var(--destructive))", // Error message border
      anchorTextColor: "hsl(var(--primary))", // Link color, e.g., blue-500
      anchorTextHoverColor: "hsl(var(--foreground))", // Link hover color
    },
    space: {
      spaceSmall: "0.5rem", // 8px
      spaceMedium: "1rem", // 16px
      spaceLarge: "1.5rem", // 24px
      labelBottomMargin: "0.5rem", // 8px
      anchorBottomMargin: "0.5rem", // 8px
      emailInputSpacing: "0.75rem", // 12px
      socialAuthSpacing: "0.75rem", // 12px
      buttonPadding: "0.75rem 1.25rem", // 12px 20px
      inputPadding: "0.75rem", // 12px
    },
    fontSizes: {
      baseBodySize: "0.875rem", // 14px
      baseInputSize: "0.875rem", // 14px
      baseLabelSize: "0.875rem", // 14px
      baseButtonSize: "0.875rem", // 14px
    },
    fonts: {
      bodyFontFamily: "var(--font-sans)", // Use the default sans-serif font
      buttonFontFamily: "var(--font-sans)", // Use the default sans-serif font
      inputFontFamily: "var(--font-sans)", // Use the default sans-serif font
      labelFontFamily: "var(--font-sans)", // Use the default sans-serif font
    },
    borderWidths: {
      buttonBorderWidth: "1px",
      inputBorderWidth: "1px",
    },
    radii: {
      borderRadiusButton: "var(--radius)",
      buttonBorderRadius: "var(--radius)",
      inputBorderRadius: "var(--radius)",
    },
  },
};

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
              theme: dataSitterThemeVariables,
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
