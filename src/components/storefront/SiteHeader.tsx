import { ArrowIcon, MenuIcon, SearchIcon } from './Icons'

type SiteHeaderProps = {
  cartCount: number
  searchOpen: boolean
  searchTerm: string
  onCartOpen: () => void
  onMenuClick: () => void
  onSearchToggle: () => void
  onSearchChange: (value: string) => void
  onSearchClose: () => void
}

export function SiteHeader({
  cartCount,
  searchOpen,
  searchTerm,
  onCartOpen,
  onMenuClick,
  onSearchToggle,
  onSearchChange,
  onSearchClose,
}: SiteHeaderProps) {
  return (
    <>
      <header className="site-header">
        <button className="mobile-menu icon-button" aria-label="Open menu" onClick={onMenuClick}>
          <MenuIcon />
        </button>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#shop">Shop</a>
          <a href="#story">Our story</a>
          <a href="#journal">Journal</a>
        </nav>
        <a className="wordmark" href="#" aria-label="sRee home">sRee</a>
        <div className="header-actions">
          <button
            className="icon-button search-toggle"
            aria-label={searchOpen ? 'Close search' : 'Open search'}
            onClick={onSearchToggle}
          >
            <SearchIcon />
            <span className="action-label">Search</span>
          </button>
          <button className="cart-button" onClick={onCartOpen}>
            <span className="action-label">Bag</span>
            <span className="cart-count">{cartCount}</span>
          </button>
        </div>
      </header>

      {searchOpen && (
        <form className="search-bar" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="product-search">Search the collection</label>
          <input
            autoFocus
            id="product-search"
            type="search"
            placeholder="Try “linen” or “knitwear”"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
          />
          <button type="button" onClick={onSearchClose} aria-label="Close search">
            ×
          </button>
        </form>
      )}
    </>
  )
}

export { ArrowIcon }
