function ClasscreatorAssistant() {
}

var nAddr = new Array(10,0,0,0);
var nMask = new Array(255,0,0,0);

ClasscreatorAssistant.prototype.setup = function() {

	this.TextAttributes = {
		hintText: $L('Enter IP address ...'),
		multiline: false,
		enterSubmits: false,
		preventResize: true,
		limitResize: 10,
		modelProperty: 'original',
		modifierState:Mojo.Widget.numLock};
	this.TextModel = {
		'original': "",
		disabled: false};
	this.MaskTextModel = {
		'original': "",
		disabled: false};
	
	this.HostListSelectModel = {
		value: 'Choose ...',
		disabled: false};
	this.SubListSelectModel = {
		value: 'Choose ...',
		disabled: false};

	this.ErrorAttributes = {
		multiline: false,
		enterSubmits: false,
		preventResize: true,
		limitResize: 10,
		modelProperty: 'original'};
	this.ErrorModel = {
		'original': "",
		disabled: true};

	this.ButtonAttributes = {};
	this.ButtonModel = {
		label : "Generate Subnets",
		buttonClass : "",
		disabled : false};

	/* We activate the IP address Text field */
	this.controller.setupWidget('ip_addr', this.TextAttributes, this.TextModel);
	/* We activate the subnet mask Text field */
	this.controller.setupWidget('sub_mask', {hintText: $L('Enter subnet mask ...'), modifierState:Mojo.Widget.numLock}, this.MaskTextModel);

	/* we activate both list selector widget */
	this.controller.setupWidget('nb_hosts', {label: $L('nb of hosts'), choices: this.numberHostList}, this.HostListSelectModel);
	this.controller.setupWidget('nb_sub', {label: $L('nb of subnets'), choices: this.numberSubnetList}, this.SubListSelectModel);
	
	/* We activate the error message Text field */
	this.controller.setupWidget('error_msg', this.ErrorAttributes, this.ErrorModel);
	
	/* We activate the Generate Button */
	this.controller.setupWidget('gen_button', this.ButtonAttributes, this.ButtonModel);

	/* We activate the listeners */
	//this.handleUpdateTextField = this.handleUpdateTextField.bindAsEventListener(this);
	Mojo.Event.listen(this.controller.get('gen_button'),Mojo.Event.tap, this.handleButtonPress.bind(this));  
	//Mojo.Event.listen('gen_button', 'click', this.handleButtonPress.bindAsEventListener(this));
	Mojo.Event.listen(this.controller.get('ip_addr'), Mojo.Event.propertyChange, this.handleUpdateTextField.bind(this));
	Mojo.Event.listen(this.controller.get('sub_mask'), Mojo.Event.propertyChange, this.handleUpdateTextField.bind(this));
	
	this.selectorChanged = this.selectorChanged.bindAsEventListener(this);
	Mojo.Event.listen(this.controller.get('nb_sub'), Mojo.Event.propertyChange, this.selectorChanged);
	
	this.controller.setupWidget('taskListing', 
		{
			itemTemplate: 'templates/listitem',
			listTemplate: 'templates/listcontainer',
			swipeToDelete: false,
			renderLimit: 30,  
			delay: 300,
/*
			formatters: {
				note: this.formatNote.bind(this),
				hasnote: this.formatHasNote.bind(this),
				},
*/
			reorderable: false
		},
		this.taskListModel = {disabled: false}
	);
 
	// Setup a handler for the listTap event
	this.listTapHandler = this.listTap.bindAsEventListener(this);
	this.controller.listen('taskListing', Mojo.Event.listTap, this.listTapHandler);
	
	this.taskListModel.items = [
		{title: "First list item", note: ""},
		{title: "Second list item", note: "This item has a note!"},
		{title: "Third list item", note: ""},
		{title: "Fourth list item", note: "Another note"}
	];
	this.controller.modelChanged(this.taskListModel);

};

