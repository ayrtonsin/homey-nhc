'use strict';

const Homey = require('homey');
const { ManagerSettings } = require('homey');
const niko = require('niko-home-control');

class MyApp extends Homey.App {

	onInit() {
		this.log('NHC is running...');
		var ip = ManagerSettings.get('ip');
		//var ip = '192.168.1.2';
		this._connectNiko(ip);
	}

	_connectNiko(ip) {
		if (ip) {
			console.log("connecting to NHC, ", ip);
			niko.init({
				ip: ip,
				port: 8000,
				timeout: 2000,
				events: true
			});
		}
	}
}

module.exports = MyApp;
