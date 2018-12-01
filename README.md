# @skt-t1-byungi/parcel-plugin-server
Parcel plugin for dev server setting.

> WIP

## Usage
`parcel-server.config.js`
```js
module.exports = bundler => ({
    after(app, server){
        app.get('script.js', (req, res) => {
            const js = [...bundler.bundleHashes.keys()].find(s => s.endsWith('.js'))
            res.sendFile(js)
        })
    },
    proxy: {
        '/api/*': 'http://example.org'
    }
})
```

## License
MIT
