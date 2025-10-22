const asyncWraperMiddleware = (asynFn) => {
    return (req, res, next) => {
        asynFn(req, res, next).catch((error) => {
            next(error)
        })
    }
}
export { asyncWraperMiddleware };