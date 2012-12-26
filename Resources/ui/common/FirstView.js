//FirstView Component Constructor

function FirstView() {

	var json;
	var response;
	//create object instance, a parasitic subclass of Observable
	var self = Ti.UI.createView();
	var text = Array("", "", "openshift.redhat.com", "community", "@openshift", "#openshift", "@openshift_ops", "+openshift", "openshift@facebook");
	var links = Array("https://openshift.redhat.com/app/status", "", "https://openshift.redhat.com", "https://openshift.redhat.com/community", "https://mobile.twitter.com/openshift/", "https://mobile.twitter.com/search/openshift", "https://mobile.twitter.com/openshift_ops", "https://plus.google.com/108052331678796731786/posts", "http://www.facebook.com/openshift");
	var bg = "#CFCFCF";
	// create table view data object
	var data = [];

	var checkStatus = Ti.Network.createHTTPClient({
		onload : function() {
			//alert(this.responseText);
			response = JSON.parse(this.responseText);
			//response = this.responseText;
			//alert(response.open.length);
			
			
			if (response.open.length == 0) {
				text[0] = "Openshift Status: (OK)";
				bg = '#00611C';
			} else {
				text[0] = "Openshift Status: (" + response.open.length + ") Issue";
				if (response.open.length > 1)
				{
					text[0] = text[0] + "s";
				}
				bg = '#8B0000';
			}

			//for (var c = 0; c < 4; c++) {
			data[0] = Ti.UI.createTableViewSection({
				headerTitle : 'Cloud Engine Light'
			});

			for (var x = 0; x < text.length; x++) {
				data[0].add(Ti.UI.createTableViewRow({
					title : text[x],
					backgroundColor: bg,
					color: '#ffffff',
					shadowColor: '#aaaaaa',
                    shadowOffset:{x:5,y:5},
				}));
			}
			//}

			// create table view
			var tableview = Titanium.UI.createTableView({
				data : data,
				style : Titanium.UI.iPhone.TableViewStyle.GROUPED
			});

			// create table view event listener
			tableview.addEventListener('click', function(e) {
				// event data
				var index = e.index;
				var section = e.section;
				var row = e.row;
				var rowdata = e.rowData;
				//if (section.headerTitle.indexOf('clicked') == -1) {
				//	section.headerTitle = section.headerTitle + ' (clicked)';
				//}

				Titanium.Platform.openURL(links[e.index]);

			});

			// add table view to the window
			self.add(tableview);

		},
		onerror : function(e) {
			Ti.API.debug("STATUS: " + this.status);
			Ti.API.debug("TEXT: " + this.responseText);
			Ti.API.debug("ERROR: " + e.error);
			alert('There was an error retrieving the remote data. Try again.');
		}
	});

	checkStatus.open("GET", Ti.App.statusURL);
	checkStatus.send();

	return self;
}

module.exports = FirstView;
