'use client'

import { useEffect, useState } from 'react'
import { AnnouncementBar } from './components/storefront/AnnouncementBar'
import { CartDrawer } from './components/storefront/CartDrawer'
import { HeroSection } from './components/storefront/HeroSection'
import { JournalQuote } from './components/storefront/JournalQuote'
import { ProductSection } from './components/storefront/ProductSection'
import { SiteFooter } from './components/storefront/SiteFooter'
import { SiteHeader } from './components/storefront/SiteHeader'
import { StorySection } from './components/storefront/StorySection'
import { graphqlRequest } from './lib/graphql'
import type { Product } from './lib/types'
import { useCartStore } from './store/cart'

export default function App() {
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [productsError, setProductsError] = useState<string | null>(null)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [orderMessage, setOrderMessage] = useState<string | null>(null)
  const cart = useCartStore((state) => state.items)
  const addItem = useCartStore((state) => state.addItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const clearCart = useCartStore((state) => state.clearCart)

  useEffect(() => {
    void useCartStore.persist.rehydrate()

    let active = true
    graphqlRequest<{ products: Product[] }>(`
      query Products {
        products {
          id
          name
          category
          price
          color
          image
          badge
        }
      }
    `)
      .then(({ products: loadedProducts }) => {
        if (active) setProducts(loadedProducts)
      })
      .catch((cause: unknown) => {
        if (active) {
          setProductsError(
            cause instanceof Error ? cause.message : 'Could not load products.',
          )
        }
      })
      .finally(() => {
        if (active) setProductsLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const addToCart = (product: Product) => {
    addItem(product)
    setCheckoutError(null)
    setOrderMessage(null)
    setCartOpen(true)
  }

  const placeDemoOrder = async () => {
    setCheckoutLoading(true)
    setCheckoutError(null)
    const quantities = new Map<number, number>()
    cart.forEach((product) => {
      quantities.set(product.id, (quantities.get(product.id) ?? 0) + 1)
    })

    try {
      const { createDemoOrder } = await graphqlRequest<{
        createDemoOrder: { id: number }
      }>(
        `mutation CreateDemoOrder($items: [OrderItemInput!]!) {
          createDemoOrder(items: $items) { id }
        }`,
        { items: [...quantities].map(([productId, quantity]) => ({ productId, quantity })) },
      )
      clearCart()
      setOrderMessage(
        `Demo order #${createDemoOrder.id} was recorded. No payment was collected.`,
      )
    } catch (cause) {
      setCheckoutError(
        cause instanceof Error ? cause.message : 'Could not create the demo order.',
      )
    } finally {
      setCheckoutLoading(false)
    }
  }

  return (
    <main>
      <AnnouncementBar />
      <SiteHeader
        cartCount={cart.length}
        searchOpen={searchOpen}
        searchTerm={searchTerm}
        onCartOpen={() => setCartOpen(true)}
        onMenuClick={() =>
          document.querySelector('#shop')?.scrollIntoView({ behavior: 'smooth' })
        }
        onSearchToggle={() => {
          setSearchOpen((open) => !open)
          setSearchTerm('')
        }}
        onSearchChange={setSearchTerm}
        onSearchClose={() => setSearchOpen(false)}
      />
      <HeroSection />
      <ProductSection
        products={products}
        loading={productsLoading}
        error={productsError}
        searchTerm={searchTerm}
        onAddToCart={addToCart}
      />
      <StorySection />
      <JournalQuote />
      <SiteFooter />
      <CartDrawer
        items={cart}
        total={cart.reduce((sum, product) => sum + product.price, 0)}
        open={cartOpen}
        loading={checkoutLoading}
        error={checkoutError}
        orderMessage={orderMessage}
        onClose={() => setCartOpen(false)}
        onRemove={removeItem}
        onPlaceDemoOrder={() => void placeDemoOrder()}
      />
    </main>
  )
}
