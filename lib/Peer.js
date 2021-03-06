(function() {

  'use strict';

  var Q = require('q'),
      // Require PeerJS through file path since its package.json
      // doesn't declare a 'main' key.
      PeerJS = require('../node_modules/peerjs/dist/peer').Peer,
      Utils = require("rymd-utils"),
      Connection = require('./Connection'),
      Logger = require('rymd-logger');

  var logger = new Logger('Peer');

  function Peer(options) {
    this.options = options;
    this._me = null;
    this.endpoint = null;
    this.identity = null;
  }

  Peer.prototype = function() {

    var init = function(identity) {
      var deferred = Q.defer();

      this.identity = identity;
      this._me = new PeerJS({ host: this.options.host, port: this.options.port })

      this._me.on('open', function(endpoint) {
        this.endpoint = endpoint;

        this._me.on('connection', function(peerConnection) { //TODO: Look at this
          var connection = new Connection(peerConnection);

          this.bubble('share', connection);
          this.bubble('request', connection);
          this.bubble('authChallenge', connection);

          this.trigger('connection', connection);
          logger.global("Incoming connection: " + connection.identity);

        }.bind(this));

        deferred.resolve(endpoint);

      }.bind(this));

      return deferred.promise;
    }

    var connect = function(identity, endpoint) {
      var deferred = Q.defer();

      var peerConnection = this._me.connect(endpoint.id, {metadata: {identity: this.identity}, reliable: true});
      peerConnection.on('open', function() {
        var connection = new Connection(peerConnection, identity);

        this.bubble('request', connection);
        this.bubble('authResponse', connection);

        logger.global('Connected to ' + identity);

        deferred.resolve(connection);

      }.bind(this));

      return deferred.promise;
    }

    return {
      init: init,
      connect: connect
    };
  }();

  // Use events
  Utils.extend(Peer.prototype, Utils.Events);

  module.exports = Peer;

}).call(this);
