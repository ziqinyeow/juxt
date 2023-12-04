import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { IconPlus, IconSearch, IconStack2 } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import ProjectModal, { ProjectForm } from "../Modal/ProjectModal";
import { colors } from "@/lib/constants/colors";
import { nanoid } from "nanoid";

const ProjectDropdown = () => {
  const router = useRouter();
  const { setDisableKeyboardShortcut, addProject } = useStore();
  const [form, setForm] = useState<ProjectForm>({
    name: "",
    description: "",
    color: colors[0],
    tags: [],
  });
  const [openCreateProjectModal, setOpenCreateProjectModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const pathname = usePathname();
  const { projects } = useStore();

  const [searchValue, setSearchValue] = useState("");

  const currentProject = useMemo(
    () => projects.find((project) => project.id === pathname.replace("/", "")),
    [pathname, projects]
  );

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) =>
        project.name.toLowerCase().includes(searchValue.toLowerCase())
      ),
    [projects, searchValue]
  );

  const create = () => {
    if (form.name.length === 0 || form.color.length === 0) {
      return;
    }
    const id = nanoid();
    addProject({
      id,
      name: form.name,
      description: form.description,
      color: form.color,
      created: Date.now(),
      tracks: [],
      bucket: { "/": [] },
      tags: form.tags,
    });
    setForm({
      name: "",
      description: "",
      color: colors[0],
      tags: [],
    });
    setOpenCreateProjectModal(false);
    router.push(`/${id}`);
    // window.open(`/${id}`, "_self");
  };

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
      <DropdownMenu
        open={openDropdown}
        onOpenChange={(o) => {
          setOpenDropdown(o);
        }}
      >
        <DropdownMenuTrigger asChild>
          <div
            style={{ color: currentProject?.color }}
            className={cn([
              "font-mono flex items-center justify-between font-bold text-sm gap-4 px-5 py-2 bg-light-300 dark:bg-primary-600 hover:bg-opacity-90 hover:ring-2 ring-primary-200 dark:ring-primary-400 border border-light-400 dark:border-primary-400 rounded-md cursor-pointer select-none",
            ])}
          >
            <div className="flex items-center gap-2">
              <div className="hidden text-xs font-light text-black sm:block dark:text-primary-200">
                Current Project:
              </div>
              <IconStack2
                className="min-w-[16px] min-h-[16px] max-w-[16px] max-h-[16px]"
                style={{ color: currentProject?.color }}
              />
              <span className="w-20 truncate">{currentProject?.name}</span>
            </div>
            <div className="">
              {/* <IconChevronDown className="w-3 h-3 text-primary-200" /> */}
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          sideOffset={8}
          className="sm:w-72 w-40 space-y-1 max-h-[160px] relative z-[900] overflow-y-auto thin_scrollbar font-mono dark:bg-primary-600 bg-light-200 border-light-400 dark:border-primary-400"
        >
          <DropdownMenuLabel
            asChild
            className="p-0 bg-light-300 dark:bg-primary-600"
          >
            <div className="sticky top-0 z-10 flex items-center w-full gap-2 mb-2 rounded-md dark:bg-primary-800">
              <IconSearch className="w-5 h-5 ml-3 mr-1 text-black dark:text-primary-200" />
              <input
                onFocus={() => {
                  setDisableKeyboardShortcut(true);
                }}
                onBlur={() => {
                  setDisableKeyboardShortcut(false);
                }}
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
                type="text"
                className="w-full py-2 text-[10px] font-light text-black dark:text-white rounded-md outline-none bg-light-300 dark:bg-primary-800"
                placeholder="Search"
              />
              <button className="p-1 mr-1 rounded-md text-[10px] font-light bg-light-300 dark:bg-primary-800 text-primary-200">
                {filteredProjects?.length}
              </button>
              <button
                onClick={() => {
                  setOpenDropdown(false);
                  setOpenCreateProjectModal(true);
                }}
                className="p-1 mr-1 text-black rounded-md bg-light-300 dark:bg-primary-800 dark:text-primary-200 hover:bg-light-400 dark:hover:bg-primary-500 dark:hover:text-white"
              >
                <IconPlus className="w-3 h-3" />
              </button>
            </div>
          </DropdownMenuLabel>
          {filteredProjects.length === 0 && (
            <div className="text-[10px] px-1 py-1 line-clamp-2 text-black dark:text-white">
              No project named {searchValue} found.
            </div>
          )}
          {filteredProjects?.map((project, i) => (
            <DropdownMenuItem
              key={i}
              style={{ color: project?.color }}
              className={cn([
                "flex items-center gap-2 px-3 cursor-pointer focus:bg-light-400 dark:focus:bg-primary-800",
                currentProject?.id === project.id &&
                  "bg-light-400 dark:bg-primary-800",
              ])}
              onClick={() => {
                router.push(`/${project.id}`);
                // window.open(`/${project.id}`, "_self");
              }}
            >
              <IconStack2
                className="min-w-[16px] min-h-[16px] max-w-[16px] cursor-pointer max-h-[16px]"
                style={{ color: project?.color }}
              />
              <span className="truncate">{project?.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ProjectDropdown;
