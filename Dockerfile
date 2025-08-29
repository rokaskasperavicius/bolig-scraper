FROM node:24.1.0

# Install necessary dependencies for Puppeteer and Chromium
RUN apt-get update \
  && apt-get install -y chromium \
  fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
  --no-install-recommends

USER node

WORKDIR /app

COPY --chown=node package.json .
COPY --chown=node package-lock.json .

# Puppeteer setup: Skip Chromium download and use the installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium

RUN npm install

COPY --chown=node . .

EXPOSE 3000

CMD ["npm", "start"]