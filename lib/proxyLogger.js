const logger = require('parcel-bundler/src/Logger')

const log = bindLogger('persistent')
const debug = bindLogger('verbose')
const warn = bindLogger('warn')
const error = bindLogger('error')

module.exports = { log, info: log, debug, warn, error }

function bindLogger (name) {
    return (...args) => {
        logger.clear()
        logger[name].apply(logger, args)
    }
}
