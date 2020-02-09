'use strict';

const Homey = require('homey');
const niko = require('niko-home-control');
const listThermostatCmd = '{"cmd": "listthermostat"}';
const execModeCmd = (id, mode) => {
    return '{"cmd": "executethermostat", "id":' + id + ', "mode": ' + mode + '}';
  };
  const execTempCmd = (id, overrule, time) => {
      return '{"cmd": "executethermostat", "id":' + id + ', "overrule": ' + overrule + ', "overruletime": ' + time+ '}';
    };

class MyDevice extends Homey.Device {
	
	onInit() {
		this.log('Thermostat Device init');
		this.log('Name:', this.getName());
		this.log('Class:', this.getClass());
        this.log('id:', this.getData().id);

        
		//check for thermostat state in the NHC controller in an interval
        this.intervalObj = setInterval(this.trackNhcThermostats, 30000,this);
        this.registerCapabilityListener('thermostat_mode', this.onModeChange.bind(this));
        this.registerCapabilityListener('target_temperature', this.onTempChange.bind(this));
        this.log('Done init thermostat device');
	}
	
	nhcProgramToMode(nhcVal){
	    var mode = null;
	    switch(nhcVal) {
	        case 0:
	        case 1:
	        case 2:
	            mode = "heat";
	          break;
	        case 3:
                mode = "off";
              break;
	        case 4:
                mode = "cool";
              break;
	        case 5:
                mode = "auto";
              break;
	        default:
	            mode = "auto";
	      }
	    return mode;
	}
	
	homeyModeToNhc(val){
        var mode = null;
        switch(val) {
            case "heat":
                mode = 0;
            case "auto":
                mode = 5;
            case "cool":
                mode = 4;
              break;
            case "off":
                mode = 3;
              break;            
            default:
                mode = 5;
          }
        return mode;
    }
    

	trackNhcThermostats(that){
        that.log('tracking nhc thermostats...');
        var ip = that.getSetting("ip");
        if (ip != null){
            that._connectNiko(ip);
            niko.command(listThermostatCmd)
                .then(function(response){
                    that.log('nhc thermostat response...');
                    response.data.forEach(function (d) {
                        that.log("same id??",d);
                        var data = that.getData();
                        if(d.id == data.id){
                            var measured = d.measured / 10;
                            var setpoint = d.setpoint / 10;
                            var mode = that.nhcProgramToMode(d.mode);
                            that.log('updating device value', d.id);
                            that.setCapabilityValue('measure_temperature', measured);
                            that.setCapabilityValue('target_temperature', setpoint);
                            that.setCapabilityValue('thermostat_mode', mode);
                    }
                });
            });
        }
    }
	
	
	//this method is called when Homey requests a new temperature mode
	async onModeChange(value, opts) {
	    var that = this;
	    var data = this.getData();
	    var nhcMode = this.homeyModeToNhc(value);
	    this.log('switching thermostat mode value::' +  nhcMode);
        var data = this.getData();
        niko.command(execModeCmd(data.id, nhcMode))
            .then(function(response){
                that.log('execute thermostat response...');
                that.log(response);
                that.setCapabilityValue('thermostat_mode', value);
                
            });
	}
	
	//this method is called when Homey requests a new temperature value
    async onTempChange(value, opts) {
        var that = this;
        var data = this.getData();
        var time = "01:00";
        this.log('setting thermostat value::' +  value);
        var target = value * 10;
        var data = this.getData();
        niko.command(execTempCmd(data.id, target, time))
            .then(function(response){
                that.log('execute thermostat response...');
                that.log(response);
                that.setCapabilityValue('target_temperature', target);
                
            });
    }

	_connectNiko (ip){
	  console.log("connecting niko");
	   niko.init({
		ip: ip, // "192.168.1.2",//this.settings.ip,
		port: 8000,
		timeout: 20000,
		events: false
	  });
	}	
	
}

module.exports = MyDevice;