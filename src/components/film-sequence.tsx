"use client";

import { useState, type ReactNode } from "react";
import FilmIntro from "./film-intro";
import BookReader from "./book-reader";

export default function FilmSequence({ pages }: { pages: ReactNode[] }) {
  const [started, setStarted] = useState(false);

  if (!started) {
    return <FilmIntro onDone={() => setStarted(true)} />;
  }

  return <BookReader pages={pages} />;
}
