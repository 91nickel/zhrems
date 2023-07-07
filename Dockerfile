FROM node:18.15.0

COPY client/package.json /app/client/package.json
COPY client/package-lock.json /app/client/package-lock.json
COPY server/package.json /app/server/package.json
COPY server/package-lock.json /app/server/package-lock.json

WORKDIR /app/client
RUN npm install

WORKDIR /app/server
RUN npm install

COPY client /app/client
COPY server /app/server

WORKDIR /app/client
RUN npm run build
RUN mv /app/client/build /app/server/client && rm -rd /app/client
COPY production.json /app/server/config/production.json

WORKDIR /app/server

ENV PORT=3000

EXPOSE 3000

CMD ['npm', 'start']
