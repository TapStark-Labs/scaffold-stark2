import type { Metadata } from "next";
import { ScaffoldStarkAppWithProviders } from "~~/components/ScaffoldStarkAppWithProviders";
import "~~/styles/globals.css";
import { ThemeProvider } from "~~/components/ThemeProvider";
import { CartridgeProvider } from "./providers/CartridgeProvider";

export const metadata: Metadata = {
  title: "TapStark",
  description: "Fast track your starknet journey",
  icons: "/star.ico",
};

const ScaffoldStarkApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider enableSystem>
          <CartridgeProvider>
            <ScaffoldStarkAppWithProviders>
              {children}
            </ScaffoldStarkAppWithProviders>
          </CartridgeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldStarkApp;
