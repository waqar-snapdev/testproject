import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, UserPlus } from "lucide-react";
import { showSuccess } from "@/utils/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FamilyMemberProps = {
  id: string;
  name: string;
  relation: string;
  onRemove: (id: string) => void;
};

const FamilyMember = ({ id, name, relation, onRemove }: FamilyMemberProps) => {
  const handleRemove = () => {
    onRemove(id);
    showSuccess("Family member removed.");
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-sm text-muted-foreground">{relation}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const InviteMember = ({ onInvite }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");

  const handleInvite = () => {
    onInvite({ name, relation });
    setIsOpen(false);
    setName("");
    setRelation("");
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="w-full">
        <UserPlus className="mr-2 h-4 w-4" /> Invite New Member
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Family Member</DialogTitle>
            <DialogDescription>
              Enter the details of the family member you'd like to invite.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="relation" className="text-right">
                Relation
              </Label>
              <Input
                id="relation"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleInvite}>
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FamilyMember;