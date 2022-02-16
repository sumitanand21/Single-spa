FROM nginx:latest
WORKDIR /usr/share/nginx/html
ADD nginx.conf /etc/nginx/nginx.conf
RUN rm -rf ./*
COPY ./dist .

ENTRYPOINT ["nginx","-g","daemon off;"]