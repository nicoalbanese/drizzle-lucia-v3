"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "@/lib/actions/user";
import { Button } from "@/components/ui/button";
import { useFormState, useFormStatus } from "react-dom";

const Page = () => {
  const [state, formAction] = useFormState(signup, { error: null });

  return (
    <main className="max-w-lg mx-auto my-4 bg-popover p-10">
      <h1 className="text-2xl font-bold text-center">Create an account</h1>
      {state.error ? (
        <div className="w-full p-4 bg-destructive my-4 text-destructive-foreground text-xs">
          <h3 className="font-bold">Error</h3>
          <p>{state.error}</p>
        </div>
      ) : null}
      <form action={formAction}>
        <Label htmlFor="username" className="text-muted-foreground">
          Username
        </Label>
        <Input name="username" id="username" />
        <br />
        <Label htmlFor="password" className="text-muted-foreground">
          Password
        </Label>
        <Input type="password" name="password" id="password" />
        <br />
        <Submit />
      </form>
      <div className="mt-4 text-muted-foreground text-center text-sm">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-secondary-foreground underline">
          Sign in
        </Link>
      </div>
    </main>
  );
};

export default Page;

const Submit = () => {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" disabled={pending} type="submit">
      Sign{pending ? "ing" : ""} up
    </Button>
  );
};
