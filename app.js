'use strict';

const Homey = require('homey');
const { ManagerSettings } = require('homey');
const niko = require('niko-home-control');
const isPortReachable = require('is-port-reachable');

class MyApp extends Homey.App {

	onInit() {
		this.log('NHC is running...');
		var ip = ManagerSettings.get('ip');
		
		//var ip = '192.168.1.2';
		this._connectNiko(ip);
	}

	_connectNiko(ip) {
		if (ip) {
			var that = this;
			console.log("connecting to NHC, ", ip);
			isPortReachable(8000, {host: ip})
				.then(function(reachable){
					console.log('reachable?', reachable);
					if(reachable){
						niko.init({
							ip: ip,
							port: 8000,
							timeout: 2000,
							events: true
						});
					}else{
						that.error("NHC gateway unreachable, valid ip?");
					}
				})
				.catch(that.error);
			
		}
	}
}

module.exports = MyApp;
