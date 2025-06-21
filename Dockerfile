# === Stage 1: Build ===
FROM node:18-alpine AS builder

ENV NODE_ENV=build
WORKDIR /home/node

RUN apk add --no-cache g++ make py3-pip git

COPY package*.json ./
RUN npm ci
RUN npm install movex-server movex-service

COPY . .

RUN npx movex build

# === Stage 2: Runtime ===
FROM node:18-alpine

ENV NODE_ENV=production
WORKDIR /home/node

EXPOSE 3333

COPY --from=builder /home/node/local ./local/
COPY --from=builder /home/node/node_modules/ ./node_modules/
COPY --from=builder /home/node/dist/ ./dist/
COPY --from=builder /home/node/runner.js ./

ENTRYPOINT ["node", "runner.js"]
