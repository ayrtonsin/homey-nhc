'use strict';

const Homey = require('homey');
const niko = require('niko-home-control');

class MyDriver extends Homey.Driver {

	onPair(socket) {

		let devices = {};
		var that = this;

		// this is called when the user presses save settings button in
		// pair.html
		socket.on('set_settings', (device_data, callback) => {
			this.log("setting settings using ip",  device_data.ip);
			try {
				this.ip = device_data.ip;
				this._connectNiko(this.ip);

				callback(null, device_data);
			} catch (e) {
				this.log('unable to connect to nhc:', e.message);
				return callback(e);
			}
		});

		socket.on('list_devices', function(data, callback) {
			console.log("listing devices", that.ip);
			niko
				.listActions()
				.then(function(response) {
					console.log(response);
					var nhcList = that._devicesToHomey(that, response);
					callback(null, nhcList);
				});

		});

		// this happens when user clicks away the pairing windows
		socket.on('disconnect', () => {
			this.log("NHC - Pairing is finished (done or aborted) ");
		})

	} // end onPair


	_deviceToHomey(d, ip) {
		var cap = ["onoff"];
		if (d.type == 2) {
			cap.push("dim");
		}
		return {
			name: d.name,
			data: {
				id: d.id,
				type: d.type
			},
			settings: { ip: ip },
			capabilities: cap
		};
	}

	_devicesToHomey(that, resp) {
		return resp.data.map(function(d) { return that._deviceToHomey(d, that.ip) });
	}

	_connectNiko(ip) {
		console.log("connecting driver", ip);
		var init = niko.init({
			ip: ip,
			port: 8000,
			timeout: 5000,
			events: true
		});

	}

	// This method is called when a user is adding a device
	// and the 'list_devices' view is called
	_onPairListDevices(data, callback) {
		console.log("pairing devices");
		var that = this;
		niko
			.listActions()
			.then(functionresponse) {
				that.log(response);
				var nhcList = that._devicesToHomey(response);
				callback(null, nhcList);
			});

	}

	onInit() {
		console.log("init lights driver");
		// register a capability listener
		this.trackNhcEvent(this);
	}

	trackNhcEvent(t) {
		this.log('tracking nhc event...');
		var that = this;
		// TODO hacky need to listen to each individual (unique) gateway(s) ip's.
		// let's assume there is only one :-)
		if (that.getDevices() != null && that.getDevices().length > 0) {
			var ip = that.getDevices()[0].getSetting("ip");
			this.log('ip:', ip);
			this._connectNiko(ip);
			niko.events.on('listactions', (event) => {
				that.log('nhc event received...');
				that.getDevices().forEach(function(device) {
					that.maybeExecuteOnDevice(that, device, event.data);
				});
			});
		} else {
			this.log('cannot track nhc events, no devices found');
		}

		// this.log('end tracking..');
	}

	maybeExecuteOnDevice(that, device, data) {
		data.forEach(function(d) {
			// that.log("device??",device);
			var data = device.getData();
			if (d.id == data.id) {
				var powerState = d.value1 > 0;
				that.log('updating device value', d.id, d.value1, powerState);
				device.setCapabilityValue('onoff', powerState)
					.catch(that.error);
				if (data.type == 2) {
					device.setCapabilityValue('dim', d.value1 / 100);
				}
			}
		});
	}
}

module.exports = MyDriver;
