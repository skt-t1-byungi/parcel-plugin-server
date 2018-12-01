# @skt-t1-byungi/parcel-plugin-server
A parcel plugin to setup express server app.

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
