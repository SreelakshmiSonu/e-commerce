import { ArrowIcon } from './Icons'

export function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <img
        className="hero-image"
        src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2200&q=90"
        alt="Two friends walking together in relaxed, timeless clothing"
      />
      <div className="hero-shade" />
      <div className="hero-copy">
        <p className="eyebrow light-eyebrow">THE IN-BETWEEN COLLECTION · NO. 04</p>
        <h1 id="hero-title">A little more<br />room to be.</h1>
        <p className="hero-description">
          Pieces that meet you where you are — and go wherever the day takes you.
        </p>
        <a className="button button-light" href="#shop">Explore the collection <ArrowIcon /></a>
      </div>
      <div className="hero-index">01 <span>/</span> 03</div>
      <div className="hero-caption">A softer kind of getting dressed.</div>
    </section>
  )
}
