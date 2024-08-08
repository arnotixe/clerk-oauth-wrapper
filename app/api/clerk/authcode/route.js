// This only works in SANDBOX environment
import { CLERK_COOKIE } from "@/store/constants";

// The below does NOT WORK IN PRODUCTION. And there's an easier way: Just resend the browser to the actual authorize endpoint
// https://clerk.example.com/oauth/authorize?response_type=code&client_id=abcdefg&state=etc

export async function POST(req) {
  const body = await req.json();

  const { jwtcookie, clientid } = body;

  if (!jwtcookie) {
    return Response.json({ error: "got no jwtcookie" });
  }
  if (!clientid) {
    return Response.json({ error: "got no clientid" });
  }

  const authcodeurl = new URL(
    `https://${process.env.SSO_DOMAIN}/oauth/authorize`,
  );
  authcodeurl.searchParams.append("client_id", clientid);
  authcodeurl.searchParams.append(CLERK_COOKIE, jwtcookie);
  authcodeurl.searchParams.append("response_type", "code");

  const { code, location } = await fetch(authcodeurl.href, {
    redirect: "manual",
  })
    .then((r) => {
      const location = r.headers.get("location") || ""; // Not interested in the body, but the location header, which holds the code
      const code = location.includes("code=")
        ? location.replace(/.*code=/, "")
        : null;
      return { location, code, status: r.status };
    })
    .catch((r) => console.log("api authcode gen ERR", r));
  if (!code) {
    return Response.json({ error: "got no auth code" });
  }

  return Response.json({ code, location });
}
