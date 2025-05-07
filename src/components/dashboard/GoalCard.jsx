import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function GoalCard({ title, icon, current, target, currency = "KSH" }) {
  const progress = (current / target) * 100;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {currency} {current.toLocaleString()}
          <span className="text-sm font-normal text-muted-foreground">
            {" "}
            / {currency} {target.toLocaleString()}
          </span>
        </div>
        <Progress value={progress} className="mt-2" />
      </CardContent>
    </Card>
  );
}
