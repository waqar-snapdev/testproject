import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import useApi from "@/hooks/useApi";

type SymptomLog = {
  id: number;
  date: Date;
  fatigue: number;
  nausea: number;
  pain: number;
  notes: string;
};

const Symptoms = () => {
  const [symptoms, setSymptoms] = useState<SymptomLog[]>([]);
  const [fatigue, setFatigue] = useState(5);
  const [nausea, setNausea] = useState(5);
  const [pain, setPain] = useState(5);
  const [notes, setNotes] = useState("");
  const api = useApi();

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const data = await api.get("/symptoms");
        setSymptoms(data);
      } catch (error) {
        console.error("Failed to fetch symptoms", error);
      }
    };
    fetchSymptoms();
  }, []);

  const handleSubmit = async () => {
    try {
      const newSymptom = await api.post("/symptoms", {
        fatigue,
        nausea,
        pain,
        notes,
      });
      setSymptoms([newSymptom, ...symptoms]);
      // Reset form
      setFatigue(5);
      setNausea(5);
      setPain(5);
      setNotes("");
    } catch (error) {
      console.error("Failed to log symptom", error);
    }
  };

  return (
    <>
      <Header title="Symptom Tracker" />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Log Today's Symptoms</CardTitle>
                <CardDescription>
                  Use the sliders to rate your symptoms from 0 (none) to 10
                  (severe).
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="fatigue">Fatigue: {fatigue}</Label>
                  <Slider
                    id="fatigue"
                    min={0}
                    max={10}
                    step={1}
                    value={[fatigue]}
                    onValueChange={(value) => setFatigue(value[0])}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nausea">Nausea: {nausea}</Label>
                  <Slider
                    id="nausea"
                    min={0}
                    max={10}
                    step={1}
                    value={[nausea]}
                    onValueChange={(value) => setNausea(value[0])}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pain">Pain: {pain}</Label>
                  <Slider
                    id="pain"
                    min={0}
                    max={10}
                    step={1}
                    value={[pain]}
                    onValueChange={(value) => setPain(value[0])}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any other details..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSubmit} className="w-full">
                  Log Symptoms
                </Button>
              </CardFooter>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Symptom History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-center">Fatigue</TableHead>
                      <TableHead className="text-center">Nausea</TableHead>
                      <TableHead className="text-center">Pain</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {symptoms.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          {format(log.date, "MMM d, yyyy h:mm a")}
                        </TableCell>
                        <TableCell className="text-center">{log.fatigue}</TableCell>
                        <TableCell className="text-center">{log.nausea}</TableCell>
                        <TableCell className="text-center">{log.pain}</TableCell>
                        <TableCell>{log.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
};

export default Symptoms;