ClasscreatorAssistant.prototype.listTap = function (event) {
	var id = event.originalEvent.target.id,
		className = event.originalEvent.target.className,
		curDrawer, curDrawerNode;
	Mojo.Log.info("Classname:", className, "Id:", id);
	
	Mojo.Log.info("tagName:", event.originalEvent.target.tagName);
	
	if(event.originalEvent.target.tagName == "LABEL") {
		Mojo.Log.info(event.item.data +": "+event.item.definition);
	};
	if (className === 'done-icon-note' || className === 'mynote') {
 
		Mojo.Log.info("Note Icon or drawer tapped!", id, className);
 
		curDrawerNode = this.controller.get('taskListing').mojo.getNodeByIndex(event.index);
		curDrawer = curDrawerNode.getElementsByClassName('note-container')[0];
 
		if (curDrawer.getStyle('display') === 'none') {
			curDrawer.show();
		}
		else {
			curDrawer.hide();
			this.controller.get('taskListing').mojo.getList().mojo.revealItem(event.index);
		}
 
		return;
	}
/*
	this.controller.stageController.pushScene('edittask', 
			this.taskListModel.items[event.index]);
*/
};

ClasscreatorAssistant.prototype.toggleDrawer = function(event){
/*
	itemTaped = event.item
	this.drawer = this.controller.get('sub_drawer');
	this.drawer.mojo.setOpenState(!this.drawer.mojo.getOpenState());
*/
}

ClasscreatorAssistant.prototype.selectorChanged = function(event) {
	var host = this.HostListSelectModel.value;
	var sub = this.SubListSelectModel.value;
};

ClasscreatorAssistant.prototype.handleUpdateTextField = function(event){
	this.controller.get('error_msg').update("");
	var ip = this.controller.get("ip_addr").mojo.getValue();
	var mask = this.controller.get("sub_mask").mojo.getValue();
	
	var result = this.checkFieldAfterChanged(ip, mask);
	
	console.log("RESULT : " + result);
	if (result[0] != "S"){
		nAddr = calculateIP(this.controller.get("ip_addr").mojo.getValue());
		
		this.controller.get("sub_mask").mojo.setValue(result);
		nMask = calculateSubnet(result);
		
		this.SubListSelectModel.value = subnetCount(nMask);
		this.controller.modelChanged(this.SubListSelectModel);
		
		this.HostListSelectModel.value = hostCount(nMask);
		this.controller.modelChanged(this.HostListSelectModel);
	}
	else{
		this.controller.get('error_msg').update(result);
	}
};


ClasscreatorAssistant.prototype.handleButtonPress = function(event){
	/* Now that the button has been pressed, we need to check that the information
	in both IP address and subnet mask text fields are correct.*/
	this.controller.get('error_msg').update("");
	var ip = this.controller.get("ip_addr").mojo.getValue();
	var mask = this.controller.get("sub_mask").mojo.getValue();

	var host = this.HostListSelectModel.value;
	var sub = this.SubListSelectModel.value;
	
	var result = this.checkFieldAfterButtonPressed(ip, mask, sub, host);
	console.log("DEBUG result = " + result);
	
	if (result[0] != "S"){
		nAddr = calculateIP(this.controller.get("ip_addr").mojo.getValue());
		nMask = calculateSubnet(result);
		console.log("GENERATE LISTS");
		console.log("IP : " + ip);
		console.log("MASK : " + result);
		console.log("NB SUBNETS : " + sub);
		console.log("NB HOSTS : " + host);
		console.log("##################################");
		console.log("NB SUBNETS : " + subnetCount(nMask));
		console.log("NB HOSTS : " + hostCount(nMask));
		console.log("##################################");
		//console.log("LIST OF SUBNETS : " + list);
		
		this.SubListSelectModel.value = subnetCount(nMask);
		this.controller.modelChanged(this.SubListSelectModel);
		
		this.HostListSelectModel.value = hostCount(nMask);
		this.controller.modelChanged(this.HostListSelectModel);
		
	}
	else{
		this.controller.get('error_msg').update(result);
	}
};

