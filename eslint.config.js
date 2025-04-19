// import { defineConfig } from '@soybeanjs/eslint-config';

console.log('4324324');


export default [

  {
    // vue: true,
    // unocss: true,
    overrides: [
      {
        files: ['./scripts/*.ts'],
        rules: {
          'no-unused-expressions': 'off'
        }
      },
      {
        files: ['*.vue'],
        rules: {
          'no-undef': 'off',
          'vue/no-setup-props-destructure': 'off',
          '@typescript-eslint/no-use-before-define': 'off',
          '@typescript-eslint/no-unused-vars': 'warn',
          'vue/no-undef-properties': 'warn',
          'vue/multi-word-component-names': 'off',
          'vue/component-name-in-template-casing': 'off'
        }
      },

      {
        files: ['*.vue', '*.ts', '*.js'],
        rules: {
          'prettier/prettier': [
            1,
            {
              printWidth: 120,
              tabWidth: 2,
              useTabs: false,
              semi: false,
              singleQuote: true,
              quoteProps: 'as-needed',
              jsxSingleQuote: false,
              trailingComma: 'none',
              bracketSpacing: true,
              bracketSameLine: false,
              arrowParens: 'avoid',
              rangeStart: 0,
              rangeEnd: Number.POSITIVE_INFINITY,
              requirePragma: false,
              insertPragma: false,
              proseWrap: 'preserve',
              htmlWhitespaceSensitivity: 'ignore',
              vueIndentScriptAndStyle: false,
              endOfLine: 'lf',
              embeddedLanguageFormatting: 'auto',
              singleAttributePerLine: false
            }
          ]
        }
      }
    ]
  },

  {
    rules: {
      'array-callback-return': 'off',
      'import/order': 'off',
      'vue/prefer-true-attribute-shorthand': 'off',
      'no-console': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/component-name-in-template-casing': 'off'
    },
    settings: {
      'import/core-modules': ['uno.css', '~icons/*', 'virtual:svg-icons-register']
    }
  }
];

console.log('4324324');
