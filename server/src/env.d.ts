declare module 'swagger-ui-express'

declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string
    MYSQL_URI: string
    POSTGRES_URI: string
    SH_EMAIL: string
    SH_PASSWORD: string
    SH_API_KEY: string
  }
}
