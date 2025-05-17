FROM --platform=linux/amd64 nginx:alpine

# Remove default nginx configuration
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy application files
COPY dist /usr/share/nginx/html/

EXPOSE 80 443
ENTRYPOINT ["nginx", "-g", "daemon off;"]
