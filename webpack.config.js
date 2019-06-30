const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const _ = require('lodash');

module.exports = (env) => {
    const config = {
        entry: [
            path.resolve(__dirname, 'src', 'public', 'js', 'client.js')
        ],
        output: {
            path: path.resolve(__dirname, 'src', 'public', 'js'),
            filename: 'index.bundle.min.js'
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader'
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'source-map-loader'
                        },
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    [
                                        '@babel/preset-env'
                                    ]
                                ]
                            }
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        'vue-style-loader',
                        'css-loader'
                    ]
                }
            ]
        },
        resolve: {
            extensions: ['.js', '.json', '.vue']
        },
        plugins: [
            new VueLoaderPlugin()
        ]
    };

    if (env.production) {
        _.merge(config, {
            mode: 'production',
            stats: 'minimal',
            externals: {
                'vue': 'Vue'
            }
        });
    } else if (env.development) {
        _.merge(config, {
            mode: 'development',
            devtool: 'source-map',
            resolve: {
                alias: {
                    'vue$': 'vue/dist/vue.js'
                }
            }
        });
    } else {
        throw new Error('Bad webpack env');
    }
    return config;
}