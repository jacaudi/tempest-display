FROM nginx:1.27-alpine

# Remove the default server block
RUN rm /etc/nginx/conf.d/default.conf

# Install our caching proxy config
COPY radar-cache.conf /etc/nginx/conf.d/radar-cache.conf
