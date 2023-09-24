docker run -d -p 5432:5432 \
  -e POSTGRES_PASSWORD=12345 \
  -e PGDATA=/var/lib/postgresql/data/pgdata \
  -v $PWD/../../db-data/pgdata:/var/lib/postgresql/data \
  --name hotel-book-pg \
  postgres:15.2-alpine
