import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Text } from "@/components/ui/text";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormInput } from "@/components/input";
import { useRestStore } from "@/store/useRestStore";

const validation = z.object({
  name: z.string().min(3).max(255),
})

export function ModalDialog() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { createWorkSpace } = useRestStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(validation),
  });
  
  const onSubmit = (data) => {
    setIsOpen(false);
    setValue("name", "");
    createWorkSpace(data);
  };

  return (
    <Dialog onOpenChange={open => setIsOpen(open)} open={isOpen}>
      <DialogTrigger asChild>
        <Button onPress={() => setIsOpen(true)} className="bg-yellow-300 mx-1" variant="default">
          <Text>Create WorkSpaces</Text>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-neutral-900">
        <DialogHeader>
          <DialogTitle className="text-white">Create Documents</DialogTitle>
          <DialogDescription className="text-white">
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
          <FormInput 
            className="placeholder:text-slate-400 border-gray-700 text-gray-300" 
            control={control} 
            name="name" 
            errors={errors} 
          />
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
          <Button
            onPress={handleSubmit(onSubmit)}
            className="bg-green-400 border-0 border-gray-300"
          >
            <Text>CREATE DOCUMENT</Text>
          </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
