import { chapters, howWeWork, links } from "@/config/site";
import Cartouche from "../ui/Cartouche";
import ChapterNumeral from "../ui/ChapterNumeral";
import ContactForm from "../ui/ContactForm";
import MagneticButton from "../ui/MagneticButton";

export default function Start() {
  const c = chapters.find((x) => x.id === "start")!;
  return (
    <section id="start" data-chapter="start" aria-labelledby="start-h" className="on-dark relative min-h-screen px-5 py-24 text-papyrus lg:pl-40 lg:pr-12">
      <div className="grain relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-night/85 p-8 backdrop-blur-sm sm:p-12">
        <Cartouche dark><ChapterNumeral n={c.n} className="h-7" /></Cartouche>
        <p className="mt-6 font-display text-xs tracking-[0.3em] text-gold-light">{c.kicker.toUpperCase()}</p>
        <h2 id="start-h" data-lines className="mt-2 font-display text-5xl font-semibold sm:text-7xl">
          <span className="reveal-line"><span>{c.title}</span></span>
        </h2>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {howWeWork.promises.map((p) => (
            <li key={p.title} data-reveal className="border-t-2 border-gold pt-4">
              <h3 className="font-display text-xl font-semibold">{p.title}</h3>
              <p className="mt-1 text-sand">{p.body}</p>
            </li>
          ))}
        </ul>
        <div className="mt-14 grid gap-12 lg:grid-cols-2">
          <div>
            <h3 className="font-display text-3xl font-semibold">How we start</h3>
            <p className="mt-3 text-lg">{howWeWork.howWeStart}</p>
            <p className="mt-2 text-sand">{howWeWork.languages}</p>
            <p className="mt-2"><a className="underline underline-offset-4" href={`mailto:${links.email}`}>{links.email}</a></p>
            <div className="mt-8 flex flex-wrap gap-4">
              <MagneticButton href={links.instagramDm} external>Instagram DM</MagneticButton>
              <MagneticButton href={`mailto:${links.email}`} variant="ghost" className="!border-gold-light !text-gold-light hover:!bg-gold-light hover:!text-ink">Email</MagneticButton>
              <MagneticButton href={links.linkedin} external variant="ghost" className="!border-gold-light !text-gold-light hover:!bg-gold-light hover:!text-ink">LinkedIn</MagneticButton>
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
