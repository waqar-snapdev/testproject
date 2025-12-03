import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, TrendingUp, BellRing } from "lucide-react";

const AiInsights = () => {
  const insights = [
    {
      icon: TrendingUp,
      title: "Pattern Detected",
      text: "Your blood sugar levels have been slightly elevated in the evenings this week. Consider a lighter dinner or a short walk after your meal.",
      color: "text-blue-500",
    },
    {
      icon: Lightbulb,
      title: "Personalized Advice",
      text: "We've noticed your fatigue scores are lowest on days you log morning activity. Keeping up this routine could boost your energy levels.",
      color: "text-amber-500",
    },
    {
      icon: BellRing,
      title: "Potential Flare-Up Risk",
      text: "Your logged nausea has increased slightly over the past 3 days. Be sure to take your Metformin with meals and contact your care team if it worsens.",
      color: "text-red-500",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Insights</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="rounded-full bg-muted p-2">
              <insight.icon className={`h-5 w-5 ${insight.color}`} />
            </div>
            <div>
              <p className="font-semibold">{insight.title}</p>
              <p className="text-sm text-muted-foreground">{insight.text}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AiInsights;