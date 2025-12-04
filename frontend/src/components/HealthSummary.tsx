import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart, Pill } from "lucide-react";
import { format } from "date-fns";
import useApi from "@/hooks/useApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Symptom {
  id: string;
  date: string;
  fatigue: number;
  nausea: number;
  pain: number;
  notes?: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
}

interface BloodPressure {
  id: string;
  date: string;
  systolic: number;
  diastolic: number;
  pulse: number;
}

interface Vitals {
  id: string;
  date: string;
  heart_rate: number;
  temperature: number;
  oxygen_saturation: number;
}

const HealthSummary = () => {
  const [latestSymptom, setLatestSymptom] = useState<Symptom | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [latestBloodPressure, setLatestBloodPressure] =
    useState<BloodPressure | null>(null);
  const [bloodPressureHistory, setBloodPressureHistory] = useState<BloodPressure[]>([]);
  const [latestVitals, setLatestVitals] = useState<Vitals | null>(null);
  const api = useApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          symptomsResponse,
          medicationsResponse,
          bloodPressureResponse,
          vitalsResponse,
        ] = await Promise.all([
          api.get("/symptoms"),
          api.get("/medications"),
          api.get("/bloodpressure"),
          api.get("/vitals"),
        ]);
        setLatestSymptom(
          symptomsResponse.length > 0
            ? symptomsResponse[symptomsResponse.length - 1]
            : null
        );
        setMedications(medicationsResponse);
        
        // Sort blood pressure by date ascending for the chart
        const sortedBP = [...bloodPressureResponse].sort(
          (a: BloodPressure, b: BloodPressure) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setBloodPressureHistory(sortedBP);
        setLatestBloodPressure(
          sortedBP.length > 0 ? sortedBP[sortedBP.length - 1] : null
        );

        setLatestVitals(
          vitalsResponse.length > 0
            ? vitalsResponse[vitalsResponse.length - 1]
            : null
        );
      } catch (error) {
        console.error("Failed to fetch health summary data", error);
      }
    };
    fetchData();
  }, []); // Removed [api] dependency to prevent infinite loop

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Latest Update</CardTitle>
          {latestSymptom && (
            <CardDescription>
              As of{" "}
              {format(
                new Date(latestSymptom.date),
                "MMM d, yyyy 'at' h:mm a"
              )}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="grid gap-4">
          {latestSymptom ? (
            <>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Symptom Levels</p>
                  <p className="text-sm text-muted-foreground">
                    Fatigue: {latestSymptom.fatigue}/10, Nausea:{" "}
                    {latestSymptom.nausea}/10, Pain: {latestSymptom.pain}/10
                  </p>
                </div>
              </div>
              {latestSymptom.notes && (
                <div>
                  <p className="font-medium">Notes:</p>
                  <p className="text-sm text-muted-foreground">
                    "{latestSymptom.notes}"
                  </p>
                </div>
              )}
            </>
          ) : (
            <p>No symptoms logged yet.</p>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Current Medications</CardTitle>
          <CardDescription>
            A list of your current medications.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {medications.length > 0 ? (
            medications.map((med) => (
              <div key={med.id} className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Pill className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">
                    {med.name} ({med.dosage})
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {med.frequency}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No medications added yet.</p>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
          <CardDescription>
            Personalized insights based on your health data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>AI insights will be displayed here.</p>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Blood Pressure History</CardTitle>
          {latestBloodPressure && (
            <CardDescription>
              Latest reading on{" "}
              {format(new Date(latestBloodPressure.date), "MMM d, yyyy")}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {bloodPressureHistory.length > 0 ? (
            <div className="h-[200px] w-full">
              <div className="mb-4 flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">
                    {latestBloodPressure?.systolic} /{" "}
                    {latestBloodPressure?.diastolic} mmHg
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Latest Pulse: {latestBloodPressure?.pulse} bpm
                  </p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bloodPressureHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => format(new Date(date), "MM/dd")}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(date) => format(new Date(date), "MMM d, yyyy h:mm a")}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="systolic"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    name="Systolic"
                  />
                  <Line
                    type="monotone"
                    dataKey="diastolic"
                    stroke="hsl(var(--destructive))"
                    strokeWidth={2}
                    name="Diastolic"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p>No blood pressure readings logged yet.</p>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Vitals</CardTitle>
          {latestVitals && (
            <CardDescription>
              Latest reading on{" "}
              {format(new Date(latestVitals.date), "MMM d, yyyy")}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {latestVitals ? (
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-2">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">
                  {latestVitals.heart_rate} bpm, {latestVitals.temperature}°F,{" "}
                  {latestVitals.oxygen_saturation}% SpO2
                </p>
              </div>
            </div>
          ) : (
            <p>No vitals logged yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthSummary;