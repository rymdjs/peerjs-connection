(function() {

  'use strict';

  var Q = require('q');

  function Peer(options) {
    this._me = new Peer({ host: options.host, port: options.port });
  }

  Peer.prototype = function() {
    var init = function(identity) {
      var deferred = Q.defer();
      var me = this._me;

      me.on('open', function(endpoint) {
        me.oninit(id);
        deferred.resolve(id);
      });
      return deferred.promise;
    };

    var connect = function(identity, endpoint) {
      var deferred = Q.defer();
      // instansiera new Connection och wrappa Peers Connection
      // Se metoder
      var connection = new Connection(this._me.connect(endpoint.id), identity);
      return deferred.promise;
    }

    return {
        init: init,
        connect: connect
    };
  }();

  module.exports = Peer;

}).call(this);
