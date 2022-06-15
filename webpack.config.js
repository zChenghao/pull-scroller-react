const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.ts'
    // components: {
    //   import:'./src/PullScroller/components/index.ts',
    //   filename:'PullScroller/components/index.js'
    // }
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'PullScroller',
      type: 'umd'
    }
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  externals: [
    {
      react: {
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'react',
        root: 'React'
      },
      '@better-scroll/core': {
        commonjs: '@better-scroll/core',
        commonjs2: '@better-scroll/core',
        amd: '@better-scroll/core',
        root: 'BScroll'
      }
    },
    // '@better-scroll/core',
    '@better-scroll/pull-down',
    '@better-scroll/pull-up',
    '@better-scroll/observe-image'
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
          },
          // keep_fnames: true
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
