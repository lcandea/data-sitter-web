import DataSitterIcon from "./ui/DataSitterIcon";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserMenu } from "./ui/UserMenu";

export function MainNav() {
  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 border-b">
        <div className="flex-1" />

        <div className="flex items-center justify-center flex-1">
          <Link
            to="/"
            className="flex items-center space-x-2 whitespace-nowrap"
          >
            <DataSitterIcon className="h-10 w-10 text-primary" />
            <span className="font-bold text-xl">Data Sitter</span>
          </Link>
        </div>

        <div className="flex items-center gap-4 flex-1 justify-end">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </div>
  );
}
