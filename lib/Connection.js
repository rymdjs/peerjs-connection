(function() {

  'use strict';

  /*
    'connection' is a PeerJS connection
   */
  function Connection(peerConnection) {
    this.identity = peerConnection.metadata.identity;
    this.peerConnection = peerConnection;
    peerConnection.on('data', ondata.bind(this));

    this.listeners = {};
  }

  var ondata = function(data) {
    console.log('ondata', data);
    if ( !data.type ) return;

    var from = this.peerConnection.metadata.identity,
        cb = (this.listeners[data.type] || function() {});

    cb(from, data);
  };

  Connection.prototype = function() {

    var listen = function(type, cb) {
      this.listeners[type] = cb;
    };

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
      listen: listen,
      sendResource: sendResource,
      shareResource: shareResource,
      requestResource: requestResource,
      ondata: ondata
    };
  }();

  module.exports = Connection;

}).call(this);
