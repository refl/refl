/*
** Refl's public API should be defined in this object. Everything not accessable
** from this object (or it's sub objects) will be private.
*/
const Refl = {};

/*
** Public funciton to initialize an app.
*/
Refl.app = require('./app/initializer').initializeApp

module.exports = Refl;