#!/usr/bin/env node

var pkg = require('./package.json');
var core = require('nslhome-core');
var program = require('commander');

program
    .version(pkg.version);

program
    .arguments('<provider-name>')
    .action(function(providerName) {
        console.log("Launching provider " + providerName);

        // lookup provider by name
        core.Mongo.open(function(err, db) {
            if (err)
                return console.error(err);

            db.providers.find({'name': providerName}).limit(1).next(function(err, provider) {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }

                if (provider === null) {
                    console.error(new Error("Invalid provider name"));
                    process.exit(1);
                }

                // require & run the module
                try {
                    // first try as a stand-alone module
                    require(provider.provider)(providerName);
                }
                catch (e) {
                    // next look for module in misc-providers
                    require('nslhome-misc-providers')[provider.provider](providerName);
                }
            });
        });
    });


program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.help();
}
