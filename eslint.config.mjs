import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextCoreWebVitals,
  {
    rules: {
      // Product and admin previews intentionally use native <img> because their
      // sources can be arbitrary CMS/storage URLs and some support onError fallback handling.
      "@next/next/no-img-element": "off",
    },
    ignores: [".next/**", "node_modules/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
