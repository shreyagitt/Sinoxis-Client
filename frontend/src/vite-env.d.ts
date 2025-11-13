/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_BASE_URL?: string;
  // add all your env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
