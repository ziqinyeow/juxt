import Navigation from "@/components/Navigation";
import { REPO_LINK } from "@/lib/constants";
import { Github } from "@/components/Social";
import { useConfig, useTheme } from "nextra-theme-docs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import HeaderLogo from "./components/HeaderLogo";
import { Footer } from "./components/Footer";

const SITE_ROOT = "";

const config = {
  logo: <HeaderLogo />,
  footer: {
    component: Footer,
  },
  logoLink: false,
  i18n: [],
  docsRepositoryBase: `${REPO_LINK}/tree/main/apps/docs/`,
  toc: {
    float: true,
    backToTop: true,
    // extraContent: ExtraContent,
  },
  navbar: {
    component: Navigation,
    extraContent: (
      <>
        <Github />
      </>
    ),
  },
  useNextSeoProps: function SEO() {
    const router = useRouter();
    const { frontMatter } = useConfig();

    let section = "RTM";
    if (router?.pathname.startsWith("/app")) {
      section = "RTM App";
    }
    if (router?.pathname.startsWith("/sdk")) {
      section = "RTM Sdk";
    }

    const defaultTitle = frontMatter.overrideTitle || section;

    return {
      description: frontMatter.description,
      defaultTitle,
      titleTemplate: `${section} - %s`,
    };
  },
  gitTimestamp({ timestamp }: { timestamp: Date }) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [dateString, setDateString] = useState(timestamp.toISOString());

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      try {
        setDateString(
          timestamp.toLocaleDateString(navigator.language, {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        );
      } catch (e) {
        // Ignore errors here; they get the ISO string.
        // At least one person out there has manually misconfigured navigator.language.
      }
    }, [timestamp]);

    return <>Last updated on {dateString}</>;
  },
  head: function Head() {
    const router = useRouter();
    const { systemTheme = "dark" } = useTheme();
    const { frontMatter } = useConfig();
    const fullUrl =
      router.asPath === "/" ? SITE_ROOT : `${SITE_ROOT}${router.asPath}`;

    const asPath = router.asPath;

    let ogUrl;

    if (asPath === "/") {
      ogUrl = `${SITE_ROOT}/api/og`;
    } else if (frontMatter?.ogImage) {
      ogUrl = `${SITE_ROOT}${frontMatter.ogImage}`;
    } else {
      const type = asPath.startsWith("/web")
        ? "web"
        : asPath.startsWith("/rtm")
        ? "rtm"
        : "";
      const title = frontMatter.title
        ? `&title=${encodeURIComponent(frontMatter.title)}`
        : "";

      ogUrl = `${SITE_ROOT}/api/og?type=${type}${title}`;
    }

    return (
      <>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={`/images/favicon-${systemTheme}/apple-touch-icon.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`/images/favicon-${systemTheme}/favicon-32x32.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`/images/favicon-${systemTheme}/favicon-16x16.png`}
        />
        <link
          rel="mask-icon"
          href={`/images/favicon-${systemTheme}/safari-pinned-tab.svg`}
          color="#000000"
        />
        <link
          rel="shortcut icon"
          href={`/images/favicon-${systemTheme}/favicon.ico`}
        />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@videoeditor" />
        <meta name="twitter:creator" content="@videoeditor" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={fullUrl} />
        <link rel="canonical" href={fullUrl} />
        <meta property="twitter:image" content={ogUrl} />
        <meta property="og:image" content={ogUrl} />
        <meta property="og:locale" content="en_IE" />
        <meta property="og:site_name" content="Turbo" />
        <link rel="prefetch" href="/web" as="document" />
        <link rel="prefetch" href="/web/docs" as="document" />
        <link rel="prefetch" href="/rtm" as="document" />
        <link rel="prefetch" href="/rtm/docs" as="document" />
        {/* <link
          rel="alternate"
          type="application/rss+xml"
          title="Turbo Blog"
          href="https://turbo.build/feed.xml"
        /> */}
      </>
    );
  },
};

export default config;
