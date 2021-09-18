declare module 'swagger-ui-express'

declare namespace NodeJS {
  export interface ProcessEnv {
    API_KEY: string
    PORT: string
  }
}
