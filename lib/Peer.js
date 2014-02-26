(function() {

  'use strict';

  var Q = require('q');
  var PeerJS = require('peer');
  console.log(PeerJS);

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
      var deferred = Q.defer();
      // instansiera new Connection och wrappa Peers Connection
      // Se metoder
      var connection = new Connection(this._me.connect(endpoint.id, {metadata: identity}));
      return deferred.promise;
    }

    return {
        init: init,
        connect: connect
    };
  }();

  module.exports = Peer;

}).call(this);
