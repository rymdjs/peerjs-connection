(function() {

	'use strict';

	var Q = require('q');

	function Peer(options) {
		this._me = new Peer({ host: options.host, port: options.port });
		this.verifier = options.verifier;
	}

	Peer.prototype = function() {
		var connect = function(endpoint) {
			var deferred = Q.defer();
			// instansiera new Connection och wrappa Peers Connection
			// Se metoder
			var connection = this._me.connect(endpoint.id);

			return deferred.promise;
		}


	}();

	module.exports = Peer;

}).call(this);
