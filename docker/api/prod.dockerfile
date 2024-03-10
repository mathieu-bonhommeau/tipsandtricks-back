FROM node:18-alpine

RUN apk update && \
    apk add --no-cache bash curl git

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash && \
    echo 'export NVM_DIR="/root/.nvm"' >> /root/.bashrc && \
    echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> /root/.bashrc && \
    echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> /root/.bashrc

ENV NVM_DIR /root/.nvm
ENV NODE_VERSION 18.13.0

RUN . $NVM_DIR/nvm.sh && \
    nvm install $NODE_VERSION && \
    nvm alias default $NODE_VERSION

EXPOSE 5000

WORKDIR /app
RUN pwd && ls -la

COPY ../../. .

RUN pwd && ls -la

CMD npm install && npm run build && npm run start-prod

