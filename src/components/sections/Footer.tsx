import { brand, chapters, footerNote, links } from "@/config/site";
import Wordmark from "../ui/Wordmark";

export default function Footer() {
  return (
    <footer className="on-dark relative bg-night px-5 pb-24 pt-14 text-papyrus lg:pl-40 lg:pr-12 lg:pb-14">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 sm:flex-row">
        <div>
          <Wordmark className="text-6xl" light />
          <p className="mt-3 font-display text-sm tracking-[0.25em] text-gold-light">{footerNote.toUpperCase()}</p>
          <p className="mt-2 text-sm text-sand">{brand.tagline}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
            {chapters.map((c) => (
              <li key={c.id}><a className="underline-offset-4 hover:underline" href={`#${c.id}`}>{c.n}. {c.title}</a></li>
            ))}
            <li><a className="underline-offset-4 hover:underline" href={`mailto:${links.email}`}>Email</a></li>
            <li><a className="underline-offset-4 hover:underline" href={links.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a className="underline-offset-4 hover:underline" href={links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          </ul>
        </nav>
      </div>
      <p className="mx-auto mt-10 max-w-6xl text-xs text-sand">© {new Date().getFullYear()} {brand.name}</p>
    </footer>
  );
}
