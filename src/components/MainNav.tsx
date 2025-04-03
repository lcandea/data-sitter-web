import DataSitterIcon from "./ui/DataSitterIcon";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

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
          {/* <Button variant="outline" className="hidden md:inline-flex">
            Log In
          </Button> */}
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-8">
                <Button variant="outline" className="w-full">
                  Log In
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
