FROM node:14 as modules
WORKDIR /app
COPY /package.json ./
RUN npm install --silent

FROM modules as base
COPY /.serverless ./.serverless
COPY /src ./src
COPY /serverless.yml ./

FROM base as tests
COPY /__tests__ ./__tests__
COPY /jest* ./