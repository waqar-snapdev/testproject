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

interface BloodPressureLog {
  id: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  date: string;
  notes?: string;
}

const BloodPressure = () => {
  const [logs, setLogs] = useState<BloodPressureLog[]>([]);
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [pulse, setPulse] = useState("");
  const [notes, setNotes] = useState("");
  const api = useApi();

  const fetchLogs = async () => {
    try {
      const response = await api.get("/bloodpressure");
      setLogs(response.data);
    } catch (error) {
      console.error("Failed to fetch blood pressure logs", error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/bloodpressure", {
        systolic: parseInt(systolic),
        diastolic: parseInt(diastolic),
        pulse: parseInt(pulse),
        notes,
      });
      fetchLogs();
      setSystolic("");
      setDiastolic("");
      setPulse("");
      setNotes("");
    } catch (error) {
      console.error("Failed to save blood pressure log", error);
    }
  };

  const handleDelete = async (logId: string) => {
    try {
      await api.delete(`/bloodpressure/${logId}`);
      fetchLogs();
    } catch (error) {
      console.error("Failed to delete blood pressure log", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Blood Pressure</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Log New Reading</CardTitle>
            <CardDescription>
              Enter your blood pressure readings below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="systolic">Systolic</Label>
                    <Input
                      id="systolic"
                      type="number"
                      value={systolic}
                      onChange={(e) => setSystolic(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="diastolic">Diastolic</Label>
                    <Input
                      id="diastolic"
                      type="number"
                      value={diastolic}
                      onChange={(e) => setDiastolic(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="pulse">Pulse</Label>
                    <Input
                      id="pulse"
                      type="number"
                      value={pulse}
                      onChange={(e) => setPulse(e.target.value)}
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
                  <TableHead>Systolic</TableHead>
                  <TableHead>Diastolic</TableHead>
                  <TableHead>Pulse</TableHead>
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
                    <TableCell>{log.systolic}</TableCell>
                    <TableCell>{log.diastolic}</TableCell>
                    <TableCell>{log.pulse}</TableCell>
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

export default BloodPressure;