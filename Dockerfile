# FROM node:14-buster
FROM bitnami/node:16

# WORKDIR /app
WORKDIR /usr/src/app

RUN apt update
RUN apt install -y mkdocs make zlib1g-dev

# (workaround) Install cookiecutter and mkdocs to avoid the need to run docker in docker
RUN cd /tmp && curl -O https://www.python.org/ftp/python/3.8.2/Python-3.8.2.tar.xz && \
    tar -xvf Python-3.8.2.tar.xz && \
    cd Python-3.8.2 && \
    ./configure --enable-optimizations && \
    make -j 4 && \
    make altinstall

RUN pip3.8 install mkdocs-techdocs-core

RUN pip3.8 install cookiecutter && \
    apt remove -y build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libsqlite3-dev libreadline-dev libffi-dev libbz2-dev python-pip python-dev && \
    rm -rf /var/cache/apt/* /tmp/Python-3.8.2

# RUN curl -sL https://get.keptn.sh | KEPTN_VERSION=0.11.4 bash

# Copy repo skeleton first, to avoid unnecessary docker cache invalidation.
# The skeleton contains the package.json of each package in the monorepo,
# and along with yarn.lock and the root package.json, that's enough to run yarn install.
# ADD yarn.lock package.json skeleton.tar ./
COPY . .

RUN yarn

# This will copy the contents of the dist-workspace when running the build-image command.
# Do not use this Dockerfile outside of that command, as it will copy in the source code instead.

CMD ["npm", "run", "start-backend"]
# CMD ["node", "packages/backend", "--config", "app-config.yaml"]

# FROM node:14-alpine as react-build

# WORKDIR /app
# COPY . ./
# RUN yarn
# RUN yarn build

# FROM node:14-buster
# WORKDIR /usr/src/app
# # RUN cd /tmp && curl -O https://www.python.org/ftp/python/3.8.2/Python-3.8.2.tar.xz && \
# #     tar -xvf Python-3.8.2.tar.xz && \
# #     cd Python-3.8.2 && \
# #     ./configure --enable-optimizations && \
# #     make -j 4 && \
# #     make altinstall
# # RUN apt update
# # RUN apt install -y mkdocs
# # RUN pip3.8 install mkdocs-techdocs-core
# # RUN pip3.8 install cookiecutter && \
# #     apt remove -y build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libsqlite3-dev libreadline-dev libffi-dev libbz2-dev g++ python-pip python-dev && \
# #     rm -rf /var/cache/apt/* /tmp/Python-3.8.2
# RUN curl -sL https://get.keptn.sh | KEPTN_VERSION=0.11.3 bash

# WORKDIR /app
# COPY --from=react-build /app/packages/backend/dist/skeleton.tar.gz /app/package.json ./
# COPY --from=react-build /app/packages/app/package.json ./packages/app/package.json
# RUN tar xzf skeleton.tar.gz && rm skeleton.tar.gz

# RUN yarn install --frozen-lockfile --production --network-timeout 300000 && rm -rf "$(yarn cache dir)"

# COPY --from=react-build /app/packages/backend/dist/bundle.tar.gz /app/app-config.yaml ./
# RUN tar xzf bundle.tar.gz && rm bundle.tar.gz

# CMD ["node", "packages/backend", "--config", "app-config.yaml"]
