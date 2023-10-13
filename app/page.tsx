"use client";
import Navbar from "@/components/Navbar";
import { useStore } from "@/lib/store";
import { IconScriptPlus, IconStack2, IconStack3 } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMemo, useState } from "react";
import { colors } from "@/lib/constants/colors";
import { cn } from "@/lib/utils";
import { nanoid } from "nanoid";
import Link from "next/link";

const Card = ({ title }: { title: string }) => (
  <div className="p-5 rounded-md bg-primary-600">
    <p className="text-sm font-bold tracking-wider text-primary-100">{title}</p>
  </div>
);

export default function Home() {
  const { projects, addProject } = useStore();
  const [form, setForm] = useState({
    name: "",
    description: "",
    color: colors[0],
  });
  const [openCreateProjectModal, setOpenCreateProjectModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const create = () => {
    if (form.name.length === 0 || form.color.length === 0) {
      return;
    }
    addProject({
      id: nanoid(),
      name: form.name,
      description: form.description,
      color: form.color,
      created: Date.now(),
      tracks: [],
    });
    setForm({
      name: "",
      description: "",
      color: colors[0],
    });
    setOpenCreateProjectModal(false);
  };

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) =>
        project.name.toLowerCase().includes(searchValue.toLowerCase())
      ),
    [projects, searchValue]
  );

  return (
    <>
      <Dialog
        open={openCreateProjectModal}
        onOpenChange={(open) => {
          if (!open) {
            setForm({
              name: "",
              description: "",
              color: colors[0],
            });
          }
          setOpenCreateProjectModal(open);
        }}
      >
        <DialogContent className="font-mono text-white border-0 bg-primary-600">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-secondary-200">
              <span>
                <IconScriptPlus className="w-5 h-5 text-secondary-200" />
              </span>
              <span>Create Project</span>
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
                  setForm((p) => {
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
                  setForm((p) => {
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
                      setForm((p) => {
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
              onClick={create}
              className="w-full p-3 rounded-md disabled:cursor-not-allowed bg-primary-800 hover:bg-primary-700"
            >
              create
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <div className="w-screen h-screen bg-primary-800">
        <Navbar />
        <div className="p-5">
          <div className=""></div>
          <div className="w-full h-full">
            {projects.length === 0 ? (
              <>
                <div
                  onClick={() => {
                    setOpenCreateProjectModal(true);
                  }}
                  className="w-full h-[calc(100vh_-_104px)] p-5 border bg-primary-700 transition duration-200 cursor-pointer hover:bg-primary-800 text-primary-100 border-primary-400 flex items-center justify-center rounded-md"
                >
                  <div className="flex flex-col items-center justify-center gap-3 select-none text-secondary-200">
                    <IconStack3 className="w-8 h-8" />
                    <div className="font-mono text-base font-bold tracking-widest">
                      Add project
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-8 font-mono text-primary-100">
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-md outline-none bg-primary-600"
                    placeholder="Search"
                    value={searchValue}
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setOpenCreateProjectModal(true);
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-md whitespace-nowrap bg-primary-600 hover:bg-primary-400"
                    >
                      <span>
                        <IconScriptPlus className="w-4 h-4" />
                      </span>
                      <span>Create Project</span>
                    </button>
                  </div>
                </div>
                {filteredProjects.length === 0 && (
                  <div className="font-mono tracking-widest text-white">
                    No project {searchValue} found.
                  </div>
                )}
                <div className="grid grid-cols-5 gap-4">
                  {filteredProjects.map((project, i) => (
                    <Link
                      href={`/${project.id}`}
                      key={i}
                      className={cn([
                        "p-4 font-mono border-2 flex flex-col justify-between rounded-md cursor-pointer border-primary-400 text-primary-100 hover:ring-2 bg-primary-600",
                        `ring-primary-400`,
                      ])}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <IconStack2
                          className="w-5 h-5"
                          style={{ color: project.color }}
                        />
                        <p
                          className="text-sm font-bold tracking-widest"
                          style={{ color: project.color }}
                        >
                          {project?.name}
                        </p>
                      </div>
                      <p className="text-primary-200 line-clamp-3">
                        {project?.description}
                      </p>
                      <p className="mt-3 text-primary-300">
                        created at{" "}
                        {new Date(project.created).toLocaleDateString()}
                      </p>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
