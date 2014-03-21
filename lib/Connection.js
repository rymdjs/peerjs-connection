(function() {

  'use strict';

  var Utils = require("rymd-utils"),
      Logger = require("rymd-logger");

  var logger = new Logger('Connection');

  /*
    'connection' is a PeerJS connection
   */
  function Connection(peerConnection) {
    this.identity = peerConnection.metadata.identity;
    this.peerConnection = peerConnection;
    peerConnection.on('data', ondata.bind(this));
  }

  var ondata = function(data) {
    logger.debug('incoming data', data);
    if ( !data.type ) return;
    var from = this.peerConnection.metadata.identity;

    this.trigger(data.type, from, data);
  };

  Connection.prototype = function() {

    var shareResource = function(metadata, key) {
      logger.global('Sharing resource: ', metadata.guid);
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

    return {
      sendResource: sendResource,
      shareResource: shareResource,
      requestResource: requestResource
    };
  }();

  // Use events
  Utils.extend(Connection.prototype, Utils.Events);

  module.exports = Connection;

}).call(this);
