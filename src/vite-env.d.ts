/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DONATION_URL?: string;
  readonly VITE_DATAFAST_WEBSITE_ID?: string;
  readonly VITE_DATAFAST_DOMAIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
