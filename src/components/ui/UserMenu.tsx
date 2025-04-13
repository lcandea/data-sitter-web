import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { LogIn, Menu } from "lucide-react";
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
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user.user_metadata.avatar_url}
                    alt={(user.user_metadata.full_name ?? "?")[0]}
                  />
                  <AvatarFallback>
                    {(user.user_metadata.full_name ?? "?")[0]}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.user_metadata.full_name || "No Name"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email || "No email"}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/contracts")}>
                My Contracts
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="outline"
            onClick={() => setOpenLogin(true)}
            className="hidden md:inline-flex"
          >
            <LogIn className="h-4 w-4 mr-2" />
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
                  <AvatarImage
                    src={user.user_metadata.avatar_url}
                    alt={(user.user_metadata.full_name ?? "?")[0]}
                  />
                  <AvatarFallback>
                    {(user.user_metadata.full_name ?? "?")[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.user_metadata.full_name || "No Name"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email || "No email"}
                    </p>
                  </div>
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
                <LogIn className="mr-2" />
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
