import { useState, useEffect } from "react";
import Header from "@/components/Header";
import TimelineItem from "@/components/TimelineItem";
import useApi from "@/hooks/useApi";

import { TimelineEvent } from "@/components/TimelineItem";

const Timeline = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const { request } = useApi();

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const data = await request("/timeline");
        const formattedData = data.map((event: any) => ({
          ...event,
          id: Number(event.id), // Convert id to number
          date: new Date(event.date), // Convert date string to Date object
        }));
        setEvents(formattedData);
      } catch (error) {
        console.error("Failed to fetch timeline", error);
      }
    };
    fetchTimeline();
  }, []);

  // Sort events by date, descending
  const sortedEvents = events.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <>
      <Header title="Care Timeline" />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">
            Your Health Journey
          </h1>
        </div>
        <div className="flex-1">
          <div className="space-y-0">
            {sortedEvents.map((event, index) => (
              <TimelineItem
                key={event.id}
                event={event}
                isLast={index === sortedEvents.length - 1}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Timeline;