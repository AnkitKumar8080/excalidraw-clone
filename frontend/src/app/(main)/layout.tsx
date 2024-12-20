import { ThemeProvider } from "next-themes";
import React, { ReactNode } from "react";
import StoreProvider from "../StoreProvider";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <StoreProvider>{children}</StoreProvider>
    </ThemeProvider>
  );
};

export default MainLayout;
