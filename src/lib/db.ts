import { GraphQLError } from 'graphql'
import { Pool } from 'pg'

let pool: Pool | undefined

export function getPool(): Pool {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new GraphQLError(
      'PostgreSQL is not configured. Add DATABASE_URL to .env.local and run db/schema.sql.',
      { extensions: { code: 'DATABASE_CONFIGURATION_ERROR' } },
    )
  }

  pool ??= new Pool({ connectionString })
  return pool
}
