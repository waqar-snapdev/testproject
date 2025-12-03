import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useApi from "@/hooks/useApi";

interface VitalsLog {
  id: string;
  heart_rate: number;
  temperature: number;
  oxygen_saturation: number;
  date: string;
  notes?: string;
}

const Vitals = () => {
  const [logs, setLogs] = useState<VitalsLog[]>([]);
  const [heartRate, setHeartRate] = useState("");
  const [temperature, setTemperature] = useState("");
  const [oxygenSaturation, setOxygenSaturation] = useState("");
  const [notes, setNotes] = useState("");
  const api = useApi();

  const fetchLogs = async () => {
    try {
      const response = await api.get("/vitals");
      setLogs(response.data);
    } catch (error) {
      console.error("Failed to fetch vitals logs", error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/vitals", {
        heart_rate: parseInt(heartRate),
        temperature: parseFloat(temperature),
        oxygen_saturation: parseInt(oxygenSaturation),
        notes,
      });
      fetchLogs();
      setHeartRate("");
      setTemperature("");
      setOxygenSaturation("");
      setNotes("");
    } catch (error) {
      console.error("Failed to save vitals log", error);
    }
  };

  const handleDelete = async (logId: string) => {
    try {
      await api.delete(`/vitals/${logId}`);
      fetchLogs();
    } catch (error) {
      console.error("Failed to delete vitals log", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Vitals</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Log New Reading</CardTitle>
            <CardDescription>
              Enter your vitals readings below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="heartRate">Heart Rate</Label>
                    <Input
                      id="heartRate"
                      type="number"
                      value={heartRate}
                      onChange={(e) => setHeartRate(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="temperature">Temperature</Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="oxygenSaturation">Oxygen Saturation</Label>
                    <Input
                      id="oxygenSaturation"
                      type="number"
                      value={oxygenSaturation}
                      onChange={(e) => setOxygenSaturation(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
              <CardFooter className="mt-4">
                <Button type="submit">Save Reading</Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Historical Readings</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Heart Rate</TableHead>
                  <TableHead>Temperature</TableHead>
                  <TableHead>O2 Saturation</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {new Date(log.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{log.heart_rate}</TableCell>
                    <TableCell>{log.temperature}</TableCell>
                    <TableCell>{log.oxygen_saturation}</TableCell>
                    <TableCell>{log.notes}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(log.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Vitals;