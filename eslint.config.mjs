import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      // Turn off overly aggressive experimental React 19 hook & compiler lint rules
      'react-hooks/purity': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/immutability': 'off'
    }
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'tsconfig.tsbuildinfo'
  ]),
]);

export default eslintConfig;
