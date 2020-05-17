# 1702 Express/Sequelize/Associations Review
Quick review session for 1702 FSA/GH students for `Express` and `Sequelize` and `Sequelize` association methods

To view the express only version of this repo, check out this [branch](https://github.com/ianmunrobot/1702-express-review/tree/express-review-ending-point)

To view the express-sequelize version of this repo, check out this [branch](https://github.com/ianmunrobot/1702-express-review/tree/sequelize-review-ending-point)

## Videos
Playlist for the video review of this repo being built can be found [here](https://www.youtube.com/playlist?list=PLkkKgQIx1wZYNoeJXVMAiUJn7BlYYKQwI)

### Individual Videos:
Express: [Part 1](https://www.youtube.com/watch?v=icZqjfODmz0) [Part 2](https://www.youtube.com/watch?v=5yOWs4Qarg4)

Sequelize [Part 1 - basic structure](https://www.youtube.com/watch?v=EupsLAxCEAg) [Part 2 - associations](https://www.youtube.com/watch?v=isk0JR0t_VQ)

**NB: This was all live review, there may be some small inaccuracies in how things are described but I tried to repeat most of the questions for viewers**

## Starting up
To start up:
* `createdb puppies` in the command line to create your postgres database
* `npm install` to install node modules
* `npm run seed` to seed your DB with the latest and greatest puppies/parks/locations/etc (this will clear/reset the db)
* `npm run seed:associations` to seed some semi-randomized associations in your puppy instances
* *or*
* `npm run seed:all` to seed the instances and also the associations
* `npm start` starts the server, you can now make requests to `localhost:3000`

## Routes to try:
The server will start listening on `localhost:3000` by default

Fire up an easy http client like <a href="https://www.getpostman.com/">Postman</a> and try some routes like:
* `GET: /puppies`
* `POST: /puppies`
* `GET: /puppies/:id`

Check out all the routers in `/routes` for more options!

## Part 1: Express

### Express Review questions

Dealing with queries and how to route them?

Dealing with multiple :params in the URI? How to make sure the right route?

What is static middleware???

### Express routing:
Express is basically a big nested queue. Express goes through middleware and attempts to match the request path to middleware. If it matches an `app.use` sub-router on the way, it enters that sub-router and attemps to match against its
```js
try {
// JS array notation is just shown here as a demo of the queue structure - express iterates through this and tries to match
[
  //matches this route
  app.use,
  //matches this route
  app.use,
  //if the path matches this /path, ener the router within which is another queue
  app.use('/path' [app.get, app.post]),
  // if the path matches this /path, enter
  app.use('/path2'),
  // match all paths and handle errors callback with 4 arguments
  app.use('*', function(4 arguments),
  // defaults to sending a 404 if no routes match
  app.use('*', function(req, res, next){ res.sendStatus(404)})
]
// if errors are caught, express helps handle
} catch(error) {
  res.status(500).send(error) // internal server error
}
```

### Netflix and Express:
Cool article on Netflix using express servers and running into erro
http://techblog.netflix.com/2014/11/nodejs-in-flames.html

## Part 2: Sequelize


Questions:

* Remind us which aspects are coming from Sequelize vs Express - where's the logic living?
Where do I look in the docs - express or sequelize?

  * General answer: anything dealing with `req` or `res` is in express docs. Anything in a Sequelize promise chain that's not touching either `req` or `res` - look to the <a href="http://docs.sequelizejs.com/en/v3/">Sequelize Docs</a>

* Sequelize methods - what do we get and how do we use them?

### Important Methods:

* `Model.findAll()` finds all instances
* `Model.findAll({where: {.......}})` finds all instances that match the where condition
* `Model.findOne({where: {....}})` finds first match for the where condition
* `Model.findById(id)` finds by an id number. Sequelize will coerce strings into ints, so you can simply use the `req.params.id` and not worry about casting to a `Number` before sending to Sequelize
* `Model.findOrCreate({where: {.....}})` will find an entry OR create it if necessary. returns `Instance` as first argument, and `created` boolean as the second. Good for making sure you don't make a bunch of duplicates
* if the above queries return nothing, return value will be `null`

## Part 3: Sequelize Association Methods:

For this segment of the review, we significantly changed the starting point from the previous ending point in order to save time during the live review. 3 new models were defined: `Park`, `Location`, and `Food`, with corresponding basic routers. The file structure was expanded so that there are separate `/routes` and `/models` folders. Seed data was also added in the `seed.js` and `seedAssociations.js`

[This document](Sequelize-Associations.md) explains more about the `Sequelize` methods and a bit more about what we aimed to do with this review session

You'll notice some new seeding files in this branch - this is to illustrate a bit about how to construct seed files, with or without associations
