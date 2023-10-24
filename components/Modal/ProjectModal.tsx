import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { colors } from "@/lib/constants/colors";
import { Tag } from "@/lib/types/project";
import { cn } from "@/lib/utils";
import {
  IconCheck,
  IconPlus,
  IconScriptPlus,
  IconX,
} from "@tabler/icons-react";
import { nanoid } from "nanoid";
import { Dispatch, SetStateAction, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [addTag, setAddTag] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tagColor, setTagColor] = useState("#FE409C");
  // console.log(form);
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
      <DialogContent className="z-[1000] font-mono text-white border-0 bg-light-200 dark:bg-primary-600">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-secondary-100 dark:text-secondary-200">
            <span>
              <IconScriptPlus className="w-5 h-5 text-secondary-100 dark:text-secondary-200" />
            </span>
            <span className="flex gap-3 item-center">
              {title}{" "}
              {form?.name ? (
                <>
                  -{" "}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="z-[1000000]">
                      <span
                        className="w-4 h-4 rounded cursor-pointer hover:ring-2 ring-primary-400 dark:ring-primary-100"
                        style={{ background: form.color }}
                      ></span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="bottom" className="z-[1000000]">
                      <div className="flex flex-wrap gap-2 p-2">
                        {colors?.map((color, _i) => (
                          <div
                            key={_i}
                            onClick={() => {
                              setForm((p) => {
                                return {
                                  ...p,
                                  color,
                                };
                              });
                            }}
                            className="w-4 h-4 rounded cursor-pointer hover:ring-2 ring-primary-600 dark:ring-primary-100"
                            style={{ background: color }}
                          />
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                ""
              )}
              <div style={{ color: form?.color }} className="truncate w-52">
                {form?.name ?? ""}
              </div>
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <div className="space-y-3">
            <p className="text-sm font-bold tracking-wider text-secondary-100 dark:text-secondary-200">
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
              className="w-full px-3 py-2 text-black rounded-md outline-none ring dark:text-white ring-secondary-100/50 dark:ring-secondary-200/50 bg-light-300 dark:bg-primary-500"
            />
          </div>
        </div>
        <div className="mt-2">
          <div className="space-y-3">
            <p className="text-sm font-bold tracking-wider text-secondary-100 dark:text-secondary-200">
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
              className="w-full px-3 py-2 text-black rounded-md outline-none ring dark:text-white ring-secondary-100/50 dark:ring-secondary-200/50 bg-light-300 dark:bg-primary-500"
            />
          </div>
        </div>
        <div className="mt-2">
          <div className="space-y-3">
            <p className="text-sm font-bold tracking-wider text-secondary-100 dark:text-secondary-200">
              Tag
            </p>
            <div className="flex flex-wrap gap-2">
              {form?.tags?.map((tag, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-2 transition rounded ring-2 ring-secondary-100/50 dark:ring-secondary-200/50 group bg-light-300 dark:bg-primary-400 dark:text-white text-primary-400"
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="z-[1000000]">
                      <span
                        className="w-4 h-4 mr-2 rounded cursor-pointer hover:ring-2 ring-primary-400 dark:ring-primary-100"
                        style={{ background: tag.color }}
                      ></span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="top" className="z-[1000000]">
                      <div className="flex flex-wrap gap-2 p-2">
                        {colors?.map((color, _i) => (
                          <div
                            key={_i}
                            onClick={() => {
                              setForm((p) => {
                                return {
                                  ...p,
                                  tags: p.tags?.map((t) =>
                                    t.id === tag.id
                                      ? {
                                          ...t,
                                          color,
                                        }
                                      : t
                                  ),
                                };
                              });
                            }}
                            className="w-4 h-4 rounded cursor-pointer hover:ring-2 ring-primary-600 dark:ring-primary-100"
                            style={{ background: color }}
                          />
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <span className="bg-light-300 dark:bg-primary-400">
                    {tag.name}
                  </span>

                  <span
                    onClick={() => {
                      setForm((p) => {
                        return {
                          ...p,
                          tags: p.tags?.filter((t) => t.id !== tag.id),
                        };
                      });
                    }}
                    className="p-1 rounded cursor-pointer hover:bg-light-400/20"
                  >
                    <IconX className="w-3 h-3" />
                  </span>
                </div>
              ))}
              {addTag && (
                <div className="flex items-center gap-2 px-3 py-2 transition rounded ring-2 ring-secondary-100 dark:ring-secondary-200 group bg-light-300 dark:bg-primary-400 dark:text-white text-primary-400">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="z-[1000000]">
                      <span
                        className="w-4 h-4 mr-2 rounded cursor-pointer hover:ring-2 ring-primary-400 dark:ring-primary-100"
                        style={{ background: tagColor }}
                      ></span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="top" className="z-[1000000]">
                      <div className="flex flex-wrap gap-2 p-2">
                        {colors?.map((color, _i) => (
                          <div
                            key={_i}
                            onClick={() => {
                              setTagColor(color);
                            }}
                            className="w-4 h-4 rounded cursor-pointer hover:ring-2 ring-primary-600 dark:ring-primary-100"
                            style={{ background: color }}
                          />
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <input
                    type="text"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setForm({
                          ...form,
                          tags: [
                            ...form.tags,
                            {
                              id: nanoid(),
                              name: tagInput,
                              color: tagColor,
                            },
                          ],
                        });
                        setTagInput("");
                        setTagColor("#FE409C");
                        setAddTag(false);
                      }
                    }}
                    onChange={(e) => {
                      setTagInput(e.target.value);
                    }}
                    value={tagInput}
                    className="w-16 outline-none bg-light-300 dark:bg-primary-400"
                    placeholder="tag"
                  />
                  <span
                    onClick={() => {
                      setForm({
                        ...form,
                        tags: [
                          ...form.tags,
                          {
                            id: nanoid(),
                            name: tagInput,
                            color: tagColor,
                          },
                        ],
                      });
                      setTagInput("");
                      setTagColor("#FE409C");
                      setAddTag(false);
                    }}
                    className="p-1 rounded cursor-pointer hover:bg-light-400/20"
                  >
                    <IconCheck className="w-3 h-3" />
                  </span>
                  <span
                    onClick={() => {
                      setAddTag(false);
                    }}
                    className="p-1 rounded cursor-pointer hover:bg-light-400/20"
                  >
                    <IconX className="w-3 h-3" />
                  </span>
                </div>
              )}
              <div
                onClick={() => {
                  setAddTag(true);
                }}
                className="flex items-center gap-2 px-4 py-2 transition rounded cursor-pointer hover:bg-light-400 dark:bg-primary-400 dark:text-white dark:hover:bg-primary-800 bg-light-300 text-primary-400"
              >
                <span>
                  <IconPlus className="w-3 h-3" />
                </span>
                <span>add tag</span>
              </div>
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
