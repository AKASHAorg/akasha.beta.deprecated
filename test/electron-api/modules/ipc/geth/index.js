const expect = require('chai').expect;
const util = require('util');

exports.start_geth_service = function(client){
	console.log(client);
	return function (client) {
	    return client
	        .waitUntilWindowLoaded(7000)
	        .executeAsync(function(done) {
	            ipcRenderer.on('client:geth:startService', function(err, status){
	                done(status);
	            });
	            ipcRenderer.send('server:geth:startService');
	        })
	        .then(function(ret) {
	            expect(ret.value.success).to.be.true;
	        })
	        .pause(7000) // wait for ipc connector to get set
	  }
}

exports.stop_geth_service = function(client) {
	return function (client) {
return client
    .executeAsync(function(done) {
        ipcRenderer.on('client:geth:stopService', function(err, status){
            done(status);
        });
        ipcRenderer.send('server:geth:stopService');
    })
    .then(function(ret) {
        expect(ret.value.success).to.be.true;
    })
}
}