import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    // As suítes com banco compartilham as mesmas linhas do school_test; em
    // paralelo, o setup de uma recria fixtures enquanto a outra as lê.
    fileParallelism: false,
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
