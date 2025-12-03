import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import useApi from "@/hooks/useApi";

type Medication = {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  notes: string;
};

const Medications = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMed, setSelectedMed] = useState<Medication | null>(null);
  const [newMed, setNewMed] = useState({
    name: "",
    dosage: "",
    frequency: "",
    notes: "",
  });
  const { request } = useApi();

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const data = await request("/medications");
        setMedications(data);
      } catch (error) {
        console.error("Failed to fetch medications", error);
      }
    };
    fetchMedications();
  }, []);

  const handleAddMedication = async () => {
    if (selectedMed) {
      handleUpdateMedication();
      return;
    }
    if (!newMed.name || !newMed.dosage || !newMed.frequency) return;
    try {
      const newMedication = await request("/medications", {
        method: "POST",
        body: JSON.stringify(newMed),
      });
      setMedications([...medications, newMedication]);
      setNewMed({ name: "", dosage: "", frequency: "", notes: "" });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to add medication", error);
    }
  };

  const handleUpdateMedication = async () => {
    if (!selectedMed) return;
    try {
      const updatedMed = await request(`/medications/${selectedMed.id}`, {
        method: "PUT",
        body: JSON.stringify(newMed),
      });
      setMedications(
        medications.map((med) => (med.id === selectedMed.id ? updatedMed : med))
      );
      setNewMed({ name: "", dosage: "", frequency: "", notes: "" });
      setSelectedMed(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to update medication", error);
    }
  };

  const handleDeleteMedication = async (id: number) => {
    try {
      await request(`/medications/${id}`, {
        method: "DELETE",
      });
      setMedications(medications.filter((med) => med.id !== id));
    } catch (error) {
      console.error("Failed to delete medication", error);
    }
  };

  const handleEditClick = (med: Medication) => {
    setSelectedMed(med);
    setNewMed(med);
    setIsDialogOpen(true);
  };

  return (
    <>
      <Header title="Medications" />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your Medications</CardTitle>
              <CardDescription>
                A list of your current prescribed medications.
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <PlusCircle className="h-4 w-4" />
                  Add Medication
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {selectedMed ? "Edit Medication" : "Add New Medication"}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedMed
                      ? "Edit the details of your medication here."
                      : "Enter the details of your new medication here."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newMed.name}
                      onChange={(e) =>
                        setNewMed({ ...newMed, name: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dosage" className="text-right">
                      Dosage
                    </Label>
                    <Input
                      id="dosage"
                      value={newMed.dosage}
                      onChange={(e) =>
                        setNewMed({ ...newMed, dosage: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="frequency" className="text-right">
                      Frequency
                    </Label>
                    <Input
                      id="frequency"
                      value={newMed.frequency}
                      onChange={(e) =>
                        setNewMed({ ...newMed, frequency: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">
                      Notes
                    </Label>
                    <Textarea
                      id="notes"
                      value={newMed.notes}
                      onChange={(e) =>
                        setNewMed({ ...newMed, notes: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddMedication}>Save Medication</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medications.map((med) => (
                  <TableRow key={med.id}>
                    <TableCell className="font-medium">{med.name}</TableCell>
                    <TableCell>{med.dosage}</TableCell>
                    <TableCell>{med.frequency}</TableCell>
                    <TableCell>{med.notes}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditClick(med)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteMedication(med.id)}
                            className="text-red-600"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </>
  );
};

export default Medications;