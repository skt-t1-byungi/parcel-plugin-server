# @skt-t1-byungi/parcel-plugin-server
A parcel plugin to setup express server app.
> WIP

## Usage
`parcel-server.config.js` - located at package root.
```js
module.exports = {
    after(app, server, bundler){
        app.get('script.js', (req, res) => {
            const js = [...bundler.bundleHashes.keys()].find(s => s.endsWith('.js'))
            res.sendFile(js)
        })
    },
    proxy: {
        '/api/*': 'http://example.org'
    }
}
```

## License
MIT
