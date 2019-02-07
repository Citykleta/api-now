export = {
    port: process.env.POSTGRES_PORT || 5432,
    host: process.env.POSTGRES_HOST || '127.0.0.1',
    user: process.env.POSTGRES_USER || 'docker',
    password: process.env.POSTGRES_PASSWORD || 'docker',
    database: process.env.POSTGRES_DB || 'osm-havana'
};
