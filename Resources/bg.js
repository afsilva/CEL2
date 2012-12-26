Ti.API.info("hello from a background service!");
 
 
var alertCount = 0;
var notification = null;
 
function notify(resp){
	// This creates the notification alert on a 'paused' app
	notification = Ti.App.iOS.scheduleLocalNotification({
		alertBody:resp,
		alertAction:"OK",
		userInfo:{"hello":"world"},
		badge:alertCount,
		date:new Date(new Date().getTime() + 10)
	});
}
 
 
function checkFeed(){
 
        // silently ignore this if there's no network connection
	if (Titanium.Network.online == false) {
		return;
	}
 
	var t = new Date().getTime();
	Ti.API.info('checking feed in bg.. '+t);
 
	var xhr = Titanium.Network.createHTTPClient();
	xhr.timeout = 1000000;
	xhr.onerror = function(e){
		Ti.API.info('IN ERROR ' + e.error);
	};
	xhr.onload = function(){
	
		
        var response = this.responseText;				
		// open the notification
		var json = JSON.parse(response);
		var openIssues = json.open.length;
		
		if (openIssues > 0)
		{
			Ti.API.info("the reply was: "+openIssues);
			//set the badge number...
			alertCount=openIssues;
			var t = "Openshift Status: (" + openIssues + ") Issue";
			if (openIssues > 1)
			{
					t = t+"s";
			}
			Ti.API.info("the reply was: " + t);
			notify(t);
		} else {
			alertCount=0;
			Ti.App.iOS.cancelAllLocalNotifications();
		}

		
	};
	
	xhr.open("GET", Ti.App.statusURL);
	xhr.send();
	
 
}
 
Ti.App.iOS.addEventListener('notification',function(){
	Ti.API.info('background event received = '+notification);
	Ti.App.currentService.stop();
	Ti.App.currentService.unregister();
});
 
// Kick off a timer to trigger a function called 'checkFeed' every 10 seconds (= 10000 ms)
//var timer = setInterval(checkFeed, 1800000);
var timer = setInterval(checkFeed, Ti.App.sleepTime);