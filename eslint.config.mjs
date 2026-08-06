import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // eslint-config-next already registers the jsx-a11y plugin itself (so we
  // can't re-spread flatConfigs.recommended — it redefines the "plugins"
  // key) but doesn't turn on its full recommended rule set. Apply just the
  // rules so a11y regressions (missing alt text, unlabeled inputs, etc.)
  // fail lint.
  {
    rules: jsxA11y.flatConfigs.recommended.rules,
  },
  {
    rules: {
      // Our shared <Input> wraps a real <input> and nests it inside the
      // <label> it renders when given a `label` prop — the rule doesn't
      // know that by default since Input isn't a native element.
      "jsx-a11y/label-has-associated-control": [
        "error",
        { controlComponents: ["Input"], assert: "either" },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "supabase/**",
  ]),
]);

export default eslintConfig;
