# Zeppelin Connect Service

This is a light weight container to provide the capability to set a Zeppelin session
token passed on the url and redirect to the corresponding zeppelin instance.

The container must be hosted in the same subdomain as the Zeppelin instance in order to
have the ability to set the required cookie. This can be achieved using an Nginx proxy.

To run the development container:

```bash
docker build -t zeppelin-connect .

# Zeppelin
docker run -p XXXX:8000 -e CONNECT_TYPE=ZEPPELIN zeppelin-connect
curl -i "http://localhost:8000/connect?token=token"

# or RStudio
docker run -p XXXX:8000 -e CONNECT_TYPE=RSTUDIO zeppelin-connect
curl -i "http://localhost:8000/path/connect?username=username&expires=expires&token=token&csrfToken=csrf"

docker ps
docker stop <container name>
```

To run the DockerHub container:

```bash
docker run -d -p XXXX:8000 nerc/zeppelin-connect
```

To use the redirect use the url
[http://localhost:8000/connect?token=xxxx](http://localhost:8000/connect?token=xxxx).

To support debugging there is an additional url `noredirect` parameter that stops
the redirect.
