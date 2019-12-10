'use strict';

const Homey = require('homey');
const niko = require('niko-home-control');


class MyDevice extends Homey.Device {
	
	onInit() {
	  this.log('Device init');
	  this.log('Name:', this.getName());
	  this.log('Class:', this.getClass());
      this.log('id:', this.getData().id);
      this._connectNiko(this.getSettings().ip);

      if(this.getData().type == 1){
          //switch
          this.registerCapabilityListener('onoff', this.onCapabilityOnoff.bind(this));
      }else if(this.getData().type == 2){
          //dimmer
          this.registerCapabilityListener('onoff', this.onCapabilityOnoff.bind(this));
          this.registerCapabilityListener('dim', this.onCapabilityDim.bind(this));
      }
	}

        // this method is called when the Device has requested a state change (turned on or off)
	async onCapabilityOnoff( value, opts ) {
          this.log('switching light with value::' +  value);
          var data = this.getData();

          niko
            .executeActions(data.id, value ? 100 : 0)
            .then(function (response) {
              //console.log(response);
              //TODO capture error
            });
        }

          // this method is called when the Device has requested a state change (dim)
	async onCapabilityDim( value, opts ) {
          //this.log('value::' +  value);
          var data = this.getData();

          niko
            .executeActions(data.id, value * 100)
            .then(function (response) {
              //console.log(response);
              //TODO capture error
            });
        }

        _connectNiko (ip){
          console.log("device, connecting niko: ", ip);
           niko.init({
            ip: ip, // "192.168.1.2",//this.settings.ip,
            port: 8000,
            timeout: 20000,
            events: false
          });
        }

        	
}

module.exports = MyDevice;