ClasscreatorAssistant.prototype.checkFieldAfterChanged = function (ip, mask){
	if (ip == "" ) {
		return "Specify a valid IP address (ex: 192.168.10.1).";
	}
	else if (ip.match(/[^1234567890\.]/i) != null) {
		return "Specify a valid IP address (ex: 192.168.10.1).";
	}
	var i = ip.split(".");
	if (i.length != 4) {
		return "Specify a valid IP address (ex: 192.168.10.1).";
	}
	for (var x = 0; x < 4; x++) {
		var a = parseInt(i[x])
		if (a<=0 | a>=255){
			return "Specify a valid IP address (ex: 192.168.10.1).";
		}
	}
	if (mask != "" || mask.match(/[^1234567890\.]/i)!=null){
		var m = mask.split(".");
		if (m.length!=4 && isNaN(mask) == false){
			var mask = parseInt(mask)
			if (mask<=0 | mask>=33){
				return "Specify a valid subnet mask (ex: 255.255.255.0 or 24).";
			}
			else{
				mask = cidr2octet(m);
				return mask.join(".")
			}
		}
		for (var x=0; x<4; x++){
			var b = m[x]
			if (b.match(/0|128|192|224|240|248|252|255/i)==null){
				return "Specify a valid subnet mask (ex: 255.255.255.0 or 24).";
			}
		}
	}
	return "255.255.255.0";
};

ClasscreatorAssistant.prototype.checkFieldAfterButtonPressed = function (ip, mask, sub, host){
	/* we check if one or both fields are empty,
	 * and return the right message.
	 */
	if (ip == ""){
		return "Specify valid IP address (ex: 192.168.10.1)."
	}
	else if (ip == "" && mask != ""){
		return "Specify a valid IP address (ex: 192.168.10.1).";
	}
	else if (ip != "" && mask == ""){
		return "Specify a valid subnet mask (ex: 255.255.255.0 or 24).";
	}
	/* we check if fields only contains numbers and dots,
	 * and return an explicit error if it is the case.
	 */
	else if (ip.match(/[^1234567890\.]/i)!=null && mask.match(/[^1234567890\.]/i)!=null){
		return "Specify valid IP address and subnet mask (ex: 192.168.10.1, 255.255.255.0 or 24).";
	}
	else if (ip.match(/[^1234567890\.]/i)!=null && mask.match(/[^1234567890\.]/i)==null){
		return "Specify a valid IP address (ex: 192.168.10.1).";
	}
	else if (ip.match(/[^1234567890\.]/i)==null && mask.match(/[^1234567890\.]/i)!=null){
		return "Specify a valid subnet mask (ex: 255.255.255.0 or 24).";
	}
	/* we check that both fields are composed of 4 digits separated by dots,
	 * and return an explicit error if it is the case.
	 */
	var i = ip.split(".");
	var m = mask.split(".");
	if (i.length!=4){
		return "Specify a valid IP address (ex: 192.168.10.1).";
	}
	if (m.length!=4 && isNaN(mask) == false){
		var mask = parseInt(mask)
		if (mask<=0 | mask>=33){
			return "Specify a valid subnet mask (ex: 255.255.255.0 or 24).";
		}
		else{
			mask = cidr2octet(m);
			return mask.join(".")
		}
	}
	for (var x=0; x<4; x++){
		var a = parseInt(i[x])
		var b = m[x]
		if (a<=0 | a>=255){
			return "Specify a valid IP address (ex: 192.168.10.1).";
		}
		else if (b.match(/0|128|192|224|240|248|252|255/i)==null){
			return "Specify a valid subnet mask (ex: 255.255.255.0 or 24).";
		}
	}
	/* if nothing is wrong,
	 * return subnet mask
	 */
	return mask
};

ClasscreatorAssistant.prototype.handleCommand = function(event) {
		if (event.type == Mojo.Event.command) {
		switch (event.command) {
			case 'subdetails':
				Mojo.Controller.stageController.swapScene(
					{
						transition : Mojo.Transition.crossFade,
						name : 'subdetails'
					});
				break;
			case 'classcreator':
				Mojo.Controller.stageController.swapScene(
					{
						transition : Mojo.Transition.crossFade,
						name : 'classcreator'
					});
				break;
			case 'cidrcalc':
				Mojo.Controller.stageController.swapScene(
					{
						transition : Mojo.Transition.crossFade,
						name : 'cidrcalc'
					});
				break;
			case 'subaddr':
				Mojo.Controller.stageController.swapScene(
					{
						transition : Mojo.Transition.crossFade,
						name : 'subaddr'
					});
				break;
			case 'do-next':
				Mojo.Controller.stageController.swapScene(
					{
						transition : Mojo.Transition.crossFade,
						name : this.toolsList[this.toolsIndex+1].command
					});
				break;
			case 'do-previous':
				Mojo.Controller.stageController.swapScene(
					{
						transition : Mojo.Transition.crossFade,
						name : this.toolsList[this.toolsIndex-1].command
					});
				break;
		}
	}
};

