import { ArrowIcon } from './Icons'

export function StorySection() {
  return (
    <section className="story-section" id="story">
      <div className="story-image-wrap">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=85"
          alt="A calm, light-filled clothing studio"
        />
        <span className="image-note">LESS, BUT A LITTLE BETTER.</span>
      </div>
      <div className="story-copy">
        <p className="eyebrow">A THOUGHTFUL WARDROBE STARTS HERE</p>
        <h2>Wear it often.<br /><em>Feel like yourself.</em></h2>
        <p>
          We make fewer things, with more thought. Natural fabrics, considered details,
          and silhouettes that make getting dressed feel like the easy part.
        </p>
        <a className="text-link" href="#journal">Get to know sRee <ArrowIcon /></a>
        <span className="story-number">01 — 03</span>
      </div>
    </section>
  )
}
