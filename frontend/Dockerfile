FROM node AS build

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

ARG REACT_APP_CLIENT_ID
ARG REACT_APP_MAPS_API_KEY
ARG REACT_APP_MAP_ID

ENV REACT_APP_CLIENT_ID=${REACT_APP_CLIENT_ID}
ENV REACT_APP_MAPS_API_KEY=${REACT_APP_MAPS_API_KEY}
ENV REACT_APP_MAP_ID=${REACT_APP_MAP_ID}


RUN npm run build


FROM node:18-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/build /app

EXPOSE 3000 

CMD ["serve", "-s", ".", "-l", "3000"]