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
    if ( !data.type ) return;
    var from = this.peerConnection.metadata.identity;

    this.trigger(data.type, from, data);
  };

  Connection.prototype = function() {

    var shareResource = function(metadata, key) {
      this.peerConnection.send({ type: 'share', metadata: metadata, key: key });
    };

    var sendResource = function(resource) {
      this.peerConnection.send({ type: 'resource', resource: resource });
    };

    var requestResource = function(guid) {
      this.peerConnection.send({ type: 'request', guid: guid });
    };

    return {
      sendResource: sendResource,
      shareResource: shareResource,
      requestResource: requestResource,
      ondata: ondata
    };
  }();

  // Use events
  Utils.extend(Connection.prototype, Utils.Events);

  module.exports = Connection;

}).call(this);