ClasscreatorAssistant.prototype.activate = function(event) {
};

ClasscreatorAssistant.prototype.deactivate = function(event) {
}
;
ClasscreatorAssistant.prototype.cleanup = function(event) {
	
	Mojo.Event.stopListening(this.controller.get('ip_addr'), Mojo.Event.propertyChange, this.handleUpdateTextField.bind(this));
	Mojo.Event.stopListening(this.controller.get('sub_mask'), Mojo.Event.propertyChange, this.handleUpdateTextField.bind(this));
	Mojo.Event.stopListening(this.controller.get('nb_sub'), Mojo.Event.propertyChange, this.selectorChanged);
	//Mojo.Event.stopListening(this.controller.get('sub_list'), Mojo.Event.listTap, this.toggleDrawer);
};

ClasscreatorAssistant.prototype.subnetList = [
			{id:"0", subnet:$L("10.2.1.0"), mask:$L("255.255.255.0"), subnet_size:$L("254"), host_range:$L("10.2.1.1 to 10.2.1.254")},
			{id:"1", subnet:$L("10.2.2.0"), mask:$L("255.255.255.0"), subnet_size:$L("254"), host_range:$L("10.2.2.1 to 10.2.2.254")},
			{id:"2", subnet:$L("10.2.3.0"), mask:$L("255.255.255.0"), subnet_size:$L("254"), host_range:$L("10.2.3.1 to 10.2.3.254")},
			{id:"3", subnet:$L("10.2.4.0"), mask:$L("255.255.255.0"), subnet_size:$L("254"), host_range:$L("10.2.4.1 to 10.2.4.254")},
			{id:"4", subnet:$L("10.2.5.0"), mask:$L("255.255.255.0"), subnet_size:$L("254"), host_range:$L("10.2.5.1 to 10.2.5.254")}
		];
ClasscreatorAssistant.prototype.numberSubnetList = [
			{label: "1", value: 1},
			{label: "2", value: 2},
			{label: "4", value: 4},
			{label: "8", value: 8},
			{label: "16", value: 16},
			{label: "32", value: 32},
			{label: "64", value: 64},
			{label: "128", value: 128},
			{label: "256", value: 256},
			{label: "512", value: 512},
			{label: "1024", value: 1024},
			{label: "2048", value: 2048},
			{label: "4096", value: 4096},
			{label: "8192", value: 8192},
			{label: "16384", value: 16384},
			{label: "32768", value: 32768},
			{label: "65536", value: 65536},
			{label: "131072", value: 131072},
			{label: "262144", value: 262144},
			{label: "524288", value: 524288},
			{label: "1048576", value: 1048576},
			{label: "2097152", value: 2097152},
			{label: "4194304", value: 4194304},
			{label: "8388608", value: 8388608},
			{label: "16777216", value: 16777216},
		];

ClasscreatorAssistant.prototype.numberHostList = [
			{label: "1", value: 1},
			{label: "2 (RFC3021)", value: 3},
			{label: "2", value: 2},
			{label: "6", value: 6},
			{label: "14", value: 14},
			{label: "30", value: 30},
			{label: "62", value: 62},
			{label: "126", value: 126},
			{label: "254", value: 254},
			{label: "510", value: 510},
			{label: "1022", value: 1022},
			{label: "2046", value: 2046},
			{label: "4094", value: 4094},
			{label: "8190", value: 8190},
			{label: "16382", value: 16382},
			{label: "32766", value: 32766},
			{label: "65534", value: 65534},
			{label: "131070", value: 131070},
			{label: "262142", value: 262142},
			{label: "524286", value: 524286},
			{label: "1048574", value: 1048574},
			{label: "2097150", value: 2097150},
			{label: "4194302", value: 4194302},
			{label: "8388606", value: 8388606},
			{label: "16777214", value: 16777214},
		];
