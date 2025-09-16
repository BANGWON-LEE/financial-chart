import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import dotenv from 'dotenv'
// dotenv.config()
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Service-Worker-Allowed': '/',
    },
  },
  // define: {
  //   'import.meta.env': {
  //     VITE_FIREBASE_API_KEY: JSON.stringify(import.meta.env.VITE_FIREBASE_API_KEY),
  //     VITE_FIREBASE_AUTH_DOMAIN: JSON.stringify(
  //       import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
  //     ),
  //     VITE_FIREBASE_PROJECT_ID: JSON.stringify(
  //       import.meta.env.VITE_FIREBASE_PROJECT_ID
  //     ),
  //     VITE_FIREBASE_STORAGE_BUCKET: JSON.stringify(
  //       import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
  //     ),
  //     VITE_FIREBASE_MESSAGING_SENDER_ID: JSON.stringify(
  //       import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID
  //     ),
  //     VITE_FIREBASE_APP_ID: JSON.stringify(import.meta.env.VITE_FIREBASE_APP_ID),
  //     VITE_FIREBASE_MEASUREMENT_ID: JSON.stringify(
  //       import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  //     ),
  //   },
  // },
})
