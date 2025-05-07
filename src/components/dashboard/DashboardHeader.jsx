import { UserButton } from "@clerk/clerk-react";
import { Bell, Menu, Search, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Input } from "@/components/ui/input";
import { useNotifications } from "@/hooks/use-notifications";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ExpenseIncomeForm from "@/components/dashboard/AddExpense";
import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// scrollable
const ScrollableExpenseForm = ({ onSuccess }) => {
  return (
    <div className="max-h-[80vh] overflow-y-auto p-1 pr-2 custom-scrollbar">
      <ExpenseIncomeForm onSuccess={onSuccess} />
    </div>
  );
};

export function DashboardHeader({ onMenuClick }) {
  const { notifications, unreadCount } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 20px;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
        }
      `}</style>

      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-4 px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>

          {/* Search Section */}
          <div className="flex flex-1 items-center gap-4 md:gap-6 md:max-w-2xl md:mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search anything..."
                className="pl-8 w-full bg-muted"
              />
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex items-center gap-2">
            {/* Add Expense Dialog  */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md md:max-w-lg p-0 sm:p-0 max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader className="px-4 pt-4 pb-0">
                  <DialogTitle className="text-center">
                    Add Transaction
                  </DialogTitle>
                </DialogHeader>
                <ScrollableExpenseForm onSuccess={() => setIsOpen(false)} />
              </DialogContent>
            </Dialog>

            {/* Mobile Add Button */}
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(true)}
            >
              <Plus className="h-5 w-5" />
              <span className="sr-only">Add Expense</span>
            </Button>

            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium flex items-center justify-center text-primary-foreground">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between p-2">
                  <h3 className="font-medium">Notifications</h3>
                  <Link to="/dashboard/notifications">
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
                {notifications?.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No new notifications
                  </div>
                ) : (
                  <div className="max-h-96 overflow-auto">
                    {notifications?.slice(0, 5).map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className="p-3 cursor-default"
                      >
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">
                              {notification.title}
                            </span>
                            {!notification.is_read && (
                              <span className="h-2 w-2 rounded-full bg-primary"></span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {notification.message}
                          </p>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                },
              }}
            />
          </div>
        </div>
      </header>
    </>
  );
}
