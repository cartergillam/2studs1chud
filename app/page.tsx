import { BoysStage } from "@/components/BoysStage";
import { MerchTeaser } from "@/components/MerchTeaser";
import { TikTokLink } from "@/components/TikTokLink";

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="2 Studs 1 Chud home">
          <span>2 STUDS</span>
          <span className="wordmark-one">1</span>
          <span className="wordmark-chud">CHUD</span>
        </a>
        <TikTokLink />
      </header>

      <section id="top" className="hero" aria-labelledby="main-title">
        <div className="hero-kicker" aria-hidden="true">
          <span className="authority-full">★ THE STUD/CHUD SELECTION AUTHORITY ★</span>
          <span className="authority-short">★ THE SELECTION AUTHORITY ★</span>
          <span className="authority-full">★ THE STUD/CHUD SELECTION AUTHORITY ★</span>
          <span className="authority-short">★ THE SELECTION AUTHORITY ★</span>
        </div>
        <p className="eyebrow">The world&apos;s least necessary sporting event</p>
        <h1 id="main-title">
          WHO&apos;S THE <span>CHUD?</span>
        </h1>
        <p className="hero-subtitle">Three boys. Two studs. Zero appeals.</p>
      </section>

      <BoysStage />
      <MerchTeaser />

      <footer>
        <p>Three boys. Two studs. One legally recognized chud.</p>
        <span>© {new Date().getFullYear()} THE SELECTION AUTHORITY</span>
      </footer>
    </main>
  );
}
