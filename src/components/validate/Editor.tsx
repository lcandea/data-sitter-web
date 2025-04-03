import { Editor as MonacoEditor } from "@monaco-editor/react";
import { Upload } from "lucide-react";
import type { EditorProps } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function Editor({
  value,
  onChange,
  title,
  onFileUpload,
  options,
}: EditorProps) {
  const [theme, setTheme] = useState<"vs-dark" | "vs-light">("vs-dark");

  useEffect(() => {
    // Initial theme
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "vs-dark" : "vs-light");

    // Create observer to watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isDark = document.documentElement.classList.contains("dark");
          setTheme(isDark ? "vs-dark" : "vs-light");
        }
      });
    });

    // Start observing
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Cleanup
    return () => observer.disconnect();
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onChange(content);
        onFileUpload?.(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex flex-col h-[400px]">
      {(title || onFileUpload) && (
        <div className="flex justify-between items-center mb-2">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          {onFileUpload && (
            <Button
              variant="outline"
              className="flex items-center gap-2"
              asChild
            >
              <label>
                <Upload className="w-4 h-4" />
                <span>Upload File</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </Button>
          )}
        </div>
      )}
      <div className="flex-1 overflow-hidden rounded-lg border">
        <MonacoEditor
          height="100%"
          defaultLanguage="json"
          value={value}
          onChange={(value) => onChange(value || "")}
          theme={theme}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            readOnly: false,
            ...options,
          }}
        />
      </div>
    </div>
  );
}
