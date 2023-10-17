import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { colors } from "@/lib/constants/colors";
import { cn } from "@/lib/utils";
import { IconScriptPlus } from "@tabler/icons-react";
import { Dispatch, SetStateAction } from "react";

export type ProjectForm = {
  id?: string;
  name: string;
  description?: string;
  color: string;
};

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onClose: () => void;
  form: ProjectForm;
  setForm: Dispatch<SetStateAction<ProjectForm>>;
  title: string;
  button: string;
  buttonOnClick: () => void;
};

const ProjectModal = ({
  open,
  setOpen,
  onClose,
  form,
  setForm,
  title,
  button,
  buttonOnClick,
}: Props) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setForm({
            name: "",
            description: "",
            color: colors[0],
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
        <div className="mt-2">
          <div className="space-y-3">
            <p className="text-sm font-bold tracking-wider text-secondary-200">
              Name
            </p>
            <input
              type="text"
              value={form.name}
              onChange={(e) => {
                setForm((p: any) => {
                  return { ...p, name: e.target.value };
                });
              }}
              placeholder="Project name"
              className="w-full px-3 py-2 rounded-md outline-none ring ring-secondary-200/50 bg-primary-500"
            />
          </div>
        </div>
        <div className="mt-2">
          <div className="space-y-3">
            <p className="text-sm font-bold tracking-wider text-secondary-200">
              Description
            </p>
            <textarea
              value={form.description}
              rows={8}
              onChange={(e) => {
                setForm((p: any) => {
                  return { ...p, description: e.target.value };
                });
              }}
              placeholder="About this project"
              className="w-full px-3 py-2 rounded-md outline-none ring ring-secondary-200/50 bg-primary-500"
            />
          </div>
        </div>
        <div className="mt-2">
          <div className="space-y-3">
            <p className="text-sm font-bold tracking-wider text-secondary-200">
              Tag
            </p>
            <div className="flex flex-wrap gap-2">
              {colors.map((c, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setForm((p: any) => {
                      return { ...p, color: c };
                    });
                  }}
                  className={cn([
                    "w-6 h-6 transition duration-200 rounded-full cursor-pointer hover:border-4",
                    form.color === c && "border-4 relative -top-1",
                  ])}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-2">
          <button
            disabled={form.name.length === 0 || form.color.length === 0}
            onClick={buttonOnClick}
            className="w-full p-3 rounded-md disabled:cursor-not-allowed bg-primary-800 hover:bg-primary-700"
          >
            {button}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
