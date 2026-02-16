import { User } from "./types";

const USER_KEY = "coldmail_user";

export const saveUser = (user: User) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = (): User | null => {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);

    // Validate essential fields
    if (!parsed?.email || !parsed?.name) return null;

    return parsed;
  } catch {
    return null;
  }
};

export const clearUser = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_KEY);
};
