import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    env: {
      NODE_ENV: 'test',
      LOG_LEVEL: 'silent',
      // Isola a suíte no banco school_test. Como database/index.js instancia a
      // conexão a partir de process.env.DATABASE e o dotenv usa override:false,
      // esta var vence o .env (school_local) sem tocar database.js.
      DATABASE: 'school_test',
      DEMO_LEVEL_ID: '99',
    },
  },
});
