import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "shadcn/ui/dialog";
import { colors } from "@/lib/constants/colors";
import { Tag } from "@/lib/types/project";
import { cn } from "@/lib/utils";
import { IconScriptPlus } from "@tabler/icons-react";
import { Dispatch, SetStateAction, useState } from "react";

export type ProjectForm = {
  id?: string;
  name: string;
  description?: string;
  color: string;
  tags: Tag[];
};

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onClose: () => void;
  form: ProjectForm;
  setForm: Dispatch<SetStateAction<ProjectForm>>;
  title: string;
  button: string;
  buttonOnClick: (id?: string) => void;
};

const DeleteModal = ({
  open,
  setOpen,
  onClose,
  form,
  setForm,
  title,
  button,
  buttonOnClick,
}: Props) => {
  const [input, setInput] = useState("");

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setForm({
            name: "",
            description: "",
            color: colors[0],
            tags: [],
          });
          onClose();
        }
        setOpen(open);
      }}
    >
      <DialogContent className="z-[1000] font-mono text-white border-0 bg-primary-600">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-secondary-200">
            <span>
              <IconScriptPlus className="w-5 h-5 text-secondary-200" />
            </span>
            <span className="flex gap-3 item-center">
              {title} {form?.name ? "-" : ""}{" "}
              <div style={{ color: form?.color }} className="w-56 truncate">
                {form?.name ?? ""}
              </div>
            </span>
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim() === form.name) {
              buttonOnClick(form.id);
            }
          }}
          className="mt-2"
        >
          <div className="space-y-3">
            <p className="text-sm font-bold tracking-wider text-secondary-200">
              Confirm delete by retyping{" "}
              <code className="px-2 py-1 font-mono rounded-md bg-primary-300">
                {form.name}
              </code>
            </p>
            <input
              type="text"
              //   disabled={input.trim() !== form.name}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
              }}
              placeholder={form.name}
              className="w-full px-3 py-2 rounded-md outline-none ring ring-secondary-200/50 bg-primary-500"
            />
          </div>
        </form>
        <div className="mt-2">
          <button
            disabled={input.trim() !== form.name}
            onClick={() => {
              buttonOnClick(form.id);
            }}
            className="w-full p-3 rounded-md disabled:cursor-not-allowed bg-primary-800 hover:bg-primary-700"
          >
            {button}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
