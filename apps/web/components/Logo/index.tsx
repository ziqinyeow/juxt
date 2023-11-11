import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  const { theme } = useTheme();

  return (
    <Link href={`/`} className="flex items-center gap-4">
      <Image
        src={
          theme === "dark"
            ? "/favicon/favicon-dark/android-chrome-512x512.png"
            : "/favicon/favicon-light/android-chrome-512x512.png"
        }
        alt="logo"
        width={25}
        height={25}
      />
      <div className="font-mono text-lg font-bold tracking-widest text-black select-none dark:text-primary-100">
        JUXT
      </div>
      <div className="px-2 py-1 font-mono tracking-widest rounded bg-light-300 dark:bg-primary-400">
        alpha
      </div>
    </Link>
  );
};

export default Logo;
