import { useSyncExternalStore } from "react";

/**
 * Демо-авторизация (заглушка). Реального бэкенда нет: храним «пользователя»
 * в localStorage, чтобы шапка и личный кабинет вели себя как у настоящего
 * SaaS. Переключение на реальный auth — замена этих функций на вызовы API.
 */

const KEY = "dp-demo-auth";

export interface DemoUser {
  email: string;
  name?: string;
  company?: string;
}

function read(): DemoUser | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as DemoUser) : null;
  } catch {
    return null;
  }
}

let snapshot: DemoUser | null = read();
const listeners = new Set<() => void>();

function emit() {
  snapshot = read();
  listeners.forEach((l) => l());
}

export function signIn(user: DemoUser) {
  localStorage.setItem(KEY, JSON.stringify(user));
  emit();
}

export function signOut() {
  localStorage.removeItem(KEY);
  emit();
}

export function getUser(): DemoUser | null {
  return snapshot;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) emit();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useAuth() {
  const user = useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => null,
  );
  return { user, isAuthed: user !== null };
}
