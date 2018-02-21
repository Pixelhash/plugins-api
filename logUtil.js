const chalk = require('chalk');

function print(prefix, ...msg) {
    var date = new Date().toLocaleString();
    console.log(
        prefix + '\t' + chalk.gray(date) + '\t', ...msg
    );
}

module.exports = {
    info: function(...msg) {
        print(chalk.green.bold('[Info]'), ...msg);
    },

    server: function(...msg) {
        print(chalk.blue.bold('[Server]'), ...msg);
    },

    warn: function(...msg) {
        print(chalk.yellow.bold('[Warning]'), ...msg);
    },

    error: function(...msg) {
        print(chalk.red.bold('[Error]'), ...msg);
    }
};