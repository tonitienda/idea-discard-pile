const { config } = require("dotenv");
config(); // This loads the .env file

module.exports = {
  dev: {
    driver: "pg",
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    schema: process.env.POSTGRES_SCHEMA,
    ssl: {
      rejectUnauthorized: false,
    },
  },
  staging: {
    driver: "pg",
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    schema: process.env.POSTGRES_SCHEMA,
    ssl: {
      rejectUnauthorized: false,
    },
  },
  production: {
    driver: "pg",
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    schema: process.env.POSTGRES_SCHEMA,
    ssl: {
      rejectUnauthorized: false,
    },
  },
};
