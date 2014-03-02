(function() {

  'use strict';

  var Q = require('q'),
      // Require PeerJS through file path since its package.json
      // doesn't declare a 'main' key.
      PeerJS = require('../node_modules/peerjs/dist/peer').Peer,
      Connection = require('./Connection');

  function Peer(options) {
    this.options = options;
    this._me = null;
    this.endpoint = null;
  }

  var onconnection = function(connection) {
    console.log('new connection');
    if(this.onconnection) {
      this.onconnection();
    }
  };

  Peer.prototype = function() {

    var init = function() {
      var deferred = Q.defer();

      this._me = new PeerJS({ host: this.options.host, port: this.options.port })

      this._me.on('open', function(endpoint) {
        console.log("Connection opened: " + endpoint);
        this.endpoint = endpoint;

        this._me.on('connection', function(peerConnection) { //TODO: Look at this
          console.log('New connection', peerConnection);
          var connection = new Connection(peerConnection, peerConnection.metadata);
          onconnection.call(this, connection);
        }.bind(this));

        deferred.resolve(endpoint);

      }.bind(this));

      return deferred.promise;
    }

    var connect = function(identity, endpoint) {
      var deferred = Q.defer();
      var connection = new Connection(this._me.connect(endpoint.id, {metadata: identity}));
      connection.on('open', function() {
        deferred.resolve(connection);
      });
      return deferred.promise;
    }

    return {
        init: init,
        connect: connect
    };
  }();

  module.exports = Peer;

}).call(this);
