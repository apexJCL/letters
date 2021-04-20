module.exports = {
    webpack: (config, {buildId, dev, isServer, defaultLoaders, webpack}) => {
        config.module.rules.push({
            test: /\.(png|jpg|gif)$/i,
            use: [
                {
                    loader: 'file-loader',
                },
            ],
        });

        return config
    },
}
