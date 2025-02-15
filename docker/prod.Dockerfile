# Stage 1: Build the application
FROM node:23.6.1-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY .. .

RUN npm run build

# Stage 2: Run the application
FROM builder

COPY --from=builder /app/.output ./.output

# Start the Nuxt application server directly
CMD [ "node", ".output/server/index.mjs" ]