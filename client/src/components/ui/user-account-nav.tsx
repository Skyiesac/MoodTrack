import { useNavigate } from "react-router-dom";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Avatar, AvatarFallback } from "./avatar";
import { Settings, LogOut } from "lucide-react";
import { useUser } from "../../hooks/use-user";
import { api } from "../../utils/api";
import { useToast } from "../../hooks/use-toast";

export function UserAccountNav() {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const { toast } = useToast();

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to logout"
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-10 w-10 rounded-full ring-2 ring-blue-100 hover:ring-blue-200 transition-all"
        >
          <Avatar className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600">
            <AvatarFallback className="text-white font-medium">
              {user.firstName[0]}
              {user.lastName[0]}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-2 bg-white shadow-lg border border-gray-200" align="end" forceMount>
        <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100">
          <Avatar className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600">
            <AvatarFallback className="text-white font-medium text-lg">
              {user.firstName[0]}
              {user.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1">
            <p className="font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-gray-500 truncate max-w-[180px]">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuItem
          className="cursor-pointer flex items-center py-2 px-3 rounded-md hover:bg-gray-50 transition-colors"
          onClick={() => navigate('/settings')}
        >
          <Settings className="mr-3 h-4 w-4 text-gray-500" />
          <span className="text-gray-700 font-medium">Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer flex items-center py-2 px-3 rounded-md hover:bg-red-50 transition-colors text-red-600 hover:text-red-700" 
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span className="font-medium">Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
