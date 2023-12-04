import Navbar from "@/components/Navbar";
import { IconInputX, IconScriptPlus } from "@tabler/icons-react";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="w-screen h-screen bg-white dark:bg-primary-800">
      <Navbar />
      <div className="flex gap-10 flex-col h-[calc(100vh_-_104px)] items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-4 text-4xl font-bold tracking-widest text-secondary-100 dark:text-secondary-200">
          <span>
            <IconInputX className="w-16 h-16 text-secondary-100 dark:text-secondary-200" />
          </span>
          <span>404 Not Found</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={"/"}
            className="flex items-center gap-3 px-4 py-3 font-bold tracking-widest text-black dark:text-white rounded-md whitespace-nowrap bg-light-300 dark:bg-primary-600 hover:bg-light-400 dark:hover:bg-primary-400"
          >
            <span>
              <IconScriptPlus className="w-5 h-5" />
            </span>
            <span>Go To Home Page</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
