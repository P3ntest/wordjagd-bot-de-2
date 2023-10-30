FROM node:19-alpine3.17
WORKDIR /app
RUN npm install -g pnpm

# Copy from root dir
COPY package*.json ./

# Copy from /client dir
COPY client/package*.json ./client/

RUN pnpm install
RUN pnpm install --prefix client

COPY . .
RUN pnpm run build
EXPOSE 3000
ENV PORT=3000
CMD ["pnpm","start"]
