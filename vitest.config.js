import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/* Configuración dedicada a tests. Separa el setup de Vite para que
   `npm run dev` y `npm run build` no arrastren jsdom ni el directorio
   de cobertura. `environment: jsdom` permite renderizar componentes
   React con React Testing Library. */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/setupTests.jsx"],
    include: ["src/**/*.test.{js,jsx}"],
    coverage: {
      provider: "istanbul",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.jsx"],
      exclude: ["src/main.jsx", "src/data/", "src/setupTests.jsx"],
    },
  },
});
