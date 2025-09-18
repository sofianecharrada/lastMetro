FROM node:20-alpine

# mkdir /app
WORKDIR  /app

COPY package.json .

RUN npm install

COPY . .

ENV PORT=5000

EXPOSE 5000

CMD ["node", "server.js"]
