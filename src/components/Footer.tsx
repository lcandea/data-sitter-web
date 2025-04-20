import DataSitterIcon from "./ui/DataSitterIcon";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-10">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="../" className="flex items-center space-x-2">
              <DataSitterIcon className="h-8 w-8 text-primary" />
              <span className="font-bold text-lg">Data Sitter</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Create powerful data contracts and generate Pydantic models for
              seamless validation.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/contract"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Create Contract
                </Link>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#use-cases"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Use Cases
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/lcandea/data-sitter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/lcandea/data-sitter/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Community
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/lcandea/data-sitter/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Report Issue
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <a
                  href="https://github.com/lcandea/data-sitter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  <GitHubLogoIcon className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </a>
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Data Sitter. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
