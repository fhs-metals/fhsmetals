const htmlStandards = require('reshape-standard')
const cssStandards = require('spike-css-standards')
const jsStandards = require('spike-js-standards')
const pageId = require('spike-page-id')
const sugarml = require('sugarml')
const sugarss = require('sugarss')
const SpikeDatoCMS = require('spike-datocms')

const md = require('markdown-it')()

const env = process.env.SPIKE_ENV

const locals = {}

const render = prop => s => {
  s[prop] = md.render(s[prop])
  return s
}

module.exports = {
  devtool: 'source-map',
  entry: { index: './index.js' },
  matchers: { html: '*(**/)*.sgr', css: '*(**/)*.sss' },
  vendor: ['_redirects'],
  ignore: [
    'layout.sgr',
    'css/*',
    '**/.*',
    'readme.md',
    'yarn.lock',
    '.c9/**/*',
    'components/*.sss'
  ],

  dumpDirs: ['pages', 'components'],

  reshape: htmlStandards({
    parser: sugarml,
    locals: ctx => {
      locals.pageId = pageId(ctx)
      return locals
    },
    minify: true
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
          transform: c => {
            c.skills = c.skills.map(render('description'))
            c.classDescription = md.render(c.classDescription)
            return c
          },
          template: {
            path: 'pages/class-level.sgr',
            output: classLevel => `classes/${classLevel.slug}/index.html`
          }
        },
        {
          name: 'school',
          transform: s => {
            s.description = md.render(s.description)
            return s
          }
        },
        {
          name: 'teacher',
          transform: t => {
            t.bio = md.render(t.bio)
            return t
          }
        }
      ]
    })
  ]
}
