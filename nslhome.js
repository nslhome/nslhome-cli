#!/usr/bin/env node

var pkg = require('./package.json');
var program = require('commander');
const child = require('child_process');
var path = require('path');

var find_forever = function(app, next) {
    var regex = new RegExp("\\[(\\d+)\\].*?" + app, "i");

    child.exec('forever list', function(err, stdout) {
        if (err)
            return next(err);

        var match = regex.exec(stdout);
        if (match != null) {
            next(null, match[1]);
        } else {
            next(null, null);
        }
    });
};

var find_provider = function(provider, next) {
    find_forever("nslhome-provider\\.js " + provider, next);
};

var find_webserver = function(next) {
    find_forever("webserver\\.js", next);
};


program
    .version(pkg.version);

program
    .command('status')
    .description('lists currently running components')
    .action(function() {
        child.exec('forever list', function(err, stdout) {
            console.log("Running components:");
            var regex = /(nslhome[^\\]*?)\s+\d+/ig;
            var match = regex.exec(stdout);
            while (match != null) {
                console.log("  " + match[1].replace(".js", ""));
                match = regex.exec(stdout);
            }
        });
    });

program
    .command('start-provider [name]')
    .description('start provider for the specified config')
    .action(function(name) {
        console.log("Starting provider '" + name + "' with forever");
        find_provider(name, function(err, id) {
            if (id !== null)
                return console.log("Provider already running");

            child.exec('forever start nslhome-provider.js ' + name, {cwd: __dirname}, function(err, stdout) {
                if (err)
                    console.error(err);
                console.log(stdout);
            });
        });
    });

program
    .command('stop-provider [name]')
    .description('stop provider for the specified config')
    .action(function(name) {
        console.log("Stopping provider '" + name + "' with forever");
        find_provider(name, function(err, id) {
            if (id === null)
                return console.log("Provider not running");

            child.exec('forever stop ' + id, function(err, stdout) {
                if (err)
                    console.error(err);
                console.log(stdout);
            });
        });
});

program
    .command('start-webserver')
    .description('start nslhome webserver')
    .action(function() {
        console.log("Starting webserver with forever");
        find_webserver(function(err, id) {
            if (id !== null)
                return console.log("Webserver already running");

            child.exec('forever start webserver.js', {cwd: path.join(__dirname, 'node_modules', 'nslhome-webserver')}, function (err, stdout) {
                if (err)
                    console.error(err);
                console.log(stdout);
            });
        });
    });

program
    .command('stop-webserver')
    .description('stop nslhome webserver')
    .action(function() {
        console.log("Stopping webserver with forever");
        find_webserver(function(err, id) {
            child.exec('forever stop ' + id, function(err, stdout) {
                if (err)
                    console.error(err);
                console.log(stdout);
            });

        });
    });


program.parse(process.argv);


if (!process.argv.slice(2).length) {
    program.help();
}


/*
nslhome start-provider ozw1     (shortcut for 'forever start nslhome-provider ozw1')
nslhome start-all-providers     (enumerate all providers and start each one with forever)
nslhome start-webserver         (shortcut for 'forever start nslhome-webserver')

nslhome stop-provider ozw1      (shortcut for 'forever stop nslhome-provider ozw1')
nslhome stop-all-providers      (stop all providers in forever)
nslhome stop-webserver          (stops the webserver in forever)

nslhome-provider ozw1           (actually runs the provider in this process)
nslhome-webserver               (runs the webserver in this process)
*/