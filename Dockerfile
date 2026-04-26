# ---------- BUILD STAGE ----------
FROM node:20 AS build

WORKDIR /app

COPY . .

RUN npm install
RUN cd client && npm install && npm run build

# ---------- PRODUCTION STAGE ----------
FROM node:20

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/client/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]