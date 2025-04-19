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
import { LogIn, Menu, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { lazy, useMemo, useState } from "react";
import { Button } from "./button";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { logout } from "@/store/slices/auth";

const LogInDialog = lazy(() =>
  import("./logInDialog").then((module) => ({ default: module.LogInDialog }))
);

export const UserMenu = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [openLogin, setOpenLogin] = useState(false);

  const userInfo = useMemo(() => {
    if (user) {
      return {
        name: user.user_metadata.full_name || "No Name",
        email: user.email || "No email",
        avatar: user.user_metadata.avatar_url,
        fallback: (user.user_metadata.full_name ?? "U")[0],
      };
    }
    return {
      name: "Local User",
      email: "Contracts stored locally only.",
      avatar: null,
      fallback: "?",
    };
  }, [user]);

  const handleViewContracts = () => {
    navigate("/contracts");
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <div className="hidden md:inline-flex">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              {user ? (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userInfo.avatar} alt={userInfo.name} />
                  <AvatarFallback>{userInfo.fallback}</AvatarFallback>
                </Avatar>
              ) : (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-muted">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {userInfo.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {userInfo.email}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/contracts")}>
              My Contracts
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {user ? (
              <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => setOpenLogin(true)}>
                <LogIn className="h-4 w-4 mr-2" />
                Log In
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
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
            <div className="flex items-center space-x-2 cursor-pointer">
              <>
                <Avatar>
                  {user ? (
                    <>
                      <AvatarImage src={userInfo.avatar} alt={userInfo.name} />
                      <AvatarFallback>{userInfo.fallback}</AvatarFallback>
                    </>
                  ) : (
                    <AvatarFallback className="bg-muted">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1">
                    <SheetTitle>
                      <p className="text-sm font-medium leading-none">
                        {userInfo.name}
                      </p>
                    </SheetTitle>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userInfo.email}
                    </p>
                  </div>
                </div>
              </>
            </div>
          </SheetHeader>
          <div className="flex flex-col gap-4 mt-8">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleViewContracts}
            >
              View Contracts
            </Button>

            {user ? (
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full text-red-500"
              >
                <LogOut className="mr-2" />
                Log Out
              </Button>
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
