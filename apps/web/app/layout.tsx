import { ThemeProvider } from "@/components/theme";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import clsx from "clsx";
import { TooltipProvider } from "@/ui/tooltip";
import Dropzone from "@/components/Dropzone";
import Loader from "@/layout/loader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JUXT",
  description: "Video Annotation Tools",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        suppressHydrationWarning={true}
        className={clsx([inter.className, "text-xs bg-white dark:bg-black"])}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <TooltipProvider>
            <Loader>
              {/* <Dropzone></Dropzone> */}
              {children}
            </Loader>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
