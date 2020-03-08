# import-map-deployer

Repo with `import-map-deployer` image that extends the official `singlespa` Docker Hub image `singlespa/import-map-deployer`.
The image contains a sample `conf.js` config file used when invoking `import-map-deployer`.

By default the web server listens to port `5000`

```sh
$ import-map-deployer conf.js
# ...
```

To run web server with custom port

```sh
$ PORT=8080 import-map-deployer conf.js
# ...
```

Clone this repo and create your own `conf.js` file where location entries point to actual GCP storage entries.

```js
{
  //...
  locations: {
    reactMf: 'google://react.microfrontends.app/importmap.json',
    //...
  }
}  
```

## importmap

Note that the image initially contains an empty `importmap.json` file.
You can push updates to the `importmap.json` storage entry (blob) via the `importmap-deployer` service.
