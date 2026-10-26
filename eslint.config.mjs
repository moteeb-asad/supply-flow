import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import tseslint from "typescript-eslint";

const nextRouterPath = {
  name: "next/router",
  message: "Use next/navigation in the App Router.",
};

const adminClientPath = {
  name: "@/src/db/supabaseAdmin",
  message:
    "The admin client bypasses RLS. Import it only in server actions or server folders.",
};

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
          paths: [nextRouterPath, adminClientPath],
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
          paths: [nextRouterPath],
        },
      ],
    },
  },
  {
    // UI files must not access the database or the network directly. Use a
    // hook (hooks/), a server action (actions/) or a server loader (server/).
    files: [
      "src/components/**",
      "src/features/**/components/**",
      "src/features/**/forms/**",
    ],
    rules: {
      // Flat config replaces this rule for these files, so the shared paths
      // are repeated here; leaving them out would drop the admin-client rule.
      "no-restricted-imports": [
        "error",
        {
          paths: [nextRouterPath, adminClientPath],
          patterns: [
            {
              group: ["@/src/db/*", "@supabase/*"],
              allowTypeImports: true,
              message:
                "No database access in UI. Move it into a hook, server action or server loader.",
            },
          ],
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.name='fetch']",
          message:
            "No fetch() in UI. Use a server action, server loader or React Query hook.",
        },
      ],
    },
  },
  prettier,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
