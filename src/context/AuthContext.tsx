"use client";

export type AuthUser = {
  name: string;
  surname: string;
};

export function useAuth(): {
  user: AuthUser | null;
  logout: () => void;
} {
  return {
    user: null,
    logout: () => {},
  };
}
