import SiteSwitcher from "./SiteSwitcher";
import Link from "next/link";
import LogoAnimated from "./LogoAnimated";
import { useEffect, useState } from "react";
import classNames from "classnames";
// import { LogoContext } from "./LogoContext";

function HeaderLogo() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* <svg
        xmlns="http://www.w3.org/2000/svg"
        className="dark:stroke-white stroke-black"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M2 15h10v5h5v-5h5v-5h-10v-5h-5v5h-5z"></path>
        <path d="M7 15v-5h5v5h5v-5"></path>
      </svg> */}
      {mounted && (
        <>
          {/* <svg
            data-testid="geist-icon"
            fill="none"
            height={24}
            shapeRendering="geometricPrecision"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            className="dark:text-[#333] text-[#eaeaea] ml-2 mr-1"
          >
            <path d="M16.88 3.549L7.12 20.451" />
          </svg> */}

          <Link href="/" title="Home" className="hover:opacity-75">
            <LogoAnimated height={32} />
          </Link>
          <div className="absolute left-[50%] translate-x-[-50%] md:ml-3 md:relative md:left-0 md:transform-none transform">
            <SiteSwitcher />
          </div>
        </>
      )}
    </>
  );
}

export default HeaderLogo;
