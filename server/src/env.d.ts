declare module 'swagger-ui-express'

declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string
    MONGO_URI: string
    MYSQL_URI: string
  }
}
