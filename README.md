# React, Firebase app boilerplate

This repository is purposed to make developer easier to start project with react and firebase. This repo also
bundled with bunch of frontend library like redux, webpack etc. and also the theme of the boilerplate is using gentellala built on top of bootstrap framework.

> [React](https://www.firebase.com) A javascript library for building user interfaces

## What's include?
* [react](https://github.com/facebook/react)
* [redux](https://github.com/rackt/redux)
* [react-router](https://github.com/rackt/react-router)
* [redux-promise](https://github.com/acdlite/redux-promise)
* [redux-thunk](https://github.com/gaearon/redux-thunk)
* [webpack](https://github.com/webpack/webpack)
* [babel](https://github.com/babel/babel)
* [eslint](https://github.com/eslint/eslint)
* [AirBnb eslint config](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb)


Quick Start For Frontend
-----------

```shell
$ git clone https://github.com/purnomoeko/fab-price-monitoring
$ cd fab-price-monitoring
$ npm install
$ npm run dev
```
Notes
------------
Please install webpack and webpack-dev-server globally. 


```
$ npm install -g webpack webpack-dev-server
```


## Requirement for backend
* MongoDb
* Redis - Optional
* NodeJs version 8 or later

## Env Variable
* PORT: port that will be used for node apps
* FAB_MONITORING_URL: Mongodb url
* FAB_MONITORING_DBNAME: Mongodb DBName

**Make sure your port 3000 is open and available**

## To run cronjob monitoring the price change every hour
`` 0 */1 * * 1 node functions/cron.js ``


Quick Start For Backend
-----------

```shell
$ cd ./fab-price-monitoring/functions
$ npm install
$ nodemon bin/www
```



