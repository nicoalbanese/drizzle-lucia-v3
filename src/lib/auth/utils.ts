import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth/lucia";

export type AuthSession = {
  session: {
    user: {
      id: string;
      name?: string;
      email?: string;
      username?: string;
    };
  } | null;
};
export const getUserAuth = async (): Promise<AuthSession> => {
  const { session, user } = await validateRequest();
  if (!session) return { session: null };
  return {
    session: {
      user: {
        id: user?.id,
        email: user?.email,
        name: user?.name,
      },
    },
  };
};

export const checkAuth = async () => {
  const { session } = await validateRequest();

  if (!session) redirect("/sign-in");
};
