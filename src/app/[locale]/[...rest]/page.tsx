import { notFound } from "next/navigation";

/** Sends unknown paths under a locale to that locale's not-found page. */
export default function CatchAll() {
  notFound();
}
