FROM nginx:alpine

# Copy all game files to the nginx default public directory
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80
