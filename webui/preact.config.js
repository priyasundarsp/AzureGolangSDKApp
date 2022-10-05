module.exports = function (config) {

    config.devServer.proxy = [
        {
            // proxy requests matching a pattern:
            path: '/api/v1/**',

            // where to proxy to:
            target: 'http://localhost:8000/',

        }
    ];

};