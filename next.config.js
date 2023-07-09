const {i18n} = require('./next-i18next.config');

module.exports = {
    reactStrictMode: false,
    output: 'standalone',
    i18n,

    async redirects() {
        return [
            {
                source: '/pinInput',
                destination: '/pin',
                permanent: true
            }
        ]
    }
};
