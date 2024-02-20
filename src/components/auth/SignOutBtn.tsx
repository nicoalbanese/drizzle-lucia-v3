"use client";

import { signOut } from "@/lib/actions/user";
import { Button } from "../ui/button";
import { useFormStatus } from "react-dom";

export default function SignOutBtn() {
  return (
    <form action={signOut} className="w-full text-left">
      <Btn />
    </form>
  );
}

const Btn = () => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} variant={"destructive"}>
      Sign{pending ? "ing" : ""} out
    </Button>
  );
};
