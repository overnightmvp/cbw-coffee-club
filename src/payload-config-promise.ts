import config from './payload.config'

// Simply wrap the config in a Promise for Payload admin routes
export default Promise.resolve(config)
