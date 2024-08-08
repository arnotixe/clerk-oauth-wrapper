import SigninForm from "./SignInForm";
import AuthBox from "@/components/auth/AuthBox";
import { CookiesProvider } from "next-client-cookies/server";

export const metadata = {
  title: "Sign in to My App",
};

export default async function Page({ searchParams }) {
  const {
    email,
    redirect_url = "/",
    client_id = "",
    clientId = "",
    state = "",
    mode,
    actortoken,
  } = searchParams;

  return (
    <AuthBox>
      <CookiesProvider>
        <SigninForm
          email={email}
          actortoken={actortoken}
          redirect_url={redirect_url}
          state={state}
          mode={mode}
          suppliedClientId={client_id || clientId}
        />
      </CookiesProvider>
    </AuthBox>
  );
}
