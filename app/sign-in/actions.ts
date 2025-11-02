"use server";

import { auth } from "@/auth";

export async function signIn(email: string, password: string) {
  await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });
}

export async function signUp(name: string, email: string, password: string) {
  await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });
}
