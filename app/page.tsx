"use client";
import Navbar from "@/components/Navbar";
import { useStore } from "@/lib/store";
import {
  IconBackspace,
  IconClick,
  IconEdit,
  IconLayoutGridAdd,
  IconScriptPlus,
  IconStack2,
  IconStack3,
  IconTrash,
} from "@tabler/icons-react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useEffect, useMemo, useState } from "react";
import { colors } from "@/lib/constants/colors";
import { cn } from "@/lib/utils";
import { nanoid } from "nanoid";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import ProjectModal, { ProjectForm } from "@/components/Modal/ProjectModal";
import DeleteModal from "@/components/Modal/DeleteModal";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { projects, addProject, editProject, deleteProject } = useStore();
  const [form, setForm] = useState<ProjectForm>({
    name: "",
    description: "",
    color: colors[0],
  });
  const [openCreateProjectModal, setOpenCreateProjectModal] = useState(false);
  const [openEditProjectModal, setOpenEditProjectModal] = useState(false);
  const [openDeleteProjectModal, setOpenDeleteProjectModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [hovering, setHovering] = useState("");
  const [contextMenu, setContextMenu] = useState({
    id: "",
    menu: "",
  });

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

  const edit = () => {
    if (form.name.length === 0 || form.color.length === 0) {
      return;
    }
    editProject(contextMenu.id, {
      name: form.name,
      description: form.description,
      color: form.color,
    });
    setContextMenu({
      id: "",
      menu: "",
    });
    setForm({
      name: "",
      description: "",
      color: colors[0],
    });
    setOpenEditProjectModal(false);
  };

  const del = (id?: string) => {
    if (id) {
      deleteProject(id);
    }
    setOpenDeleteProjectModal(false);
  };

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) =>
        project.name.toLowerCase().includes(searchValue.toLowerCase())
      ),
    [projects, searchValue]
  );

  useEffect(() => {
    if (!contextMenu.id) return;
    switch (contextMenu.menu) {
      case "open": {
        router.push(`/${contextMenu.id}`);
        break;
      }
      case "new tab": {
        window.open(`/${contextMenu.id}`, "_blank");
        break;
      }
      case "edit": {
        const project = projects.find(
          (project) => project.id === contextMenu.id
        );
        setForm({
          name: project?.name ?? "",
          description: project?.description ?? "",
          color: project?.color ?? "",
        });
        setOpenEditProjectModal(true);
        break;
      }
      case "delete": {
        const project = projects.find(
          (project) => project.id === contextMenu.id
        );
        setForm({
          id: project?.id,
          name: project?.name ?? "",
          description: project?.description ?? "",
          color: project?.color ?? "",
        });
        setOpenDeleteProjectModal(true);
        // deleteProject(contextMenu.id);
        break;
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextMenu]);

  return (
    <>
      <ProjectModal
        {...{
          open: openCreateProjectModal,
          setOpen: setOpenCreateProjectModal,
          onClose: () => {},
          form,
          setForm,
          title: "Create Project",
          button: "create",
          buttonOnClick: create,
        }}
      />
      <ProjectModal
        {...{
          open: openEditProjectModal,
          setOpen: setOpenEditProjectModal,
          onClose: () => {},
          form,
          setForm,
          title: "Edit Project",
          button: "edit",
          buttonOnClick: edit,
        }}
      />
      <DeleteModal
        {...{
          open: openDeleteProjectModal,
          setOpen: setOpenDeleteProjectModal,
          onClose: () => {},
          form,
          setForm,
          title: "Delete Project",
          button: "delete",
          buttonOnClick: del,
        }}
      />
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
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {filteredProjects.map((project, i) => (
                    <ContextMenu
                      key={i}
                      onOpenChange={(o) => {
                        // setContextMenuOpen(project.id);
                      }}
                    >
                      <ContextMenuTrigger asChild>
                        <Link
                          href={`/${project.id}`}
                          // key={i}
                          style={
                            { "--color": project.color } as React.CSSProperties
                          }
                          className={cn([
                            "counter-border",
                            "p-4 font-mono flex flex-col justify-between rounded-md cursor-pointer text-primary-100 bg-primary-600",
                            ``,
                          ])}
                          onMouseEnter={() => setHovering(project.id)}
                          onMouseLeave={() => setHovering("")}
                        >
                          <motion.i
                            initial="hidden"
                            animate={
                              hovering === project.id ? "active" : "hidden"
                            }
                            variants={{
                              hidden: { opacity: 0 },
                              active: { opacity: 1 },
                            }}
                            aria-hidden="true"
                          ></motion.i>
                          {/* <Image
                        src="https://plus.unsplash.com/premium_photo-1694825173178-3d2c9bbf5b5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHx8&auto=format&fit=crop&w=800&q=60"
                        width={100}
                        height={100}
                      /> */}
                          <div className="flex items-center gap-2 mb-3">
                            <IconStack2
                              className="min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px]"
                              style={{ color: project.color }}
                            />
                            <p
                              className="text-sm font-bold tracking-widest truncate"
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
                      </ContextMenuTrigger>
                      <ContextMenuContent className="font-mono text-white border-2 bg-primary-600 border-primary-400">
                        <ContextMenuItem
                          onClick={() => {
                            setContextMenu({
                              id: project.id,
                              menu: "open",
                            });
                          }}
                          className="flex items-center gap-2 cursor-pointer focus:bg-secondary-200"
                        >
                          <div className="">
                            <IconClick className="w-4 h-4" />
                          </div>
                          <div className="text-[12px] font-bold tracking-widest">
                            Open
                          </div>
                        </ContextMenuItem>
                        <ContextMenuItem
                          onClick={() => {
                            setContextMenu({
                              id: project.id,
                              menu: "new tab",
                            });
                          }}
                          className="flex items-center gap-2 cursor-pointer focus:bg-secondary-200"
                        >
                          <div className="">
                            <IconLayoutGridAdd className="w-4 h-4" />
                          </div>
                          <div className="text-[12px] font-bold tracking-widest">
                            Open In New Tab
                          </div>
                        </ContextMenuItem>
                        <ContextMenuSeparator className="h-1 bg-primary-400" />
                        <ContextMenuItem
                          onClick={() => {
                            setContextMenu({
                              id: project.id,
                              menu: "edit",
                            });
                          }}
                          className="flex items-center gap-2 cursor-pointer focus:bg-secondary-200"
                        >
                          <div className="">
                            <IconEdit className="w-4 h-4" />
                          </div>
                          <div className="text-[12px] font-bold tracking-widest">
                            Edit
                          </div>
                        </ContextMenuItem>
                        <ContextMenuItem
                          onClick={() => {
                            setContextMenu({
                              id: project.id,
                              menu: "delete",
                            });
                          }}
                          className="flex items-center gap-2 cursor-pointer focus:bg-secondary-200"
                        >
                          <div className="">
                            <IconTrash className="w-4 h-4" />
                          </div>
                          <div className="text-[12px] font-bold tracking-widest">
                            Delete
                          </div>
                          <ContextMenuShortcut></ContextMenuShortcut>
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
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
