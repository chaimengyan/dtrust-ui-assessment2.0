FROM registry.cn-hangzhou.aliyuncs.com/yjhu/nginx

COPY ./dist /data

RUN rm /etc/nginx/conf.d/default.conf

ADD dtrust-ui-assets.conf /etc/nginx/conf.d/

RUN /bin/bash -c 'echo init ok'
