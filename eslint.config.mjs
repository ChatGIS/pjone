import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettier from 'eslint-plugin-prettier'


export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,vue}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.{js,mjs,cjs,vue}"], languageOptions: { globals: globals.browser } },
  pluginVue.configs["flat/essential"],
  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      ...eslintConfigPrettier.rules,
      'prettier/prettier': 'error',
    },
  }
]);
