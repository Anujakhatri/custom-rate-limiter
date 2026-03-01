FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Ensure the database file exists and is writable if it exists in the repo
RUN touch database.db && chmod 666 database.db

EXPOSE 3000

CMD ["npm", "start"]
