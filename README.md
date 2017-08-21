# RDCYIS

This is the git repo for the Regional Drought and Crop Yield Information System (RDCYIS) developed by the SERVIR Mekong Team based on Asian Disaster Preparedness Center (ADPC), Bangkok.

The repo makes use of the PostgreSQL, Express JS, Angular JS and Node JS.

## Before You Begin

Before you begin we recommend you read about the basic building blocks of the application:
* PostgreSQL - Go through [PostegreSQL Official Website](http://www.postgresql.org/) and proceed to their [Official Documentation](http://www.postgresql.org/docs/), which should help you understand PostgreSQL better.
* Express - The best way to understand express is through its [Official Website](http://expressjs.com/), which has a [Getting Started](http://expressjs.com/starter/installing.html) guide, as well as an [ExpressJS Guide](http://expressjs.com/guide/error-handling.html) guide for general express topics.
* AngularJS - Angular's [Official Website](http://angularjs.org/) is a great starting point.
* Node.js - Start by going through [Node.js Official Website](http://nodejs.org/), which should get you going with the Node.js.


## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:
* Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
* PostgreSQL - [Download & Install PostegreSQL](http://www.postgresql.org/download/).
* Ruby - [Download & Install Ruby](https://www.ruby-lang.org/en/documentation/installation/)
* Bower - You're going to use the [Bower Package Manager](http://bower.io/) to manage your front-end packages. Make sure you've installed Node.js and npm first, then install bower globally using npm:

```bash
$ npm install -g bower
```

* Gulp - We use Gulp for Live Reload, Linting, and SASS or LESS.

```bash
$ npm install gulp -g
```

## Downloading

### Cloning The GitHub Repository
The recommended way to use git to directly clone the repository:

```bash
$ git clone https://github.com/Servir-Mekong/Drought-And-Crop-Yield.git rheas
```

This will clone the latest version to a **rheas** folder.

### Downloading The Repository Zip File
Another way to use the application is to download a zip copy from the [master branch on GitHub](https://github.com/Servir-Mekong/Drought-And-Crop-Yield/archive/master.zip). You can also do this using `wget` command:

```bash
$ wget https://github.com/Servir-Mekong/Drought-And-Crop-Yield/archive/master.zip -O rheas.zip; unzip rheas.zip; rm rheas.zip
```

## Quick Install

The first thing you should do is install the Node.js dependencies. The boilerplate comes pre-bundled with a package.json file that contains the list of modules you need to start your application.

To install Node.js dependencies you're going to use npm again. In the application folder, run this from the command-line:

```bash
$ npm install
```

This command does a few things:
* First it will install the dependencies needed for the application to run.
* If you're running in a development environment, it will then also install development dependencies.
* Finally, when the install process is over, npm will initiate a bower install command to install all the front-end modules needed for the application.

## Running Your Application
The first thing you will need to do is supply your PostgreSQL credentials for your RHEAS model.

To do this, duplicate 'config/env/local.example.js' and rename the file 'config/env/local-development.js' (as instructed in the example file itself). 

Uncomment 'module.exports' in the 'local-development.js' file you just created and replace the 'db.options' properties with RHEAS PostgreSQL database name, username and password.  

If you encounter any problems, try the Troubleshooting section.

* Explore `config/env/development.js` for development environment configuration options.
* Set 'force' to 'false' if you want to preserve your table data on server restart.  

### Running the application with Gulp

To run the application, execute gulp as follows:

```bash
$ gulp
```
or

```bash
$ gulp default
```

The server is now running on http://localhost:3000 if you are using the default settings.

* Explore `config/env/production.js` for production environment configuration options.


## Credits
Inspired by the great work of MEAN and PEAN. We would like to express our deep gratitude for the awesome work!

 * Please note that some library has been changed. For example: we use pg-promise instead of sequelize to handle postgres operations! Go through source code to find more!

## Understanding MEAN and PEAN
You have your application running, but there is a lot of stuff to understand. We recommend you go over the [Official MEAN Documentation](http://meanjs.org/docs.html) or [PEAN website](http://peanjs.org/).