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
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { colors } from "@/lib/constants/colors";
import { nanoid } from "nanoid";
import { Check } from "lucide-react";

type Props = {
  list: any[];
  currentList: any[];
  setCurrentList: React.Dispatch<React.SetStateAction<any[]>>;
  multi?: boolean;
};

const ChartDropdown = ({
  list,
  currentList,
  setCurrentList,
  multi = false,
}: Props) => {
  const { setDisableKeyboardShortcut, addProject } = useStore();
  const [openDropdown, setOpenDropdown] = useState(false);
  const pathname = usePathname();
  // const { projects } = useStore();

  const [searchValue, setSearchValue] = useState("");

  // const currentProject = useMemo(
  //   () => projects.find((project) => project.id === pathname.replace("/", "")),
  //   [pathname, projects]
  // );

  const filtered = useMemo(
    () =>
      list.filter((l: any) =>
        l.toLowerCase().includes(searchValue.toLowerCase())
      ),
    [list, searchValue]
  );

  return (
    <>
      <DropdownMenu
        open={openDropdown}
        onOpenChange={(o) => {
          setOpenDropdown(o);
        }}
      >
        <DropdownMenuTrigger asChild>
          <div
            // style={{ color: currentProject?.color }}
            className={cn([
              "font-mono flex items-center justify-between text-xs gap-4 px-5 py-2 bg-light-300 dark:bg-primary-600 hover:bg-opacity-90 dark:ring-primary-400 border border-light-400 dark:border-primary-400 rounded-md cursor-pointer select-none",
            ])}
          >
            <div className="flex items-center gap-2 w-full">
              <span className="w-full overflow-x-auto flex gap-1 whitespace-nowrap no_scrollbar">
                {currentList?.map((l, i) =>
                  i == currentList?.length - 1 ? l : l + ", "
                )}
                {currentList?.length === 0 && "-"}
              </span>
            </div>
            <div className="">
              {/* <IconChevronDown className="w-3 h-3 text-primary-200" /> */}
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          sideOffset={8}
          className="space-y-1 max-h-[240px] relative z-[1001] w-full overflow-y-auto thin_scrollbar font-mono dark:bg-primary-600 bg-light-200 border-light-400 dark:border-primary-400"
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
                className="w-full py-2 text-xs font-light text-black dark:text-white rounded-md outline-none bg-light-300 dark:bg-primary-800"
                placeholder="Search"
              />
              <button className="p-1 mr-1 rounded-md text-[10px] font-light bg-light-300 dark:bg-primary-800 text-primary-200">
                {filtered?.length}
              </button>
            </div>
          </DropdownMenuLabel>
          {filtered.length === 0 && (
            <div className="text-[10px] px-1 py-1 line-clamp-2 text-black dark:text-white">
              No {searchValue} found.
            </div>
          )}
          {filtered?.map((l, i) => (
            <DropdownMenuItem
              key={i}
              // style={{ color: project?.color }}
              className={cn([
                "flex items-center gap-2 px-3 cursor-pointer focus:bg-light-400 dark:focus:bg-primary-800",
                currentList?.includes(l) && "bg-light-300 dark:bg-primary-800",
              ])}
              onSelect={(e) => {
                e.preventDefault();
                if (multi) {
                  if (currentList.includes(l)) {
                    setCurrentList((p) => p.filter((e) => e !== l));
                  } else {
                    setCurrentList((p) => [...p, l]);
                  }
                } else {
                  setCurrentList([l]);
                }
              }}
            >
              {currentList?.includes(l) ? (
                <Check
                  className="min-w-[16px] min-h-[16px] max-w-[16px] cursor-pointer max-h-[16px]"
                  // style={{ color: project?.color }}
                />
              ) : (
                <div className="min-w-[16px] min-h-[16px] max-w-[16px] max-h-[16px]" />
              )}
              <span className="truncate">{l}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ChartDropdown;
