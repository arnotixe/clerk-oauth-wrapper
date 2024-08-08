import "/styles/global.css";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "My App",
  description: "Sign In - My App",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
