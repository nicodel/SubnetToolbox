function SubdetailsAssistant() {
}

var nAddr = new Array(10,0,0,0);
var nMask = new Array(255,0,0,0);

SubdetailsAssistant.prototype.setup = function() {

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
		label : "Calculate",
		buttonClass : "",
		disabled : false};

	/* We activate the IP address Text field */
	this.controller.setupWidget('ip_addr', this.TextAttributes, this.TextModel);
	/* We activate the subnet mask Text field */
	this.controller.setupWidget('sub_mask', {hintText: $L('Enter subnet mask ...')}, this.TextModel);
	/* We activate the error message Text field */
	this.controller.setupWidget('error_msg', this.ErrorAttributes, this.ErrorModel);
	/* We activate the Calculate Button */
	this.controller.setupWidget('calc_button', this.ButtonAttributes, this.ButtonModel);

	/* We activate the Calculate Button */ 
	Mojo.Event.listen($('calc_button'), 'click', this.handleButtonPress.bindAsEventListener(this));
	
	Mojo.Log.info('ADDR_COOK === ' + this.addr_cook.get());
	if (this.addr_cook.get() != 'none'){
		Mojo.Log.info('ABOUT TO UPDATE IP ADDRESS & MASK');
		this.TextModel = {value : 'TEST'};
		this.controller.setWidgetModel('ip_addr', this.TextModel);
	}
	else{
		Mojo.Log.info('NOTHING TO UPDATE FOR IP ADDRESS & MASK');
	};

};
SubdetailsAssistant.prototype.handleButtonPress = function(event){
	
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
		this.controller.get('net_id').update(subnetID(nAddr,nMask));
		var wild = wildcardMask(nMask);
		this.controller.get('broadcast').update(broadcast(nAddr,wild.split(".", 4)));
		this.controller.get('nb_hosts').update(hostCount(nMask));
		this.controller.get('wildcard').update(wildcardMask(nMask));
		this.controller.get('cidr_notation').update(octet2cidr(nMask));
		this.controller.get('subnet_mask').update(mask);
	}
	else{
		this.controller.get('error_msg').update(result);
	}
};

SubdetailsAssistant.prototype.activate = function(event) {
};

SubdetailsAssistant.prototype.deactivate = function(event) {
};

SubdetailsAssistant.prototype.cleanup = function(event) {
};
