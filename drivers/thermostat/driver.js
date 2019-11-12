'use strict';

const Homey = require('homey');
const niko = require('niko-home-control');

class ThermostatDriver extends Homey.Driver {	
	
	
	onPair(socket) {

         let devices = {};
         var that = this;

         // this is called when the user presses save settings button in pair.html
         socket.on('set_settings', (device_data, callback) => {
           this.log("setting settings using ip",device_data.ip);
           try {
             this.ip = device_data.ip;
             this._connectNiko(this.ip);
             
             callback(null, device_data);
           } catch(e) {
             this.log('unable to connect to nhc:', e.message);
             return callback(e);
           }
         });

         socket.on('list_devices', function( data, callback ) {
           console.log("listing devices", that.ip);
           niko
            .command('{"cmd": "listthermostat"}')
            .then(function (response) {
              console.log(response);
              var nhcList = that._devicesToHomey(that, response);
              callback( null, nhcList);
            });
           
         });

         // this happens when user clicks away the pairing windows
         socket.on('disconnect', () => {
           this.log("NHC - Pairing is finished (done or aborted) ");
         })

       } // end onPair
	   
	   _deviceToHomey(d, ip){
          return {name: d.name,
                  data: {id: d.id},
                  settings: {ip: ip}};
        }

        _devicesToHomey(that, resp){
          return resp.data.map(function (d){ return that._deviceToHomey(d, that.ip)});
        }

        _connectNiko (ip){
          console.log("connecting niko");
           niko.init({
            ip: ip,
            port: 8000,
            timeout: 20000,
            events: true
          });
        }
	
}

module.exports = ThermostatDriver;