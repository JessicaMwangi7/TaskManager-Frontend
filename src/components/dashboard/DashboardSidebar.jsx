import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  CreditCard,
  DollarSign,
  Home,
  Bell,
  Search,
  Settings,
  Users,
  HelpCircle,
  LogOut,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/use-notifications";
import { FileText } from "lucide-react";

const sidebarLinks = [
  {
    section: "DASHBOARD",
    items: [
      {
        title: "Dashboard",
        icon: Home,
        href: "/dashboard",
      },
      {
        title: "Wallets",
        icon: CreditCard,
        href: "/dashboard/wallets",
      },
      {
        title: "Transactions",
        icon: DollarSign,
        href: "/dashboard/transactions",
      },

      {
        title: "Budgets",
        icon: BarChart3,
        href: "/dashboard/budgets",
      },
      {
        title: "Report",
        icon: FileText,
        href: "/dashboard/reports",
      },
    ],
  },
  {
    section: "COMMUNICATION",
    items: [
      {
        title: "Notifications",
        icon: Bell,
        href: "/dashboard/notifications",
      },
      {
        title: "Shared Wallets",
        icon: Users,
        href: "/dashboard/shared",
      },
    ],
  },
  {
    section: "SETTINGS",
    items: [
      // {
      //   title: "Access Control",
      //   icon: Shield,
      //   href: "/dashboard/access",
      // },
      {
        title: "Settings",
        icon: Settings,
        href: "/dashboard/settings",
      },
    ],
  },
];

export function DashboardSidebar({ open, onOpenChange }) {
  const location = useLocation();
  const { logout } = useAuth();
  const { unreadCount } = useNotifications();

  // Close mobile sidebar
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile && open) {
      onOpenChange(false);
    }
  }, [location.pathname, open, onOpenChange]);

  //sheet popping up on every reload
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile && open) {
      onOpenChange(false);
    }
  }, [open, onOpenChange]);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 font-semibold text-lg"
        >
          <span className="font-bold">SW</span>
        </Link>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            className="pl-8 bg-muted/50 border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/50"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto py-2">
        {sidebarLinks.map((section, index) => (
          <div
            key={section.section}
            className={cn("py-2", index !== 0 && "mt-4")}
          >
            <h4 className="px-4 text-xs font-medium text-sidebar-foreground/70 mb-1">
              {section.section}
            </h4>
            <nav className="grid gap-1 px-2">
              {section.items.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link key={item.href} to={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-2 text-sidebar-foreground",
                        {
                          "bg-sidebar-accent text-sidebar-accent-foreground":
                            isActive,
                        },
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                      {item.title === "Notifications" && unreadCount > 0 && (
                        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
                          {unreadCount}
                        </span>
                      )}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="mt-auto border-t border-sidebar-border p-4">
        <nav className="grid gap-1">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-sidebar-foreground"
          >
            <HelpCircle className="h-4 w-4" />
            Help
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-sidebar-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={() => logout()}
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </nav>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open && window.innerWidth < 768} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-72 p-0 bg-sidebar">
          {sidebarContent}
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar - now extends full height */}
      <aside className="hidden md:block w-72 border-r border-sidebar-border bg-sidebar h-screen overflow-hidden">
        {sidebarContent}
      </aside>
    </>
  );
}
