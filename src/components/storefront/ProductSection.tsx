import { useMemo, useState } from 'react'
import type { Product } from '../../lib/types'
import { formatPrice } from '../../lib/format-price'
import { ArrowIcon } from './Icons'

const categories = ['All pieces', 'Clothing', 'Knitwear', 'Outerwear']

type ProductSectionProps = {
  products: Product[]
  loading: boolean
  error: string | null
  searchTerm: string
  onAddToCart: (product: Product) => void
}

export function ProductSection({
  products,
  loading,
  error,
  searchTerm,
  onAddToCart,
}: ProductSectionProps) {
  const [activeCategory, setActiveCategory] = useState('All pieces')

  const visibleProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === 'All pieces' || product.category === activeCategory
      const matchesSearch =
        !query ||
        `${product.name} ${product.category} ${product.color}`.toLowerCase().includes(query)
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, products, searchTerm])

  return (
    <section className="shop-section section-wrap" id="shop">
      <div className="section-heading">
        <div>
          <p className="eyebrow">MADE FOR YOUR EVERYDAY</p>
          <h2>Considered, not complicated.</h2>
        </div>
        <a className="text-link desktop-shop-link" href="#story">
          A note on how we make things <ArrowIcon />
        </a>
      </div>

      <div className="shop-toolbar">
        <div className="category-tabs" role="group" aria-label="Filter products by category">
          {categories.map((category) => (
            <button
              className={activeCategory === category ? 'category-tab active' : 'category-tab'}
              key={category}
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
            >
              {category}
            </button>
          ))}
        </div>
        <span className="result-count">
          {loading ? 'Loading…' : `${visibleProducts.length} pieces`}
        </span>
      </div>

      <div className="product-grid">
        {error && <p className="no-results">{error}</p>}
        {!error && loading && <p className="no-results">Finding your pieces…</p>}
        {visibleProducts.map((product) => (
          <article className="product-card" key={product.id}>
            <div className="product-image-wrap">
              <img className="product-image" src={product.image} alt={product.name} />
              {product.badge && <span className="product-badge">{product.badge}</span>}
              <button className="quick-add" onClick={() => onAddToCart(product)}>
                Add to bag <span>+</span>
              </button>
            </div>
            <div className="product-info">
              <div>
                <h3>{product.name}</h3>
                <p>{product.color}</p>
              </div>
              <span className="product-price">{formatPrice(product.price)}</span>
            </div>
          </article>
        ))}
        {!loading && !error && visibleProducts.length === 0 && (
          <p className="no-results">No pieces found. Try a different search.</p>
        )}
      </div>
      <a
        className="button button-outline view-all"
        href="#shop"
        onClick={() => setActiveCategory('All pieces')}
      >
        View all pieces <ArrowIcon />
      </a>
    </section>
  )
}
