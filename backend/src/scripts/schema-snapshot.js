import 'dotenv/config';
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';

const OUTPUT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../../docs/database/schema.local.snapshot.sql',
);

const LIST_TABLES = `
  SELECT table_name AS name
  FROM information_schema.tables
  WHERE table_schema = ? AND table_type = 'BASE TABLE'
  ORDER BY table_name;
`;

// remove o contador AUTO_INCREMENT=N das opções da tabela (muda a cada insert)
const stripVolatile = (ddl) => ddl.replace(/ AUTO_INCREMENT=\d+/g, '');

async function main() {
  const database = process.env.DATABASE;
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT) || 3306,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database,
  });

  try {
    const [tables] = await connection.query(LIST_TABLES, [database]);

    const blocks = [];
    for (const { name } of tables) {
      const [rows] = await connection.query('SHOW CREATE TABLE ??', [name]);
      blocks.push(`${stripVolatile(rows[0]['Create Table'])};`);
    }

    const header = [
      `-- Schema snapshot (read-only) — database: ${database}`,
      '-- Gerado por: npm run db:schema:snapshot (backend/src/scripts/schema-snapshot.js)',
      '-- Determinístico (sem timestamp/AUTO_INCREMENT). Não editar à mão — regenerar.',
      `-- Tabelas: ${tables.length}`,
    ].join('\n');

    const output = `${header}\n\n${blocks.join('\n\n')}\n`;

    await mkdir(dirname(OUTPUT), { recursive: true });
    await writeFile(OUTPUT, output, 'utf8');

    console.log(`schema-snapshot: ${tables.length} tabelas → ${OUTPUT}`);
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error(`schema-snapshot: falhou — ${error.message}`);
  process.exitCode = 1;
});
