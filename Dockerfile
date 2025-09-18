FROM node:20-alpine

# mkdir /app
WORKDIR  /app

COPY package.json .

RUN npm install

COPY server.js .

ENV PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]
