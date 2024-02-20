"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/actions/user";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

export default function SignInPage() {
  const [state, formAction] = useFormState(signIn, { error: null });
  return (
    <main className="max-w-lg mx-auto my-4 bg-popover p-10">
      <h1 className="text-2xl font-bold text-center">
        Sign in to your account
      </h1>
      {state.error ? (
        <div className="w-full p-4 bg-destructive my-4 text-destructive-foreground text-xs">
          <h3 className="font-bold">Error</h3>
          <p>{state.error}</p>
        </div>
      ) : null}
      <form action={formAction}>
        <Label htmlFor="email" className="text-muted-foreground">
          Email
        </Label>
        <Input name="email" id="email" type="email" required />
        <br />
        <Label htmlFor="password" className="text-muted-foreground">
          Password
        </Label>
        <Input type="password" name="password" id="password" required />
        <br />
        <Submit />
      </form>
      <div className="mt-4 text-sm text-center text-muted-foreground">
        Don&apos;t have an account yet?{" "}
        <Link
          href="/sign-up"
          className="text-accent-foreground underline hover:text-primary"
        >
          Create an account
        </Link>
      </div>
    </main>
  );
}

const Submit = () => {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" disabled={pending} type="submit">
      Sign{pending ? "ing" : ""} in
    </Button>
  );
};
