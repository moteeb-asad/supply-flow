import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import tseslint from "typescript-eslint";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { "@typescript-eslint": tseslint.plugin },
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        // Allow async handlers on JSX attributes (onClick, onSubmit, ...).
        { checksVoidReturn: { attributes: false } },
      ],
    },
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      "react-hooks/exhaustive-deps": "error",
      "no-console": ["error", { allow: ["warn", "error"] }],
      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "next/router",
              message: "Use next/navigation in the App Router.",
            },
            {
              name: "@/src/db/supabaseAdmin",
              message:
                "The admin client bypasses RLS. Import it only in server actions or server folders.",
            },
          ],
        },
      ],
    },
  },
  {
    // Server-only code may use the admin client.
    files: ["**/actions/**", "**/server/**", "src/db/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "next/router",
              message: "Use next/navigation in the App Router.",
            },
          ],
        },
      ],
    },
  },
  prettier,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
