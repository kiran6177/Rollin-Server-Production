FROM node:18

WORKDIR /app

COPY package.json .

RUN npm install

RUN apt-get update && apt-get install -y \
    libnss3 \
    libatk-bridge2.0-0 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxi6 \
    libxtst6 \
    libatk1.0-0 \
    libcups2 \
    libxrandr2 \
    libasound2 \
    libpangocairo-1.0-0 \
    libxshmfence1 \
    libgbm-dev \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libnss3-dev \
    wget \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

COPY . .

CMD [ "npm","start" ]