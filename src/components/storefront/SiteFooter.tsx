import { useState } from 'react'
import { ArrowIcon } from './Icons'

export function SiteFooter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <a className="wordmark" href="#">sRee</a>
          <p>Good clothes for all the in-between.</p>
        </div>
        <div className="newsletter">
          <label htmlFor="newsletter-email">A little something for your inbox.</label>
          <p>New things, considered thoughts. No noise.</p>
          {subscribed ? (
            <p className="subscribe-success">You’re on the list. Talk soon.</p>
          ) : (
            <form onSubmit={(event) => {
              event.preventDefault()
              if (email.includes('@')) setSubscribed(true)
            }}>
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <button type="submit" aria-label="Subscribe"><ArrowIcon /></button>
            </form>
          )}
        </div>
        <div className="footer-links">
          <div><a href="#shop">Shop all</a><a href="#story">Our story</a><a href="#journal">Journal</a></div>
          <div><a href="#footer">Shipping & returns</a><a href="#footer">Get in touch</a><a href="#footer">Instagram ↗</a></div>
        </div>
      </div>
      <div className="footer-bottom" id="footer">
        <span>© 2026 SREE STUDIO</span>
        <span>MADE WITH INTENTION, WORN EVERYWHERE.</span>
        <a href="#top" onClick={(event) => {
          event.preventDefault()
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}>BACK TO TOP ↑</a>
      </div>
    </footer>
  )
}
