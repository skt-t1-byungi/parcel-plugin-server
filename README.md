# @skt-t1-byungi/parcel-plugin-server
Parcel plugin for dev server setting.

## Install
```sh
yarn add @skt-t1-byungi/parcel-plugin-server --dev
```

## Usage
Write the configuration file to the root of the package.

`package/parcel-server.config.js`
```js
module.exports = bundler => ({
    after(app, server){
        app.get('/script.js', (req, res) => {
            const js = [...bundler.bundleHashes.keys()].find(s => s.endsWith('.js'))
            res.sendFile(js)
        })
    },
    proxy: {
        '/api/*': 'http://example.org'
    }
})
```

Run parcel bundler as usual.

`package/package.json`
```json
{
    "scripts": {
        "dev": "parcel src/index.html  -d build --port 3000"
    }
}
```
```sh
yarn run dev
```

## License
MIT
