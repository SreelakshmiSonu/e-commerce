import type { Product } from '../../lib/types'
import { formatPrice } from '../../lib/format-price'
import { ArrowIcon } from './Icons'

type CartDrawerProps = {
  items: Product[]
  total: number
  open: boolean
  loading: boolean
  error: string | null
  orderMessage: string | null
  onClose: () => void
  onRemove: (index: number) => void
  onPlaceDemoOrder: () => void
}

export function CartDrawer({
  items,
  total,
  open,
  loading,
  error,
  orderMessage,
  onClose,
  onRemove,
  onPlaceDemoOrder,
}: CartDrawerProps) {
  if (!open) return null

  return (
    <div className="cart-overlay" role="presentation" onClick={onClose}>
      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="cart-header">
          <h2 id="cart-title">Your bag <span>({items.length})</span></h2>
          <button className="icon-button close-cart" aria-label="Close bag" onClick={onClose}>×</button>
        </div>
        {orderMessage ? (
          <div className="empty-cart order-success" role="status">
            <p>Your order is in the books.</p>
            <span>{orderMessage}</span>
            <button className="button button-outline" onClick={onClose}>
              Continue browsing <ArrowIcon />
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="empty-cart">
            <p>Your bag is taking a breather.</p>
            <button className="button button-outline" onClick={() => {
              onClose()
              document.querySelector('#shop')?.scrollIntoView({ behavior: 'smooth' })
            }}>
              Explore the collection <ArrowIcon />
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((product, index) => (
                <div className="cart-item" key={`${product.id}-${index}`}>
                  <img src={product.image} alt="" />
                  <div>
                    <h3>{product.name}</h3>
                    <p>{product.color} · One size</p>
                    <span>{formatPrice(product.price)}</span>
                  </div>
                  <button
                    aria-label={`Remove ${product.name} from bag`}
                    onClick={() => onRemove(index)}
                  >×</button>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <div><span>Subtotal</span><span>{formatPrice(total)}</span></div>
              <p>This portfolio checkout records a demo order only. No payment is collected.</p>
              {error && <p className="checkout-error" role="alert">{error}</p>}
              <button
                className="button checkout-button"
                onClick={onPlaceDemoOrder}
                disabled={loading}
              >
                {loading ? 'Recording demo order…' : 'Place demo order'} <ArrowIcon />
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
