Here's an example config file for NGINX:

It assumes several things:
1. HTTP traffic is accepted, but is redirected to HTTPS
2. HSTS (strictly permit HTTPS only) is enabled. You might wish to increase the timer significantly over 3600 (one hour), which is more appropriate for testing environment only.
3. You probably want to save traffic and errors to separate files.


```nginx
server {
  listen 80;
  listen [::]:80;
  server_name your.server.name;

  # Discourage deep links by using a permanent redirect to home page of HTTPS site
  return 301 https://$host;

  # Alternatively, redirect all HTTP links to the matching HTTPS page 
  # return 301 https://$host$request_uri;
}


server {
  # SSL configuration
  listen 443 ssl;
  listen [::]:443 ssl;
  ssl_certificate     /etc/letsencrypt/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/privkey.pem;

  add_header Strict-Transport-Security "max-age=3600; includeSubDomains" always;

  root /home/hevelius/public_html;

  index index.html;

  server_name your.server.name;

  access_log /path/to/logs/nginx-access.log;
  error_log  /path/to/logs/nginx-error.log info;

  location / {
    # First attempt to serve request as file, then
    # as directory, then fall back to displaying index.html.
    # The last one is important, it's needed in order to serve
    # Angular routes--e.g.,'localhost:8080/customer' will serve
    # the index.html file
    try_files $uri $uri/ /index.html;
  }
}
```
How you use this snippet is entirely up to your preference. Typically, it's put in `/etc/nginx/sites-available` and then linked from `/etc/nginx/sites-enabled`.
