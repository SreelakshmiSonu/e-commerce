import { GraphQLError } from 'graphql'
import { createSchema, createYoga } from 'graphql-yoga'
import { getPool } from '../../../src/lib/db'
import type { Product } from '../../../src/lib/types'

type ProductRow = Product
type OrderLineInput = { productId: number; quantity: number }

const yoga = createYoga({
  graphqlEndpoint: '/api/graphql',
  schema: createSchema({
    typeDefs: /* GraphQL */ `
      type Product {
        id: Int!
        name: String!
        category: String!
        price: Int!
        color: String!
        image: String!
        badge: String
      }

      type DemoOrder {
        id: Int!
        total: Int!
        status: String!
      }

      input OrderItemInput {
        productId: Int!
        quantity: Int!
      }

      type Query {
        products: [Product!]!
      }

      type Mutation {
        createDemoOrder(items: [OrderItemInput!]!): DemoOrder!
      }
    `,
    resolvers: {
      Query: {
        products: async (): Promise<ProductRow[]> => {
          try {
            const { rows } = await getPool().query<ProductRow>(
              `SELECT id, name, category, price, color, image, badge
               FROM products
               ORDER BY id`,
            )
            return rows
          } catch (error) {
            if (error instanceof GraphQLError) throw error
            console.error('Could not load products from PostgreSQL.', error)
            throw new GraphQLError(
              'Could not load products from PostgreSQL. Verify DATABASE_URL and run db/schema.sql.',
              { extensions: { code: 'DATABASE_ERROR' } },
            )
          }
        },
      },
      Mutation: {
        createDemoOrder: async (
          _parent: unknown,
          { items }: { items: OrderLineInput[] },
        ) => {
          if (items.length === 0) {
            throw new GraphQLError('Add at least one product before placing an order.')
          }

          const quantities = new Map<number, number>()
          for (const item of items) {
            if (!Number.isInteger(item.productId) || !Number.isInteger(item.quantity) || item.quantity < 1) {
              throw new GraphQLError('Order items must have a valid product and positive quantity.')
            }
            quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity)
          }

          const client = await getPool().connect()
          try {
            await client.query('BEGIN')
            const productIds = [...quantities.keys()]
            const { rows: orderProducts } = await client.query<{
              id: number
              name: string
              price: number
            }>(
              'SELECT id, name, price FROM products WHERE id = ANY($1::int[])',
              [productIds],
            )
            if (orderProducts.length !== productIds.length) {
              throw new GraphQLError('One or more products are no longer available.')
            }

            const total = orderProducts.reduce(
              (sum, product) => sum + product.price * (quantities.get(product.id) ?? 0),
              0,
            )
            const { rows: [order] } = await client.query<{ id: number }>(
              "INSERT INTO orders (total, status) VALUES ($1, 'DEMO') RETURNING id",
              [total],
            )

            for (const product of orderProducts) {
              await client.query(
                `INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price)
                 VALUES ($1, $2, $3, $4, $5)`,
                [order.id, product.id, product.name, quantities.get(product.id), product.price],
              )
            }

            await client.query('COMMIT')
            return { id: order.id, total, status: 'DEMO' }
          } catch (error) {
            await client.query('ROLLBACK')
            if (error instanceof GraphQLError) throw error
            console.error('Could not record demo order in PostgreSQL.', error)
            throw new GraphQLError(
              'Could not record the demo order. Verify the PostgreSQL connection and schema.',
              { extensions: { code: 'DATABASE_ERROR' } },
            )
          } finally {
            client.release()
          }
        },
      },
    },
  }),
})

export { yoga as GET, yoga as POST }
