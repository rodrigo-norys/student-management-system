require('dotenv').config();

const timezone = process.env.NODE_ENV === 'production'
  ? 'America/Sao_Paulo'
  : '-03:00';

const config = {
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT || 3306,
  dialect: 'mariadb',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  dialectOptions: {
    timezone: timezone,
  },
  timezone: timezone,
};

module.exports = {
  development: config,
  production: config,
  test: config,
};
