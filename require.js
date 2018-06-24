module.exports =
global.requireRoot =
function requireRoot (resource) {
  return require(`${__dirname}/${resource}`)
}
