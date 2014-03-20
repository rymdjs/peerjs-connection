(function() {

  'use strict';

  var Q = require('q'),
      // Require PeerJS through file path since its package.json
      // doesn't declare a 'main' key.
      PeerJS = require('../node_modules/peerjs/dist/peer').Peer,
      Utils = require("rymd-utils"),
      Connection = require('./Connection');

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
        console.log("Connection  to peerjs server opened: " + endpoint);
        this.endpoint = endpoint;

        this._me.on('connection', function(peerConnection) { //TODO: Look at this
          var connection = new Connection(peerConnection);

          connection.on('share', function() {
            var args = Array.prototype.slice.call(arguments);
            args.unshift('share');
            args.push(connection);
            this.trigger.apply(this, args);
          }, this);

          connection.on('request', function() {
            var args = Array.prototype.slice.call(arguments);
            args.unshift('request');
            args.push(connection);
            this.trigger.apply(this, args);
          }, this);

          connection.on('resource', function() {
            console.log('apa');
            var args = Array.prototype.slice.call(arguments);
            args.unshift('resource');
            args.push(connection);
            this.trigger.apply(this, args);
          }, this);

          this.trigger('connection', connection);

        }.bind(this));

        deferred.resolve(endpoint);

      }.bind(this));

      return deferred.promise;
    }

    var connect = function(identity, endpoint) {
      var deferred = Q.defer();
      console.log('connecting to ' + identity);
      var peerConnection = this._me.connect(endpoint.id, {metadata: {identity: this.identity}, reliable: true});
      peerConnection.on('open', function() {
        console.log('connection open');
        deferred.resolve(new Connection(peerConnection));
      });
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
