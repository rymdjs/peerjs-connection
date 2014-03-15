(function() {

  'use strict';

  /*
    'connection' is a PeerJS connection
   */
  function Connection(peerConnection) {
    this.identity = peerConnection.metadata.identity;
    this.peerConnection = peerConnection;
    peerConnection.on('data', ondata);
  }

  var ondata = function() {
    console.log('got data');
  };

  Connection.prototype = function() {

    var listen = function() {
    };

    var shareResource = function(metadata, key) {
      console.log('Sharing metadata', metadata);
      console.log('Sharing key', key);
    };

    var sendResource = function(guid) {
    };

    var requestResource = function(guid) {
    };

    return {
      listen: listen,
      sendResource: sendResource,
      shareResource: shareResource,
      requestResource: requestResource
    };
  }();

  module.exports = Connection;

}).call(this);
