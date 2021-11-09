FROM node:14-alpine as react-build

WORKDIR /app
COPY . ./
RUN yarn
RUN yarn build

FROM node:14-buster
WORKDIR /usr/src/app
RUN cd /tmp && curl -O https://www.python.org/ftp/python/3.8.2/Python-3.8.2.tar.xz && \
    tar -xvf Python-3.8.2.tar.xz && \
    cd Python-3.8.2 && \
    ./configure --enable-optimizations && \
    make -j 4 && \
    make altinstall
RUN apt update
RUN apt install -y mkdocs
RUN pip3.8 install mkdocs-techdocs-core
RUN pip3.8 install cookiecutter && \
    apt remove -y build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libsqlite3-dev libreadline-dev libffi-dev libbz2-dev g++ python-pip python-dev && \
    rm -rf /var/cache/apt/* /tmp/Python-3.8.2

WORKDIR /app
COPY --from=react-build /app/packages/backend/dist/skeleton.tar.gz /app/package.json ./
COPY --from=react-build /app/packages/app/package.json ./packages/app/package.json
RUN tar xzf skeleton.tar.gz && rm skeleton.tar.gz

RUN yarn install --frozen-lockfile --production --network-timeout 300000 && rm -rf "$(yarn cache dir)"

COPY --from=react-build /app/packages/backend/dist/bundle.tar.gz /app/app-config.yaml ./
RUN tar xzf bundle.tar.gz && rm bundle.tar.gz

CMD ["node", "packages/backend", "--config", "app-config.yaml"]
