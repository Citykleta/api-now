export default Object.freeze({
    origin: process.env.CORS_ORIGIN || '*',
    maxAge: 24 * 3600
});
