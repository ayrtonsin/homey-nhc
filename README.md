# Homey-nhc
Niko Home Control app for Homey, it interfaces with the ip-module (V1 only!).
<a href="https://www.niko.eu/en/article/550-00001">
  <img src="https://www.niko.eu/-/media/sites/nikoeu/import/digital-assets/2/d/1/2d1a548b254a46d5937ca567011c1fcf.ashx?rev=3f6273d1f04a40a09b27af2686a9063e&h=400&w=400&la=en&bc=white&hash=963E2B30F6873465763E48E927674606">
</a>  

##Requirements

* NHC gateway 550-00001
* IP module 550-00508



##Supported devices (capabilities)

* Lights (on/off): all (light) switches configured on NHC. the switches that are available in the NHC app
* Dimmers (dim + on/off): all dimmers configured on NHC. The dimmers that are available in the NHC app
* Thermostat (heating/cooling) module: all thermostats configured on NHC through the heating/cooling module 550-00150. The thermostats that are available in the NHC app

##Feedback

Post any requests on the <a href="https://community.athom.com/tag/app">athom community forum</a>.
Bug reports and/or fixes/support are welcome on <a href="https://github.com/ayrtonsin/homey-nhc">GitHub</a>

##Changelog

### V 0.2.1

bug fixes related to TCP timeouts & connection resets

### V 0.2.0

Reworked connections to NHC, reduced amount of connections, centralised to general app settings. When updating the ip needs to be set in a new app setting. General bug fixes related to TCP connection timeouts.

### V 0.1.0

Added support for the Niko thermostat, bug fixes

### V 0.0.4

bug fixes, note: restart app when you no longer get external updates from nhc.

### V 0.0.3

fixed app background images

### V 0.0.2

crash fix when more then 10 devices