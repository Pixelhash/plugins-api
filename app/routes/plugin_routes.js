const log = require('../../logUtil');
const shortid = require('shortid');

module.exports = function(app, db) {

    // Global route
    app.get('/', (req, res) => {
        res.json({ name: 'CodeHat\'s Plugin API', version: process.env.npm_package_version || 'Unknown' });
    });

    // Return all plugins
    app.get('/plugins', (req, res) => {
        res.json(db.get('plugins').value());
    });

    // Get plugin by ID
    app.get('/plugins/:id', (req, res) => {
        const plugin = db.get('plugins')
            .find({ id: req.params.id })
            .value();

        // Check if plugin exists
        if (plugin) {
            res.json({
                status: 'success',
                data: plugin
            });
        } else {
            res.json({ status: 'error', message: 'Plugin with given ID not found' });
        }
    });

    // Create plugin
    app.post('/plugins', (req, res) => {
        const plugin = {
            id: shortid.generate(),
            name: req.body.name,
            version: req.body.version,
            url: req.body.url,
            updated_at: new Date().toLocaleString()
        };

        db.get('plugins')
            .push(plugin)
            .write();

        res.json({ status: 'success', id: plugin.id });
    });

    // Delete plugin
    app.delete('/plugins/:id', function(req, res) {
        const id = req.params.id;
        const plugins = db.get('plugins')
            .remove({ id: id })
            .write();
        
        if (plugins.length !== 0) {
            res.json({ status: 'success' });
        } else {
            res.json({ status: 'error', message: 'Plugin with given ID not found'});
        }
    });

    // Update plugin
    app.put('/plugins/:id', function(req, res) {
        const id = req.params.id;
        const plugins = db.get('plugins')
            .find({ id: id })
            .assign({ version: req.body.version })
            .write();

        if ('id' in plugins) {
            res.json({ status: 'success' });
        } else {
            res.json({ status: 'error', message: 'Plugin with given ID not found'});
        }
    });

};