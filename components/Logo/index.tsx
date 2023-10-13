import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href={`/`} className="flex items-center gap-4">
      <Image
        src="/favicon/favicon-dark/android-chrome-512x512.png"
        alt="logo"
        width={25}
        height={25}
      />
      <div className="font-mono text-lg font-bold tracking-widest select-none text-primary-100">
        RTM
      </div>
    </Link>
  );
};

export default Logo;
