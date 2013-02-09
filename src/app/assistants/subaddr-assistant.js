function SubaddrAssistant() {
}

var nAddr = new Array(10,0,0,0);
var nMask = new Array(255,0,0,0);

SubaddrAssistant.prototype.setup = function() {

	this.addr_cook = new Mojo.Model.Cookie('AdresseIP');
	this.mask_cook = new Mojo.Model.Cookie('Mask');

	this.TextAttributes = {
		hintText: $L('Enter IP address ...'),
		multiline: false,
		enterSubmits: false,
		preventResize: true,
		limitResize: 10,
		modelProperty: 'original',
		/* modifierState:Mojo.Widget.numLock */};
	this.TextModel = {
		'original': "",
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
		label : "Get all addresses",
		buttonClass : "",
		disabled : false};
	
	this.controller.setupWidget("addr_listing",
		this.attributes = {
			itemTemplate: 'templates/listitem',
			listTemplate: 'templates/listcontainer',
			swipeToDelete: false,
			reorderable: false
		},
		this.AddrListModel = {
			listTitle: "IP Adresses",
			items : []
		}
	);

	/* We activate the IP address Text field */
	this.controller.setupWidget('ip_addr', this.TextAttributes, this.TextModel);
	/* We activate the subnet mask Text field */
	this.controller.setupWidget('sub_mask', {hintText: $L('Enter subnet mask ...')}, this.TextModel);
	/* We activate the error message Text field */
	this.controller.setupWidget('error_msg', this.ErrorAttributes, this.ErrorModel);
	/* We activate the Calculate Button */
	this.controller.setupWidget('get_button', this.ButtonAttributes, this.ButtonModel);

	/* We activate the Calculate Button */ 
	Mojo.Event.listen($('get_button'), 'click', this.handleButtonPress.bindAsEventListener(this));
	
	// Setup a handler for the listTap event
	//this.listTapHandler = this.listTap.bindAsEventListener(this);
	//this.controller.listen('addr_listing', Mojo.Event.listTap, this.listTapHandler);
	Mojo.Log.info('ADDR_COOK === ' + this.addr_cook.get());
	if (this.addr_cook.get() != 'none'){
		Mojo.Log.info('ABOUT TO UPDATE IP ADDRESS & MASK');
		this.controller.get('ip_addr').mojo.setValue(this.addr_cook.get());
		this.controller.modelChanged(this.TextModel, 'ip_addr');
		this.controller.get('sub_mask').mojo.setValue(this.mask_cook.get());
		this.controller.modelChanged(this.TextModel, 'sub_mask');
	}
	else{
		Mojo.Log.info('NOTHING TO UPDATE FOR IP ADDRESS & MASK');
	};

};
SubaddrAssistant.prototype.handleButtonPress = function(event){
	
	/* Now that the button has been pressed, we need to check that the information
	in both IP address and subnet mask text fields are correct.*/
	this.controller.get('error_msg').update("");
	var ip = this.controller.get("ip_addr").mojo.getValue();
	var mask = this.controller.get("sub_mask").mojo.getValue();
	var result = checkFieldEntry(ip, mask);
	//console.log(result);
	
	this.addr_cook.put(ip);
	this.mask_cook.put(ip);
	
	if (result[0] != "S"){
		mask = result
		nAddr = calculateIP(this.controller.get("ip_addr").mojo.getValue());
		nMask = calculateSubnet(mask);
		
		var netid = subnetID(nAddr,nMask).split(".", 4);
		//console.log('NET ID : ' + netid);
		var nb_hosts = hostCount(nMask);
		//console.log('NB_HOSTS : ' + nb_hosts);
		var add_list = getAdresses(netid, nb_hosts);
		//console.log('ADDRESSES : ' + add_list);
		// place the address list in the ListModel and display it
		this.AddrListModel.items = add_list;
		this.controller.modelChanged(this.AddrListModel);
	}
	else{
		this.controller.get('error_msg').update(result);
	}
};

SubaddrAssistant.prototype.activate = function(event) {
};

SubaddrAssistant.prototype.deactivate = function(event) {
};

SubaddrAssistant.prototype.cleanup = function(event) {
};
