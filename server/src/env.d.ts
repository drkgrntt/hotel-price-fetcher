declare module 'swagger-ui-express'

declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string
    MONGO_URI: string
    MYSQL_URI: string
    SH_EMAIL: string
    SH_PASSWORD: string
    SH_API_KEY: string
  }
}
