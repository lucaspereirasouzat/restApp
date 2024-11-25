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

import ColorPicker, {
  Swatches,
  Preview,
} from "reanimated-color-picker";
import { AnimatePresence, MotiView } from "moti";

const validation = z.object({
  name: z.string().min(3).max(255),
  color: z.string(),
});

interface ModalDialogFolderProps {
  id: string;
  openDialog?: boolean;
  setOpenDialog?: (open?: undefined) => void;
}

export function ModalDialogFolder({ id, openDialog, setOpenDialog }: ModalDialogFolderProps) {
  const [isOpen, setIsOpen] = React.useState(openDialog ?? false);
  const { addFolderToWorkSpace } = useRestStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch
  } = useForm({
    defaultValues: {
      name: "",
      color: "#fff"
    },
    resolver: zodResolver(validation),
  });

  React.useEffect(() => {
    if (openDialog != isOpen) {
      setIsOpen(openDialog);
    }
  }, [openDialog, isOpen]);

  const onSubmit = (data: { name: string }) => {
    setIsOpen(false);
    setIsOpen(undefined)
    addFolderToWorkSpace(id.toString(), data);
    reset()
  };

  const onSelectColor = ({ hex }) => {
    setValue("color", hex);
  };

  return (
    <AnimatePresence>
    <Dialog onOpenChange={open => setIsOpen(open)} open={isOpen}>
      {/* <DialogTrigger asChild> */}
        {/* <Button
          onPress={() => setIsOpen(true)}
          className="bg-yellow-300 mx-1"
          variant="default"
        >
          <Text>Create Folder</Text>
        </Button> */}
      {/* </DialogTrigger> */}
      <DialogContent className="sm:max-w-[425px] bg-neutral-900">
        <MotiView
            key={`modal-folder`}
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "timing", duration: 500 }}
            className="w-full bg-neutral-900 p-4 rounded-lg"
          >
        <DialogHeader>
          <DialogTitle className="text-white">Create Folder</DialogTitle>
          <DialogDescription className="text-white">
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
          <FormInput
            className="placeholder:text-slate-400 border-gray-700 text-gray-300"
            control={control}
            name="name"
            errors={errors}
          />

          <ColorPicker
            style={{ width: "100%" }}
            value={watch("color")}
            onComplete={onSelectColor}
          >
            <Preview />
           
            <Swatches colors={[
              "#FF6900",
              "#FCB900",
              "#7BDCB5",
              "#00D084",
              "#8ED1FC",
              "#0693E3",
              "#ABB8C3",
              "#EB144C",
              "#F78DA7",
              "#9900EF",
              "#ffffff"
            ]} />
          </ColorPicker>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              onPress={handleSubmit(onSubmit)}
              className="bg-green-400 border border-gray-300"
            >
              <Text>Create Folder</Text>
            </Button>
          </DialogClose>
        </DialogFooter>
        </MotiView>
      </DialogContent>
    </Dialog>
    </AnimatePresence>
  );
}
