import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Über mich",
  description: "Markus Tappolet — Coach und Unternehmensentwickler.",
  alternates: {
    canonical: "https://mbt-consulting.ch/ueber-mich",
  },
};

export default function UeberMichPage() {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-12 md:items-center md:gap-8 md:px-10 md:py-24">
      <div className="md:col-span-5">
        <p className="text-[17px] text-ink-soft">Über mich</p>
        <h1 className="mt-4 font-display text-[2.25rem] leading-[1.1] font-semibold text-ink md:text-[3rem]">
          Mit Begeisterung wirken, um abends erfüllt zu sein.
        </h1>
        <p className="mt-6 max-w-md text-[17px] leading-relaxed text-ink-soft">
          Markus Tappolet begleitet Führung — als Coach für einzelne
          Führungspersönlichkeiten und als Unternehmensentwickler für
          Führungsteams und Organisationen. Beide Wege ruhen auf einem
          gemeinsamen Verständnis: Lebendige Führung.
        </p>
      </div>
      <div className="overflow-hidden md:col-span-7">
        <Image
          src="/images/markus-portrait.jpg"
          alt="Markus Tappolet"
          width={640}
          height={960}
          className="h-full w-full object-cover"
        />
      </div>
    </section>
  );
}
