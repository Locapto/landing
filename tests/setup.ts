import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

afterEach(() => {
  if (typeof window === "undefined") return;
  window.localStorage.clear();
  window.sessionStorage.clear();
  window.history.replaceState({}, "", "/");
});
