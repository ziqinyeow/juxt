import { ThemeProvider } from "@/components/theme";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import clsx from "clsx";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dropzone from "@/components/Dropzone";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RTM",
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
        className={clsx([inter.className, "text-xs bg-black"])}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <Dropzone>{children}</Dropzone>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
