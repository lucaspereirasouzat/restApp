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
import { AnimatePresence, MotiView } from "moti";

const validation = z.object({
  name: z.string().min(3).max(255),
})

interface ModalDialogFolderProps {
  folderId: string
  workspaceId: string
  openDialog?: {
    id: string
  } | boolean
  setOpenDialog?: (open?: undefined) => void
}

const defaultRequest = {
  url: "http://localhost:3000",
  method: "GET",
  headers: [],
  body: [],
}

export function ModalDialogRequest({folderId, workspaceId, openDialog, setOpenDialog}:ModalDialogFolderProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { addRequestToWorkSpace, addRequestToFolder } = useRestStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(validation),
  });

  React.useEffect(() => {
    if(openDialog != isOpen){
      setIsOpen(openDialog);
    }
  }, [openDialog,isOpen]);

  const onSubmit = React.useCallback((data) => {
    setIsOpen(false);
    setOpenDialog && setOpenDialog(undefined)
    if(openDialog && typeof openDialog === "object"){
      return addRequestToFolder(workspaceId,openDialog, {...data, ...defaultRequest});
    }
    addRequestToWorkSpace(workspaceId,{...data, ...defaultRequest});
  },[openDialog, workspaceId]);

  return (
    <AnimatePresence >
    <Dialog onOpenChange={open => setIsOpen(open)} open={isOpen}>
       {/* <DialogTrigger asChild> 
         <Button onPress={() => setIsOpen(true)} className="bg-yellow-300 mx-1" variant="default">
          <Text>Create Request</Text>
        </Button> 
       </DialogTrigger>  */}
      <DialogContent className="sm:max-w-[425px] bg-neutral-900">
         <MotiView
            key={`modal-request`}
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "timing", duration: 500 }}
            className="w-full bg-neutral-900 p-4 rounded-lg"
          >
        <DialogHeader>
          <DialogTitle className="text-white">Create Request</DialogTitle>
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
            className="bg-green-400 border border-gray-300"
          >
            <Text>Create Workspace</Text>
          </Button>
          </DialogClose>
        </DialogFooter>
        </MotiView>
      </DialogContent>
    </Dialog>
    </AnimatePresence>
  );
}
