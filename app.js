'use strict';

const Homey = require('homey');
const { ManagerSettings, ManagerDrivers } = require('homey');
const niko = require('niko-home-control');
const isPortReachable = require('is-port-reachable');

class MyApp extends Homey.App {

	getMethods(obj) {
		let properties = new Set()
		let currentObj = obj
		do {
			Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
		} while ((currentObj = Object.getPrototypeOf(currentObj)))
		return [...properties.keys()].filter(item => typeof obj[item] === 'function')
	}

	onInit() {
		this.log('NHC is running...');
		var ip = ManagerSettings.get('ip');

		//var ip = '192.168.1.2';
		this._connectNiko(ip);
		//reconnect every hour
		this.intervalObj = setInterval(() => this._connectNiko(ip), 3600000, this);
		
		//this.log('methods:', this.getMethods(this));

		//var driver = ManagerDrivers.getriver('nhc_driver');
		//if (driver.getDevices() != null && driver.getDevices().length > 0) {
		//	this.log('resetting devices');
		//	driver.getDevices().forEach(function(device) {
		//		device.setAvailable();
		//	});

		//}
	}

	_connectNiko(ip) {
		if (ip) {
			var that = this;
			console.log("connecting to NHC, ", ip);
			isPortReachable(8000, { host: ip })
				.then(function(reachable) {
					console.log('reachable?', reachable);
					if (reachable) {
						var socket = niko.init({
							ip: ip,
							port: 8000,
							timeout: 2000,
							events: true
						});
						//console.log("object after init:", socket);
						socket.on('end', () => {
							that.log('disconnected from server, reconnecting');
							that._connectNiko(ip);
						});
						socket.on('error', error => {
							that.error('error received', error);
							throw error;
						});
					} else {
						that.error("NHC gateway unreachable, valid ip?");
					}
				})
				.catch(that.error);

		}
	}
}

module.exports = MyApp;
