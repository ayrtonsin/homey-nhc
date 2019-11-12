'use strict';

const Homey = require('homey');
const niko = require('niko-home-control');

class MyDevice extends Homey.Device {
	
	onInit() {
		this.log('Device init');
		this.log('Name:', this.getName());
		this.log('Class:', this.getClass());
        this.log('id:', this.getData().id);

        
		//receive updates from niko: when thermostat is changed.
		this.trackNhcEvent(this);          
	}
    

    trackNhcEvent(t){
        this.log('tracking nhc event...');
        var that = this;
        this._connectNiko(this.getSetting("ip"));
        niko.events.on('listthermostat', (event) => {
            that.log('nhc event received...');
            event.data.forEach(function (d) {
              that.log("same id??",d);
              var data = that.getData();
              if(d.id == data.id){
                that.log('updating device value', d.id);
                
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