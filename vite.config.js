import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        globals: {
          "@fortawesome/fontawesome-svg-core": "FontAwesome",
          "@fortawesome/free-solid-svg-icons": "FontAwesome",
          "@fortawesome/react-fontawesome": "FontAwesome",
        },
      },
    },
  },

  html: {
    head: [
      {
        tag: "link",
        rel: "stylesheet",
        href: "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
      },
    ],
  },
});
