module.exports = {
  username: process.env.HTTP_USERNAME,
  password: process.env.HTTP_PASSWORD,
  manifestFormat: 'importmap',
  locations: {
    reactMf: 'gs://react.microfrontends.app/importmap.json',
    vueMf: 'gs://vue.microfrontends.app/importmap.json',
    polyglotMf: 'gs://polyglot.microfrontends.app/importmap.json',
    angularMf: 'gs://angular.microfrontends.app/importmap.json'
  }
};