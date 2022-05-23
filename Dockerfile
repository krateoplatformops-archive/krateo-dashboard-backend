# FROM node:14-buster
FROM bitnami/node:16

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

RUN pip3.8 install cookiecutter && \
    apt remove -y build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libsqlite3-dev libreadline-dev libffi-dev libbz2-dev python-pip python-dev && \
    rm -rf /var/cache/apt/* /tmp/Python-3.8.2
    
RUN pip3.8 install mkdocs-techdocs-core

# Copy repo skeleton first, to avoid unnecessary docker cache invalidation.
# The skeleton contains the package.json of each package in the monorepo,
# and along with yarn.lock and the root package.json, that's enough to run yarn install.
# ADD yarn.lock package.json skeleton.tar ./
COPY . .

RUN yarn

RUN useradd -g 0 krateobackend
RUN chown -R krateobackend:0 /usr/src/app
RUN chmod -R 770 /usr/src/app

RUN mkdir /temp
RUN chown -R krateobackend:0 /temp
RUN chmod -R 770 /temp

USER krateobackend

# This will copy the contents of the dist-workspace when running the build-image command.
# Do not use this Dockerfile outside of that command, as it will copy in the source code instead.

CMD ["npm", "run", "start-backend"]
