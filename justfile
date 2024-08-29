@add-migration name:
     npx db-migrate create $0 --sql-file --config database.js

migration-up:
    source .env.local set
    npx db-migrate up --config database.local.js -e dev