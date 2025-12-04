import { useState, useEffect } from "react";
import Header from "@/components/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Heart, Pill, Utensils } from "lucide-react";
import { format } from "date-fns";
import useApi from "@/hooks/useApi";
import FamilyMember, { InviteMember } from "@/components/FamilyMember";

const Family = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [latestSymptom, setLatestSymptom] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [medications, setMedications] = useState([]);
  const { request } = useApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          familyData,
          symptomData,
          appointmentData,
          medicationData,
        ] = await Promise.all([
          request("/family"),
          request("/symptoms"),
          request("/appointments"),
          request("/medications"),
        ]);
        setFamilyMembers(familyData);
        setLatestSymptom(
          Array.isArray(symptomData) && symptomData.length > 0
            ? symptomData[symptomData.length - 1]
            : null
        );
        setAppointments(appointmentData);
        setMedications(medicationData);
      } catch (error) {
        console.error("Failed to fetch family data", error);
      }
    };
    fetchData();
  }, []);

  const handleRemoveMember = async (id: string) => {
    try {
      await request(`/family/${id}`, {
        method: "DELETE",
      });
      setFamilyMembers(familyMembers.filter((member) => member.id !== id));
    } catch (error) {
      console.error("Failed to remove family member", error);
    }
  };

  const handleInviteMember = async (newMember: { name: string; relation: string }) => {
    try {
      const invitedMember = await request("/family/invite", {
        method: "POST",
        body: JSON.stringify(newMember),
      });
      setFamilyMembers([...familyMembers, invitedMember]);
    } catch (error) {
      console.error("Failed to invite family member", error);
    }
  };

  return (
    <>
      <Header title="Family View" />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">
            John's Health Summary
          </h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
              {latestSymptom && (
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
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {appointments.map((appt) => (
                <div key={appt.id} className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">
                      {appt.specialty} with {appt.doctor}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>
                        {format(new Date(appt.date), "EEEE, MMMM d")}
                      </span>
                      <span>at {format(new Date(appt.date), "p")}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {appt.location}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Current Medications</CardTitle>
              <CardDescription>
                This is a list of medications John is currently taking.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {medications.map((med) => (
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
                    {med.notes && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Note: {med.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ways to Support</CardTitle>
              <CardDescription>
                Here are a few ways you can help.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-green-500/10 p-2">
                  <Utensils className="h-5 w-5 text-green-600" />
                </div>
                <p>Offer to help with meals or groceries.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-blue-500/10 p-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <p>Provide transportation to appointments.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-purple-500/10 p-2">
                  <Heart className="h-5 w-5 text-purple-600" />
                </div>
                <p>Simply listen and offer emotional support.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Manage Family Access</CardTitle>
              <CardDescription>
                Invite or remove family members who can view this summary.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {familyMembers.map((member) => (
                  <FamilyMember
                    key={member.id}
                    {...member}
                    onRemove={handleRemoveMember}
                  />
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <InviteMember onInvite={handleInviteMember} />
            </CardFooter>
          </Card>
        </div>
      </main>
    </>
  );
};

export default Family;