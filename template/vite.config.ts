import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // The code below enables dev tools like taking screenshots of your site
    // while it is being developed on synapse.convex.dev.
    // Feel free to remove this code if you're no longer developing your app with Synapse.
    mode === "development"
      ? {
        name: "inject-synapse-dev",
        transform(code: string, id: string) {
          if (id.includes("main.tsx")) {
            return {
              code: `${code}

/* Added by Vite plugin inject-synapse-dev */
if (typeof window !== "undefined") {
  window.addEventListener("message", async (message) => {
    if (message.source !== window.parent) return;
    if (message.data.type !== 'synapsePreviewRequest') return;

    const worker = await import('https://synapse.convex.dev/scripts/worker.bundled.mjs');
    await worker.default(message);
  });
}
            `,
              map: null,
            };
          }
          return null;
        },
      }
      : null,
    // End of code for taking screenshots on synapse.convex.dev.
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
