/*
 * Single Window Application Template:
 * A basic starting point for your application.  Mostly a blank canvas.
 * 
 * In app.js, we generally take care of a few things:
 * - Bootstrap the application with any data we need
 * - Check for dependencies like device type, platform version or network connection
 * - Require and open our top-level UI component
 *  
 */
Ti.App.statusURL = "https://openshift.redhat.com/app/status/status.json";
//Ti.App.statusURL = "http://people.redhat.com/~ansilva/status.json";
Ti.App.sleepTime = 1800000; // 30 minutes

//bootstrap and check dependencies
if (Ti.version < 1.8 ) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');	  	
}

// This is a single context application with mutliple windows in a stack
(function() {
	//determine platform and form factor and render approproate components
	var osname = Ti.Platform.osname,
		version = Ti.Platform.version,
		height = Ti.Platform.displayCaps.platformHeight,
		width = Ti.Platform.displayCaps.platformWidth;
	
	Window = require('ui/handheld/ApplicationWindow');
	new Window().open();
})();

// test for iOS 4+
function isiOS4Plus(){
	if (Titanium.Platform.name == 'iPhone OS'){
		var version = Titanium.Platform.version.split(".");
		var major = parseInt(version[0]);
		// can only test this support on a 3.2+ device
		if (major >= 4){
			return true;
		}
	}
	return false;
}
 
if (isiOS4Plus()){
 
	var service;
	
	// Ti.App.iOS.addEventListener('notification',function(e){
	// You can use this event to pick up the info of the noticiation. 
	// Also to collect the 'userInfo' property data if any was set
	//		Ti.API.info("local notification received: "+JSON.stringify(e));
	//	});
	// fired when an app resumes from suspension
	Ti.App.addEventListener('resume',function(e){
		Ti.API.info("app is resuming from the background");
		Window = require('ui/handheld/ApplicationWindow');
	    new Window().open();
		
	});
	Ti.App.addEventListener('resumed',function(e){
		Ti.API.info("app has resumed from the background");
		// this will unregister the service if the user just opened the app
		// is: not via the notification 'OK' button..
		if(service!=null){
			service.stop();
			service.unregister();
		}
        Titanium.UI.iPhone.appBadge = null;
	});
	Ti.App.addEventListener('pause',function(e){
		Ti.API.info("app was paused from the foreground");
		
		service = Ti.App.iOS.registerBackgroundService({url:'bg.js'});
		Ti.API.info("registered background service = "+service);
		
	});
}
 