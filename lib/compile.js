/* couch-daemon
 * 
 * compile - compile functions defined in ddocs
 *
 * (c) 2014 Johannes J. Schmidt, null2 GmbH, Berlin
 */


var _ = require('highland');

module.exports = function(options) {
  options = options || {};


  return _.each(function(d) {
    if (d.type === 'ddoc') {
      // do it.
    }
  });
};
