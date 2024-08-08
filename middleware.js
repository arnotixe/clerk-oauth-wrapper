// import { clerkMiddleware } from "@clerk/nextjs/server"; // 5.x
// export default clerkMiddleware();

import { authMiddleware } from "@clerk/nextjs";
export default authMiddleware({
  publicRoutes: [
    "/", // actually redirects to sign-in
    "/logout",
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
