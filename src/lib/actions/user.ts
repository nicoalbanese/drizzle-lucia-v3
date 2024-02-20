"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { ActionResult } from "next/dist/server/app-render/types";
import { db } from "../db";
import { eq } from "drizzle-orm";
import {
  authenticationSchema,
  updateUserSchema,
  users,
} from "@/lib/db/schema/auth";

import { lucia, validateRequest } from "@/lib/auth/lucia";
import { Argon2id } from "oslo/password";
import { type Cookie, generateId } from "lucia";
import { getUserAuth } from "../auth/utils";
import { revalidatePath } from "next/cache";

const genericError = { error: "Error, please try again." };

const updateCookie = (cookie: Cookie) => {
  cookies().set(cookie.name, cookie.value, cookie.attributes);
};

const createSessionAndRedirect = async (userId: string) => {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  updateCookie(sessionCookie);
  return redirect("/dashboard");
};

export async function signIn(
  _: any,
  formData: FormData,
): Promise<ActionResult> {
  const email = formData.get("email");
  if (typeof email !== "string" || email.length < 3 || email.length > 31) {
    return {
      error: "Invalid email",
    };
  }
  const password = formData.get("password");
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      error: "Invalid password",
    };
  }

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()));
  if (!existingUser) {
    return {
      error: "Incorrect username or password",
    };
  }

  const validPassword = await new Argon2id().verify(
    existingUser.hashedPassword,
    password,
  );
  if (!validPassword) {
    return {
      error: "Incorrect username or password",
    };
  }
  createSessionAndRedirect(existingUser.id);
}

export async function signUp(
  _: any,
  formData: FormData,
): Promise<ActionResult> {
  const email = formData.get("email");
  const password = formData.get("password");
  const result = authenticationSchema.safeParse({ email, password });

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    if (errors.email) return { error: "Invalid Email" };
    if (errors.password)
      return { error: "Invalid Password - " + errors.password[0] };
    return genericError;
  }

  const payload = result.data;
  const hashedPassword = await new Argon2id().hash(payload.password);
  const userId = generateId(15);

  try {
    await db.insert(users).values({
      id: userId,
      email: payload.email,
      hashedPassword,
    });
  } catch (e) {
    return e instanceof Error && e.message.includes("UNIQUE")
      ? { error: "Username already exists." }
      : genericError;
  }
  createSessionAndRedirect(userId);
}

export async function signOut(): Promise<ActionResult> {
  const { session } = await validateRequest();
  if (!session) return { error: "Unauthorized" };

  try {
    await lucia.invalidateSession(session.id);
  } catch (e) {
    return genericError;
  }
  const sessionCookie = lucia.createBlankSessionCookie();
  updateCookie(sessionCookie);
  return redirect("/sign-in");
}

export async function updateUser(
  _: any,
  formData: FormData,
): Promise<ActionResult> {
  const { session } = await getUserAuth();
  if (!session) return { error: "Unauthorised" };

  const name = formData.get("name") ?? undefined;
  const email = formData.get("email") ?? undefined;

  const result = updateUserSchema.safeParse({ name, email });

  if (!result.success) {
    const error = result.error.flatten().fieldErrors;
    if (error.name) return { error: "Invalid name - " + error.name[0] };
    if (error.email) return { error: "Invalid email - " + error.email[0] };
    return genericError;
  }

  try {
    await db
      .update(users)
      .set({ ...result.data })
      .where(eq(users.id, session.user.id));
    revalidatePath("/account");
    return { success: true };
  } catch (e) {
    return genericError;
  }
}
