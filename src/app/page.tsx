import { chapters } from "@/config/site";
import Experience from "@/components/Experience";
import Nav from "@/components/ui/Nav";
import Hero from "@/components/sections/Hero";
import Chapter from "@/components/sections/Chapter";
import Start from "@/components/sections/Start";
import Footer from "@/components/sections/Footer";
import DeviceMockup from "@/components/ui/DeviceMockup";
import CommentDemo from "@/components/ui/CommentDemo";
import ChartExample from "@/components/ui/ChartExample";

const by = (id: string) => chapters.find((c) => c.id === id)!;

export default function Page() {
  return (
    <Experience>
      <Nav />
      <main>
        <Hero />
        <Chapter c={by("build")}><DeviceMockup /></Chapter>
        <Chapter c={by("traffic")} />
        <Chapter c={by("sell")} />
        <Chapter c={by("grow")}><CommentDemo /></Chapter>
        <Chapter c={by("reports")}><ChartExample /></Chapter>
        <Chapter c={by("who")} />
        <Start />
      </main>
      <Footer />
    </Experience>
  );
}
