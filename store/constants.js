// secrets are kept with each client
// we get the redirect_url from clerk (can be set with clerk backend API)
export const RESET_PASSWORD_MODE = "updatePassword";
export const CLERK_COOKIE = "__clerk_db_jwt";

export const clients =
  process.env.NEXT_PUBLIC_STAGING === "yes"
    ? [
        {
          name: "My dev clientid",
          client_id: "abcdef",
          default: true,
        },
      ]
    : [
        {
          name: "My production clientid",
          client_id: "ghijkl",
          default: true,
        },
      ];
