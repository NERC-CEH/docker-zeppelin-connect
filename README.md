# Zeppelin Connect Service

This is a light weight container to provide the capability to set a Zeppelin session
token passed on the url and redirect to the corresponding zeppelin instance.

The container must be hosted in the same subdomain as the Zeppelin instance in order to
have the ability to set the required cookie. This can be achieved using a Traefik or 
Nginx proxy.

To run the container:

```
docker run -d -p XXXX:8000 nerc/zeppelin-connect
```

To use the redirect use the url
[http://localhost:8000?token=xxxx](http://localhost:8000?token=xxxx).

To support debugging there is an additional url `noredirect` parameter that stops 
the redirect.