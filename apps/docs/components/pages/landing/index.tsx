import React from "react";
import Head from "next/head";
import cn from "classnames";
import Link from "next/link";
import { motion } from "framer-motion";
import { App } from "./App";
import { Sdk } from "./Sdk";
import { FadeIn } from "@/components/animations/FadeIn";
import styles from "./index.module.css";
import { AnimatedBackground } from "./AnimatedBackground";

function Background() {
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div
        className={cn(
          "z-[-1] absolute w-full h-full [--gradient-stop-1:60%] [--gradient-stop-2:85%] lg:[--gradient-stop-1:50%] lg:[--gradient-stop-2:90%]",
          "[--gradient-color-1=rgba(0,0,0,1)] [--gradient-color-2=rgba(0,0,0,0.8)] [--gradient-color-3=rgba(0,0,0,0)]",
          "dark:[--gradient-color-1=rgba(255,255,255,1)] dark:[--gradient-color-2=rgba(255,255,255,0.8)] dark:[--gradient-color-3=rgba(255,255,255,0)]"
        )}
        style={{
          background:
            "linear-gradient(180deg, var(--gradient-color-1) 0%, var(--gradient-color-2) var(--gradient-stop-1), var(--gradient-color-3) var(--gradient-stop-2), 100% transparent)",
        }}
      />
      <span className={cn(styles.leftLights, "opacity-50 dark:opacity-100")} />
      <span className={cn(styles.rightLights, "opacity-50 dark:opacity-100")} />
      <span className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t dark:from-black from-white to-transparent" />
      <span className="bg-gradient-to-b dark:from-black from-white to-transparent absolute top-[20vh] left-0 w-full h-[50vh]" />
      <AnimatedBackground />
    </div>
  );
}

export function CardBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono font-bold text-xs text-black/50 dark:text-white/50  px-[6px] py-[3.25px] tracking-[-0.01em] rounded-[6px] uppercase flex justify-center items-center bg-black/5 dark:bg-white/[0.15] border border-black/[0.1] dark:border-white/[0.1]">
      {children}
    </div>
  );
}

const variants = {
  hidden: { opacity: 0 },
  active: { opacity: 1 },
};

function Card({
  alt,
  href,
  title,
  icon: Icon,
  className,
  children,
}: {
  href: string;
  icon: React.ElementType;
  title: "app" | "sdk";
  alt?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [hovering, setHovering] = React.useState(false);
  return (
    <Link
      href={href}
      className={cn(
        styles["counter-border"],
        "w-[calc(100%_-_0px)] h-[304]px sm:!w-[488px] sm:h-[352px]"
      )}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <motion.i
        initial="hidden"
        animate={hovering ? "active" : "hidden"}
        variants={variants}
        aria-hidden="true"
      ></motion.i>
      <div
        className={cn(
          "relative w-full h-full max-w-full !pb-12 pt-8 md:!pb-4 md:!pt-4 p-3 rounded-xl overflow-hidden flex flex-col items-center justify-center border border-[rgba(255,255,255,0.05)]",
          className
        )}
      >
        <div className="flex items-center justify-center flex-1 mb-7 md:mb-0">
          <Icon />
        </div>

        <div className="flex flex-col items-center flex-1">
          {title == "sdk" ? (
            <>
              <div className="font-extrabold text-2xl lg:text-3xl leading-tight xl:leading-snug text-center pb-4 bg-clip-text text-transparent bg-gradient-to-b from-black/80 to-black dark:from-white dark:to-[#AAAAAA]">
                Juxtapose - SDK
              </div>
              {/* <SDKLogo
                alt={alt}
                className="w-[160px] md:w-[220px] mb-3 fill-black dark:fill-white"
              /> */}
            </>
          ) : (
            <>
              <div className="font-extrabold text-2xl lg:text-3xl leading-tight xl:leading-snug text-center pb-4 bg-clip-text text-transparent bg-gradient-to-b from-black/80 to-black dark:from-white dark:to-[#AAAAAA]">
                Juxt - App
              </div>
              {/* <AppLogo
                alt={alt}
                className="w-[160px] md:w-[220px] mb-3 fill-black dark:fill-white"
              /> */}
            </>
          )}
          {children}
        </div>
      </div>
    </Link>
  );
}

function SiteCards() {
  return (
    <div className="flex w-full container items-center justify-center gap-6 px-6 sm:mx-0 mt-8 md:!mt-14 lg:!mt-15 md:mb-0 flex-col lg:!flex-row z-10 lg:!translate-y-0">
      <FadeIn delay={0.1}>
        <Card title="app" alt="app" icon={App} href="/app" className="cardBg">
          <div className="absolute top-3 left-3">
            <CardBadge>ALPHA</CardBadge>
          </div>
          <p className="text-lg !w-[280px] md:!w-[340px] font-space-grotesk text-center opacity-50 dark:opacity-70">
            AI-native platform for 2D human pose analysis optimized for sports
            athletes
          </p>
        </Card>
      </FadeIn>
      <FadeIn delay={0.2}>
        <Card title="sdk" alt="sdk" icon={Sdk} href="/sdk" className="cardBg">
          <div className="absolute top-3 left-3">
            <CardBadge>beta</CardBadge>
          </div>
          <p className="text-lg !w-[280px] md:!w-[340px] font-space-grotesk text-center opacity-50 dark:opacity-70 ">
            Python-powered successor to pose detection, tracking, estimation.
          </p>
        </Card>
      </FadeIn>
    </div>
  );
}

function LandingPage() {
  return (
    <>
      <Head>
        <style>
          {`
            .dark footer,
            .dark body {
                background-color: black !important;
            }

            .dark .nextra-nav-container .nextra-nav-container-blur  {
                background-color: rgba(0,0,0,.5) !important;
            }
        `}
        </style>
      </Head>
      <main className="relative h-[800px] flex flex-col items-center justify-center w-full overflow-hidden [--geist-foreground:#fff] dark:[--geist-foreground:#000] [--gradient-stop-1:0px] [--gradient-stop-2:120px] sm:[--gradient-stop-1:0px] sm:[--gradient-stop-2:120px]">
        <Background />
        <FadeIn className="z-10 flex flex-col items-center justify-center w-full h-full">
          <h1 className="mt-12 lg:!mt-20 mx-6 w-[300px] md:!w-full font-extrabold text-5xl lg:text-6xl leading-tight xl:leading-snug text-center pb-4 bg-clip-text text-transparent bg-gradient-to-b from-black/80 to-black dark:from-white dark:to-[#AAAAAA]">
            Analyze With Ease
          </h1>
          <p className="mx-6 text-xl max-h-[112px] md:max-h-[96px] w-[315px] md:w-[660px] md:text-2xl font-space-grotesk text-center text-[#666666] dark:text-[#888888]">
            Juxt is a sport platform optimized for real time multi pose
            estimation, written in Typescript & Python
          </p>
        </FadeIn>
        <SiteCards />
        <div className="h-[25vh]"></div>
      </main>
    </>
  );
}

export default LandingPage;
