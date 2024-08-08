"use client";
import { useClerk, useAuth, useUser } from "@clerk/nextjs";
import AuthBox from "@/components/auth/AuthBox";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Logout() {
  const { signOut } = useClerk();
  const { isSignedIn, isLoaded, userId } = useAuth();
  const { user } = useUser();

  const router = useRouter();

  useEffect(() => {
    if (isSignedIn && user) {
      signOut();
    }
    if (isLoaded && !isSignedIn) {
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
  }, [isSignedIn, isLoaded, router, signOut, user, userId]);

  return (
    <AuthBox>
      {isSignedIn ? "Logging out…" : "Logged out. Redirecting to login…"}
    </AuthBox>
  );
}
