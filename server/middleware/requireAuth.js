const jwt = require('jsonwebtoken')

const requireAuth = (req, res, next) => {
    // get the token from headers
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ error: 'Authorization token required' })
    }

    // Bearer token format: "Bearer <token>"
    const token = authorization.split(' ')[1]

    try {
        const { _id } = jwt.verify(token, "adobojwtformyacff")
        req.user = { _id }
        next()
    } catch (error) {
        res.status(401).json({ error: 'Request is not authorized' })
    }
}

module.exports = requireAuth
