FROM --platform=linux/amd64 node:18-alpine

# Set the timezone
RUN apk add --no-cache tzdata
ENV TZ=America/Los_Angeles

EXPOSE 3000

WORKDIR /app
COPY . .

# ENV NODE_ENV=production

RUN npm install

RUN npm run build:prod

EXPOSE 3000

CMD ["npm", "run", "start:prod"]