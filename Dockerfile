FROM node:20-alpine

WORKDIR /app

RUN apk update && apk upgrade && apk add --no-cache openssl

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

ENV PORT 80

EXPOSE $PORT

CMD ["npm", "start"]