(function() {

  'use strict';

  var Utils = require("rymd-utils");

  /*
    'connection' is a PeerJS connection
   */
  function Connection(peerConnection) {
    this.identity = peerConnection.metadata.identity;
    this.peerConnection = peerConnection;
    peerConnection.on('data', ondata.bind(this));
  }

  var ondata = function(data) {
    console.log('incoming data', data);
    if ( !data.type ) return;
    var from = this.peerConnection.metadata.identity;

    this.trigger(data.type, from, data);
  };

  Connection.prototype = function() {

    var shareResource = function(metadata, key) {
      this.peerConnection.send({ type: 'share', metadata: metadata, key: key });
    };

    var sendResource = function(resource) {
      console.log('sending resource', this, resource);
      this.peerConnection.send({ type: 'resource', data: resource.data });
    };

    var requestResource = function(guid) {
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
