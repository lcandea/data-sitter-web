import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LogInDialog } from "./logInDialog";
import { useState } from "react";
import { Button } from "./button";

export const UserMenu = () => {
  const { user, logout } = useAuth();
  const [openLogin, setOpenLogin] = useState(false);
  const navigate = useNavigate();

  const handleViewContracts = () => {
    navigate("/contracts");
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <div className="hidden md:inline-flex">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex items-center space-x-2 cursor-pointer">
                <Avatar>
                  <AvatarImage src={undefined} alt={user?.email} />
                  <AvatarFallback>
                    {user?.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">
                    {user?.email?.split("@")[0]}
                  </p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem onClick={handleViewContracts}>
                View Contracts
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                <LogOut className="mr-2" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="outline" onClick={() => setOpenLogin(true)}>
            Log In
          </Button>
        )}
      </div>

      {/* Mobile Edition */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            {user ? (
              <div className="flex items-center space-x-2 cursor-pointer">
                <Avatar>
                  <AvatarImage src={undefined} alt={user?.email} />
                  <AvatarFallback>
                    {user?.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">
                    {user?.email?.split("@")[0]}
                  </p>
                </div>
              </div>
            ) : (
              <SheetTitle>Navigation</SheetTitle>
            )}
          </SheetHeader>
          <div className="flex flex-col gap-4 mt-8">
            {user ? (
              <>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleViewContracts}
                >
                  View Contracts
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full text-red-500"
                >
                  <LogOut className="mr-2" />
                  Log Out
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setOpenLogin(true)}
              >
                Log In
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <LogInDialog open={openLogin} onOpenChange={setOpenLogin} />
    </>
  );
};
