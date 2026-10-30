import { demoProject as d } from "@/config/site";

/** Stylised laptop showing the SHWY Store demo (dark fashion store). Pure CSS, no images. */
export default function DeviceMockup() {
  return (
    <figure data-reveal className="grain relative overflow-hidden rounded-3xl bg-papyrus/90 p-6">
      <figcaption className="mb-4 inline-block rounded-full border-2 border-gold px-4 py-1 text-xs font-bold uppercase tracking-widest text-brown">{d.label}</figcaption>
      <div role="img" aria-label="Stylised mockup of the SHWY Store demo, a dark fashion online store" className="mx-auto max-w-md">
        <div className="rounded-t-xl border-4 border-ink bg-[#0c0c0f] p-3">
          <div className="flex items-center justify-between text-[10px] text-white/80">
            <span className="font-bold tracking-widest">SHWY STORE</span>
            <span className="flex gap-2"><i>Shop</i><i>New</i><i>Bag</i></span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="col-span-3 flex h-20 items-end rounded bg-gradient-to-br from-zinc-700 to-zinc-900 p-2 text-[10px] font-bold text-white">New season</div>
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-1">
                <div className="h-16 rounded bg-zinc-800" />
                <div className="h-1.5 w-2/3 rounded bg-zinc-600" />
                <div className="h-1.5 w-1/3 rounded bg-gold/80" />
              </div>
            ))}
          </div>
        </div>
        <div className="mx-auto h-2 rounded-b-xl bg-ink" />
        <div className="mx-auto h-1 w-1/3 rounded-b bg-brown" />
      </div>
      <h3 className="mt-5 font-display text-xl font-semibold">{d.name}</h3>
      <p className="mt-1">{d.body}</p>
    </figure>
  );
}
