const express = require('express')
const proxy = require('http-proxy-middleware')
const cosmiconfig = require('cosmiconfig')
const logger = require('parcel-bundler/src/Logger')

module.exports = async bundler => {
    const server = bundler.server
    if (!server) return

    let conf = await loadConfig()
    if (!conf) {
        logger.clear()
        logger.warn(`[parcel-plugin-server] "parcel-server" configuration was not found.`)
        return
    }

    conf = await normalizeConf(conf, bundler)
    const app = express()

    // detach parcelMiddleware for priority
    const [parcelMiddleware] = server.listeners('request')
    server.removeListener('request', parcelMiddleware)

    if (typeof conf.after === 'function') {
        conf.after(app, server)
    }

    if (Array.isArray(conf.proxy)) {
        conf.proxy
            .map(proxyConf => {
                const ctx = proxyConf.context
                delete proxyConf.context
                return proxy(ctx, proxyConf)
            })
            .forEach(middleware => app.use(middleware))
    }

    // reattach parcelMiddleware
    app.use(parcelMiddleware)

    server.on('request', app)
}

async function loadConfig () {
    const searched = await cosmiconfig('parcel-server').search()
    return (searched && searched.config)
}

async function normalizeConf (conf, bundler) {
    if (typeof conf === 'function') conf = conf(bundler)
    if (isThenable(conf)) conf = await conf

    conf = Object.assign({ after: noop, proxy: [] }, conf)

    if (!Array.isArray(conf.proxy)) {
        const proxy = typeof conf.proxy === 'function' ? conf.proxy() : Object(conf.proxy)

        conf.proxy = Object.entries(proxy).map(([k, v]) => {
            if (typeof v === 'string') v = { target: v }
            return Object.assign({ context: k, logProvider }, v)
        })
    }

    return conf
}

function noop () { }

function logProvider () {
    return require('./proxyLogger')
}

function isThenable (p) {
    return p && p.then && (typeof p.then === 'function')
}
