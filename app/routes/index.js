const pluginRoutes = require('./plugin_routes');

module.exports = function(app, db) {
    pluginRoutes(app, db);
    // Other routes later here
};