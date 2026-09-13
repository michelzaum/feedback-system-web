import { useRef, type SubmitEvent } from "react"
import axios from "axios";

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CreateOrganizationModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const organizationName = useRef<HTMLInputElement>({} as HTMLInputElement);

  const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newOrganizationName = organizationName.current.value;

    if (!newOrganizationName) return;

    try {
      await axios.post("http://localhost:3001/organizations", { name: newOrganizationName });
    } catch (error) {
      console.log(error);
    }

    onOpenChange(false);
  }

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-sm p-2" showCloseButton={false}>
        <DialogHeader className="flex flez-col gap-2 py-8">
          <DialogTitle>Adicionar organização</DialogTitle>
          <DialogDescription>
            Crie uma nova organização para gerenciar feedback dos projetos
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <Field className="px-4">
            <Label htmlFor="name-1">Nome da organização</Label>
            <Input id="name-1" name="name" ref={organizationName} />
          </Field>
          <DialogFooter className="flex flex-row items-center py-8">
            <DialogClose
              render={
                <Button onClick={() => onOpenChange(false)} variant="secondary" className="flex-1 h-12 hover:cursor-pointer transition-all duration-300">
                  Cancel
                </Button>
              }
            />
            <Button type="submit" className="flex-1 h-12 hover:cursor-pointer transition-all duration-300">
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
