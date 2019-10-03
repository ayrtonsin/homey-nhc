'use strict';

const Homey = require('homey');
const niko = require('niko-home-control');


class MyDevice extends Homey.Device {
	
	onInit() {
	  this.log('Device init');
	  this.log('Name:', this.getName());
	  this.log('Class:', this.getClass());
          this.log('id:', this.getData().id);

          if(this.getData().type == 1){
            //switch
	    this.registerCapabilityListener('onoff', this.onCapabilityOnoff.bind(this));
          }else if(this.getData().type == 2){
            //dimmer
            this.registerCapabilityListener('onoff', this.onCapabilityOnoff.bind(this));
            this.registerCapabilityListener('dim', this.onCapabilityDim.bind(this));
          }
	  // register a capability listener
          this.trackNhcEvent(this);
          
	}

        // this method is called when the Device has requested a state change (turned on or off)
	async onCapabilityOnoff( value, opts ) {
          //this.log('value::' +  value);
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

        trackNhcEvent(t){
          this.log('tracking nhc event...');
          var that = this;
          this._connectNiko(this.getSetting("ip"));
          niko.events.on('listactions', (event) => {
            //that.log('nhc event received...');
            event.data.forEach(function (d) {
              //that.log("same id??",d);
              var data = that.getData();
              if(d.id == data.id){
                var powerState = d.value1 > 0;
                that.log('updating device value', d.id, d.value1, powerState);
                that.setCapabilityValue('onoff', powerState)
                  .catch(that.error);  
                if(data.type == 2){
                  that.setCapabilityValue('dim', d.value1 / 100);
                }
              }

            });
          });          
        }

        _connectNiko (ip){
          console.log("connecting niko");
           niko.init({
            ip: ip, // "192.168.1.2",//this.settings.ip,
            port: 8000,
            timeout: 20000,
            events: true
          });
        }

        	
}

module.exports = MyDevice;
