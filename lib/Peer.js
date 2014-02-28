(function() {

  'use strict';

  var Q = require('q'),
      // Require PeerJS through file path since its package.json
      // doesn't declare a 'main' key.
      PeerJS = require('../node_modules/peerjs/dist/peer').Peer;

  function Peer(options) {
    this._me = new PeerJS({ host: options.host, port: options.port });
    this.endpoint = null;
  }

  Peer.prototype = function() {

    var init = function() {
      var deferred = Q.defer();
      this._me.on('open', function(endpoint) {
        this.endpoint = endpoint;
        this._me.on('connection', function(peerConnection) { //TODO: Look at this
          console.log('New connection', peerConnection);
          var connection = new Connection(peerConnection, peerConnection.metadata);
        });

        deferred.resolve(endpoint);
      }.bind(this));
      return deferred.promise;
    };

    var connect = function(identity, endpoint) {
      return new Connection(this._me.connect(endpoint.id, {metadata: identity}));
    }

    return {
        init: init,
        connect: connect
    };
  }();

  module.exports = Peer;

}).call(this);
