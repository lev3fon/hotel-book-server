FROM node:18-alpine


WORKDIR /app
COPY package.json package.json
COPY src src
COPY db-migrations db-migrations
COPY db-seeders db-seeders
COPY .sequelizerc .sequelizerc
COPY tsconfig.json tsconfig.json

RUN npm install
RUN npm run build

CMD ["npm", "run", "start"]
