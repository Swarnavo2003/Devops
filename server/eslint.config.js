export default [
  {
    files: ['**/*.js'], // only check .js files in server directory
    rules: {
      semi: 'error', // enforce semicolons
      'no-unused-vars': 'warn', // warn if variables are unused
    },
  },
];
