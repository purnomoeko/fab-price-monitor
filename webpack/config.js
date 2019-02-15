const HtmlWebpackPlugin = require('html-webpack-plugin');
const Webpack = require('webpack');
const FaviconWebpack = require('favicons-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')


module.exports = (options) => {
    const config = {
        entry: './src/app.js',
        devtool: options.isProduction ? '' : 'source-map',
        output: {
            path: `${__dirname}/../dist`,
            filename: options.isProduction ? 'bundle.min.js' : 'bundle.js',
            publicPath: '/',
        },
        module: {
            rules: [
                { test: /\.css$/, loader: 'style-loader!css-loader' },
                {
                    test: /\.scss$/,
                    use: [
                        'style-loader', // creates style nodes from JS strings
                        'css-loader', // translates CSS into CommonJS
                        'sass-loader', // compiles Sass to CSS, using Node Sass by default
                    ],
                },
                {
                    test: /\.js|.jsx$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    query: { presets: ['es2017', 'react', 'stage-1'] },
                },
                {
                    test: /\.png$/,
                    loader: 'url-loader?limit=100000',
                },
                {
                    test: /\.jpg$/,
                    loader: 'file-loader',
                },
                {
                    test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'url-loader?limit=10000&mimetype=application/font-woff',
                },
                {
                    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'url-loader?limit=10000&mimetype=application/octet-stream',
                },
                {
                    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'file-loader?limit=10000',
                },
                {
                    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'url-loader?limit=10000&mimetype=image/svg+xml',
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({ template: './src/index.html', title: options.title || 'App', isProduction: options.isProduction }),
            new HtmlWebpackPlugin({ template: './src/404.html', filename: '404.html' }),
            new FaviconWebpack({
                logo: './src/logo.jpg',
            }),
        ],
    };
    if (options.isProduction) {
        config.plugins.push(new UglifyJsPlugin({
            uglifyOptions: {
                parse: {
                    // we want uglify-js to parse ecma 8 code. However we want it to output
                    // ecma 5 compliant code, to avoid issues with older browsers, this is
                    // whey we put `ecma: 5` to the compress and output section
                    // https://github.com/facebook/create-react-app/pull/4234
                    ecma: 8,
                },
                compress: {
                    ecma: 5,
                    warnings: false,
                    // Disabled because of an issue with Uglify breaking seemingly valid code:
                    // https://github.com/facebook/create-react-app/issues/2376
                    // Pending further investigation:
                    // https://github.com/mishoo/UglifyJS2/issues/2011
                    comparisons: false,
                },
                mangle: {
                    safari10: true,
                },
                output: {
                    ecma: 5,
                    comments: false,
                    // Turned on because emoji and regex is not minified properly using default
                    // https://github.com/facebook/create-react-app/issues/2488
                    ascii_only: true,
                },
            },
            // Use multi-process parallel running to improve the build speed
            // Default number of concurrent runs: os.cpus().length - 1
            parallel: true,
            // Enable file caching
            cache: true,
            sourceMap: false,
        }));
        config.plugins.push(new Webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"',
        }));
        config.plugins.push(new Webpack.NoEmitOnErrorsPlugin());
    } else {
        config.devServer = {
            proxy: {
                '/**': {
                    target: '/index.html',
                    secure: false,
                    bypass: (req, res, opt) => {
                        if (req.path.indexOf('/img/') !== -1 || req.path.indexOf('/public/') !== -1) {
                            return '/';
                        }
                        if (req.headers.accept) {
                            if (req.headers.accept.indexOf('html') !== -1) {
                                return '/index.html';
                            }
                        }
                    },
                },
            },
        };
    }
    return config;
};
