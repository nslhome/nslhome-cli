NslHome Command Line Tools
=========

Command line tools for managing an nslhome environment.

## Installation

`npm install -g nslhome/nslhome-cli`

MongoDB and RabbitMQ configuration should be provided via the environment variables `NSLHOME_MONGO_URL` and `NSLHOME_RABBIT_URL`.

You can optionally use the file `.nslhome.config` to store your configuration.
```
{
    "NSLHOME_MONGO_URL": "mongodb://HOST/DATABASE",
    "NSLHOME_RABBIT_URL": "amqp://USERNAME:PASSWORD@HOST"
}
```

Note: Usage of the various start/stop commands expects that 'forever' is installed globally.

## Basic Usage

Start a provider in the background using **forever**.
```
$ nslhome start-provider [providerName]
```

Stop a provider that was started with the previous command.
```
$ nslhome stop-provider [providerName]
```

Run a provider in the foreground
```
nslhome-provider [providerName]
```



## Release History

1.0.0
* Initial Release