const htmlStandards = require('reshape-standard')
const cssStandards = require('spike-css-standards')
const jsStandards = require('spike-js-standards')
const pageId = require('spike-page-id')
const sugarml = require('sugarml')
const sugarss = require('sugarss')
const SpikeDatoCMS = require('spike-datocms')

const env = process.env.SPIKE_ENV

const locals = {}

module.exports = {
  devtool: 'source-map',
  matchers: { html: '*(**/)*.sgr', css: '*(**/)*.sss' },
  vendor: ['_redirects'],
  ignore: [
    '**/layout.sgr',
    '**/*/_*',
    '**/.*',
    'readme.md',
    'yarn.lock',
    '.c9/**/*'
  ],

  reshape: htmlStandards({
    parser: sugarml,
    locals: ctx => {
      locals.pageId = pageId(ctx)
      return locals
    },
    minify: env === 'production'
  }),

  postcss: cssStandards({
    parser: sugarss,
    minify: env === 'production',
    warnForDuplicates: env !== 'production'
  }),

  babel: jsStandards(),

  plugins: [
    new SpikeDatoCMS({
      addDataTo: locals,
      token: '2e9b95b0328903c6d9acdf25665510',
      models: [
        {
          name: 'class_level',
          template: {
            path: 'views/class-level.sgr',
            output: classLevel => `classes/${classLevel.slug}/index.html`
          }
        }
      ]
    })
  ]
}
