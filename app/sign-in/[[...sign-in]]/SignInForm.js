"use client";
import { useCookies } from "next-client-cookies";
import { useSignIn, useUser } from "@clerk/nextjs";
import { Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import DialogTitle from "@/components/auth/AuthTitle";
import TextField from "@/components/auth/TextField";
import PasswordField from "@/components/auth/PasswordField";
import { CLERK_COOKIE, clients } from "@/store/constants";

const sanitizedClientId = (suppliedId) => {
  const defaultId = clients.find((c) => c.default)?.client_id || "";
  const validIds = clients.map((c) => c.client_id);
  if (suppliedId) {
    return validIds.includes(suppliedId) ? suppliedId : defaultId;
  }
  return defaultId;
};

const SigninForm = ({
  email = "",
  state = "",
  suppliedClientId = "", // queryparam-supplied clientid
}) => {
  const cookieStore = useCookies();

  const [clientid, setClientId] = useState(null);

  const user = useUser();
  const { isSignedIn } = user;

  const formRef = useRef();

  const [userMsg, setUserMsg] = useState("");
  const [errMsg, setError] = useState("");
  const [checking, setChecking] = useState(false);

  const { setActive, signIn } = useSignIn();

  // PRODUCTION auth code resolution
  const redirectToTokenEndpoint = async () => {
    const authcodeurl = new URL(
      `https://${process.env.NEXT_PUBLIC_SSO_DOMAIN}/oauth/authorize`,
    );
    authcodeurl.searchParams.append("client_id", clientid);
    authcodeurl.searchParams.append("response_type", "code");
    if (state) {
      authcodeurl.searchParams.append("state", state);
    }

    setUserMsg(() => "you should redirect to your app shortly now…");
    location.href = authcodeurl.href;
  };

  // STAGING/DEV auth code resolution
  const getTokenFromCookie = async () => {
    const jwtcookie = cookieStore.get(CLERK_COOKIE);

    if (!jwtcookie) {
      setUserMsg(() => "Oh no! We never got a login cookie! This is very bad");
      return;
    }

    const authCodeRes = await fetch("/api/clerk/authcode", {
      headers: { "content-type": "application/json" },
      method: "post",
      body: JSON.stringify({
        jwtcookie,
        clientid,
      }),
    }).then((r) => r.json());

    const { location: redirectTo } = authCodeRes;

    if (redirectTo) {
      setUserMsg(() => "you should redirect to your app shortly now…");
      // Use OFFICIAL redirect, gotten from Clerk oAuth app setting
      const redirectWithState = new URL(redirectTo);
      if (state) {
        redirectWithState.searchParams.append("state", state);
      }
      location.href = redirectWithState.href;
    } else {
      setUserMsg(
        () =>
          "Oh no! You're logged in, but we failed to figure where to send you next!",
      );
    }
  };

  const tryLogin = async (vals) => {
    setChecking(() => true);
    setError(() => "");
    const { email, password } = vals;

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        setChecking(() => false);
        return;
      } else {
        console.log("Arrgh, sign in never completed!", result);
      }
    } catch (err) {
      const err1 = err?.errors?.length ? err?.errors[0] : {};
      const { code } = err1;

      switch (code) {
        case "form_param_nil":
        case "form_param_format_invalid":
        case "form_password_incorrect":
        default: {
          // WARN frontend logging the real reason could theoretically be exploited to enumerate email accounts
          setError(() => "Incorrect email or password. Try again.");
        }
      }
    }
    setChecking(() => false);
    // the useEffect(…, [isSignedIn]) will pick up from here
  };

  const goToPassword = () => {
    const el = document.getElementById("passwordField");
    if (el?.focus) {
      el.focus();
    }
  };

  useEffect(() => {
    const id = sanitizedClientId(suppliedClientId);
    if (id) {
      setClientId(() => id);
    } else {
      console.log(
        `SSO: unable to figure a valid clientid, supplied ${suppliedClientId}`,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // watch isSignedIn etc
  useEffect(() => {
    if (!isSignedIn) {
      return;
    }

    if (!clientid) {
      console.log("waiting for clientid");
      return;
    }

    // PRODUCTION
    if (process.env.NEXT_PUBLIC_SSO_DOMAIN) {
      redirectToTokenEndpoint(process.env.NEXT_PUBLIC_SSO_DOMAIN);
    } else {
      // STAGING
      getTokenFromCookie();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, clientid]);

  // kind of stuck: isSignedInWatcher should handle onward navigation here.
  if (isSignedIn) {
    return (
      <>
        <DialogTitle title="Signed in" subtitle="to My App" />
        {userMsg}
      </>
    );
  }

  // non-stuck / need to do things like log in
  return (
    <>
      <DialogTitle title="Welcome" subtitle="to My App" />
      <Formik
        innerRef={formRef}
        initialValues={{
          email,
          password: "",
        }}
      >
        {(form) => {
          const { values } = form;
          const { email } = values;
          const clickDisabled = !email || !email.includes("@") || checking;
          return (
            <Form className="flex flex-col h-full ">
              <TextField
                onEnter={goToPassword}
                name="email"
                title="Email"
                autoFocus
                placeholder="Your Email"
                autoComplete="email"
              />
              <PasswordField
                id="passwordField"
                onEnter={() => tryLogin(values)}
                name="password"
                title="Password"
                placeholder="Enter password"
                autoComplete="current-password"
              />

              <div className="text-sm text-red-500">{errMsg || ""}&nbsp;</div>

              {/* growing spacer to keep email field from walkabout when password field is hidden */}
              <div className="flex-grow "></div>

              <div
                onClick={clickDisabled ? null : () => tryLogin(values)}
                className={twMerge(
                  "mt-4 bg-[#DE4244] text-white text-center w-full p-2 text-xs uppercase rounded-md ",
                  clickDisabled ? "bg-red-300" : " cursor-pointer",
                )}
              >
                Sign in
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default SigninForm;
