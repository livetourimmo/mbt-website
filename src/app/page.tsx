import { redirect } from "next/navigation";

export default function Home() {
  // Referenzphase: Startseite folgt, sobald das Designsystem steht.
  redirect("/lebendige-fuehrung");
}
