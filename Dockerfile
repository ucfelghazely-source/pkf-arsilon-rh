FROM nginx:alpine

# Copier la config nginx
COPY railway.conf /etc/nginx/templates/default.conf.template

# Copier l'application HTML
COPY index.html.html /usr/share/nginx/html/index.html

# Exposer le port Railway
ENV PORT=8080
EXPOSE 8080

CMD ["/bin/sh", "-c", "envsubst '$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
