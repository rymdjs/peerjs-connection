(function() {

  'use strict';

  var Utils = require("rymd-utils"),
      Logger = require("rymd-logger");

  var logger = new Logger('Connection');

  /*
    'connection' is a PeerJS connection
   */
  function Connection(peerConnection, identity) {
    this.identity = identity || peerConnection.metadata.identity;
    this.peerConnection = peerConnection;
    peerConnection.on('data', ondata.bind(this));
  }

  var ondata = function(data) {
    console.log('Incoming data', data);
    if ( !data.type ) return;
    var from = this.identity;

    this.trigger(data.type, from, data, this);
  };

  Connection.prototype = function() {

    var shareResource = function(metadata, key) {
      logger.global('Sharing resource: ' + metadata.guid);
      this.peerConnection.send({ type: 'share', metadata: metadata, key: key });
    };

    var sendResource = function(resource) {
      logger.global('Sending resource: ' + resource.id);
      this.peerConnection.send({ type: 'resource', metadata: resource.metadata, data: resource.data });
    };

    var requestResource = function(guid) {
      logger.global('Requesting resource: ' + guid);
      this.peerConnection.send({ type: 'request', guid: guid });
    };

    var sendAuthChallenge = function(encNonce) {
      logger.global('Sending crypto challenge to ' + this.identity);
      this.peerConnection.send({type: 'authChallenge', data: encNonce});
    };

    var sendAuthResponse = function(response) {
      logger.global('Sending crypto response to ' + this.identity);
      this.peerConnection.send({type: 'authResponse', data: response});
    };

    var sendAuthLastResponse = function(response) {
      logger.global('Sending crypto lastResponse to ' + this.identity);
      this.peerConnection.send({type: 'authLastResponse', data: response});
    };

    var establish = function() {
      logger.global('Sending auth establish to ' + this.identity);
      this.peerConnection.send({type: 'authEstablish'});
    };

    return {
      sendResource: sendResource,
      shareResource: shareResource,
      requestResource: requestResource,
      sendAuthChallenge: sendAuthChallenge,
      sendAuthResponse: sendAuthResponse,
      sendAuthLastResponse: sendAuthLastResponse,
      establish: establish
    };
  }();

  // Use events
  Utils.extend(Connection.prototype, Utils.Events);

  module.exports = Connection;

}).call(this);
