/**
 * couch-daemon: High-level os daemon API for CouchDB
 *
 * dbs - Create a stream of databases, filtered via black- and white lists.
 *
 * Licensed under the MIT license.
 * https://github.com/jo/couch-daemon
 * © 2014 Johannes J. Schmidt, null2 GmbH, Berlin
 *
 */

var _ = require('highland');
var nano = require('nano');

module.exports = function(url, options) {
  options = options || {};

  var couch = nano(url);


  var dbs = _(function(push, done) {
    couch.db.list(function(err, resp) {
      if (err) {
        return push(err);
      }

      resp.forEach(function(dbname) {
        push(null, {
          stream: 'dbs',
          type: 'created',
          db_name: dbname
        });
      });

      // TODO:
      // Listen to _db_updates and propagate events:
      // * created
      // * updated
      // * deleted
      //
      // couch.updates()
      //   .on('data', function(d) {
      //     push(null, _.extend({ stream: 'dbs' }, d));
      //   })
      //   .on('error', push);
    });
  });

  return _.pipeline(
    dbs,

    _.filter(function(d) {
      return !options.whitelist || options.whitelist.indexOf(d.db_name) > -1;
    }),

    _.reject(function(d) {
      return options.blacklist && options.blacklist.indexOf(d.db_name) > -1;
    })
  );
};
