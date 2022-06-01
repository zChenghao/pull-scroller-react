const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'PullScroller',
      type: 'umd'
    }
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx']
  },
  externals: [
    {
      react: {
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'react',
        root: 'React'
      }
      // 'react-dom': {
      //   commonjs: 'react-dom',
      //   commonjs2: 'react-dom',
      //   amd: 'react-dom',
      //   root: 'ReactDOM'
      // }
    },
    '@better-scroll/core',
    '@better-scroll/pull-down',
    '@better-scroll/pull-up'
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true
          },
          format: {
            comments: false
          }
        },
        extractComments: false
      })
    ],
    usedExports: true
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  }
};
