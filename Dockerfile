FROM node:latest
WORKDIR /app
RUN npm install -g pnpm
COPY package*.json ./
RUN pnpm install
COPY . .
RUN pnpm run build
EXPOSE 3000
ENV PORT=3000
CMD ["pnpm","start"]