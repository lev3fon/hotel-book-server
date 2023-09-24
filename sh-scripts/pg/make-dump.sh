 docker exec hotel-book-pg pg_dump postgres -U postgres -c > ../../db-dumps/dump_`date +%Y-%m-%d"_"%H_%M_%S`.sql
