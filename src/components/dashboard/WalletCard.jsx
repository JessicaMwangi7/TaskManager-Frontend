import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function WalletCard({
  title,
  balance,
  currency = "KES",
  cardNumber = "**** **** **** 5149",
  description,
  type,
  className,
}) {
  // Different gradient backgrounds based on wallet type
  const getGradient = () => {
    switch (type) {
      case "savings":
        return "from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800";
      case "investment":
        return "from-green-400 to-green-600 dark:from-green-600 dark:to-green-800";
      case "shared":
        return "from-purple-400 to-purple-600 dark:from-purple-600 dark:to-purple-800";
      case "credit":
        return "from-rose-400 to-pink-600 dark:from-rose-600 dark:to-pink-800";
      case "debit":
        return "from-emerald-400 to-teal-600 dark:from-emerald-600 dark:to-teal-800";
      default:
        return "from-orange-400 to-amber-600 dark:from-orange-600 dark:to-amber-800";
    }
  };

  return (
    <Card
      className={cn(
        "bg-gradient-to-r",
        getGradient(),
        "text-white rounded-lg shadow-md overflow-hidden",
        className,
      )}
    >
      <CardContent className="p-4">
        {/* Card title */}
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-lg">{title}</h3>
          {type && (
            <span className="text-xs px-2 py-1 rounded-full bg-white/20">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          )}
        </div>

        {/* Description if provided */}
        {description && (
          <p className="text-sm opacity-80 mt-1">{description}</p>
        )}

        {/* Balance */}
        <div className="mt-4">
          <div className="text-2xl font-bold">
            {currency} {Number.parseFloat(balance).toLocaleString()}
          </div>
        </div>

        {/* Card number */}
        <div className="mt-3 text-sm opacity-70">{cardNumber}</div>
      </CardContent>
    </Card>
  );
}
