import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Stethoscope, Syringe, Activity, FileScan, Milestone } from "lucide-react";

export type TimelineEvent = {
  id: number;
  date: Date;
  title: string;
  description: string;
  type: 'appointment' | 'procedure' | 'scan' | 'milestone' | 'other';
};

interface TimelineItemProps {
  event: TimelineEvent;
  isLast: boolean;
}

const eventIcons = {
  appointment: <Stethoscope className="h-5 w-5 text-white" />,
  procedure: <Syringe className="h-5 w-5 text-white" />,
  scan: <FileScan className="h-5 w-5 text-white" />,
  milestone: <Milestone className="h-5 w-5 text-white" />,
  other: <Activity className="h-5 w-5 text-white" />,
};

const eventColors = {
  appointment: "bg-blue-500",
  procedure: "bg-purple-500",
  scan: "bg-teal-500",
  milestone: "bg-amber-500",
  other: "bg-gray-500",
};

const TimelineItem = ({ event, isLast }: TimelineItemProps) => {
  const isFuture = event.date > new Date();

  return (
    <div className="flex gap-x-4">
      {/* Vertical Line and Icon */}
      <div className="relative">
        {!isLast && (
          <div className="absolute left-1/2 top-5 h-full w-0.5 -translate-x-1/2 bg-border" />
        )}
        <div
          className={cn(
            "relative z-10 flex h-10 w-10 items-center justify-center rounded-full",
            eventColors[event.type]
          )}
        >
          {eventIcons[event.type]}
        </div>
      </div>

      {/* Content Card */}
      <div className="w-full pb-8">
        <Card className={cn(isFuture && "border-dashed")}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{event.title}</CardTitle>
              <time className="text-sm text-muted-foreground">
                {format(event.date, "MMM d, yyyy")}
              </time>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{event.description}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TimelineItem;