const express = require('express')
const proxy = require('http-proxy-middleware')
const cosmiconfig = require('cosmiconfig')

module.exports = async bundler => {
    const server = bundler.server
    if (!server) return

    const searched = await cosmiconfig('parcel-server').search()
    if (!searched) {
        console.log(`[parcel-plugin-server] "parcel-server" configuration was not found.`)
        return
    }

    const opts = searched.config || {}
    const app = express()

    const [parcelMiddleware] = server.listeners('request')
    server.removeAllListeners('request')

    if (typeof opts.after === 'function') {
        opts.after(app, server, bundler)
    }

    if (typeof opts.proxy === 'object') {
        opts.proxy = Object.entries(opts.proxy)
            .map(([k, v]) => {
                if (typeof v === 'string') v = { target: v }
                return Object.assign({ context: k }, v)
            })
    }

    if (Array.isArray(opts.proxy)) {
        opts.proxy
            .map(p => {
                const ctx = p.context
                delete p.context
                return proxy(ctx, p)
            })
            .forEach(pm => app.use(pm))
    }

    app.use(parcelMiddleware)
    server.on('request', app)
}
