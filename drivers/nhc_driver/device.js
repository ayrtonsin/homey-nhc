'use strict';

const Homey = require('homey');
const niko = require('niko-home-control');


class MyDevice extends Homey.Device {

	onInit() {
		//this.log('Device init');
		this.log('Name, id:', this.getName(), this.getData().id);
		//this.log('Class:', this.getClass());

		if (this.getData().type == 1) {
			//switch
			this.registerCapabilityListener('onoff', this.onCapabilityOnoff.bind(this));
		} else if (this.getData().type == 2) {
			//dimmer
			this.registerCapabilityListener('onoff', this.onCapabilityOnoff.bind(this));
			this.registerCapabilityListener('dim', this.onCapabilityDim.bind(this));
		}
		//reset error state on startup
		this.setAvailable();
	}

	// this method is called when the Device has requested a state change (turned on or off)
	async onCapabilityOnoff(value, opts) {
		this.log('switching light with value::' + value);
		var data = this.getData();

		return niko
			.executeActions(data.id, value ? 100 : 0)
			.then(response => {
				//console.log(response);
				//TODO capture error
			})
			.catch(error => {
				this.error(error);
				//this.setUnavailable(error);
				throw "failed to execute" + error;
			});
	}

	// this method is called when the Device has requested a state change (dim)
	async onCapabilityDim(value, opts) {
		//this.log('value::' +  value);
		var data = this.getData();

		return niko
			.executeActions(data.id, value * 100)
			.then(function(response) {
				//console.log(response);
				//TODO capture error
			});
	}
}

module.exports = MyDevice;
