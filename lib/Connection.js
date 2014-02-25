(function() {

	'use strict';

	/*
		'connection' is a PeerJS connection
	 */
	function Connection(sourceNode, connection) {

	}

	Connection.prototype = function() {

		var listen = function() {

		};

		var shareResource = function(guid) {

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
