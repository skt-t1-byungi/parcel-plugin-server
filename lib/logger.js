const logger = require('parcel-bundler/src/Logger')

const log = bindLogger('persistent')
const debug = bindLogger('verbose')
const warn = bindLogger('warn')
const error = bindLogger('error')
const proxyLogger = { log, info: log, debug, warn, error }

exports.log = log
exports.warn = warn
exports.logProvider = () => proxyLogger

function bindLogger (name) {
    return (...args) => {
        logger.clear()
        logger[name].apply(logger, args)
    }
}
