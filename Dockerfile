FROM nginx:alpine
RUN npm install && npm run build
COPY dist/velociraptor /usr/share/nginx/html
