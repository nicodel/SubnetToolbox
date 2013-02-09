function MenuAssistant() {
}

MenuAssistant.prototype.setup = function() {
	
	this.addr_cook = new Mojo.Model.Cookie('AdresseIP');
	this.addr_cook.put('none');
	this.mask_cook = new Mojo.Model.Cookie('Mask');
	this.mask_cook.put('none');
	
	this.menuTapHandler = this.listTap.bindAsEventListener(this);
	this.controller.listen('MenuList', Mojo.Event.listTap, this.menuTapHandler);

    this.controller.setupWidget("MenuList",
        this.attributes = {
            itemTemplate: "templates/menuitem",
            listTemplate: "templates/menucontainer",
            //addItemLabel: "Add ...",
            swipeToDelete: false,
            reorderable: false,
            //emptyTemplate:"list/emptylist"
         },
         this.model = {
             listTitle: "Available tools",
             items : [
                 {title: "Get a subnet details", id:"1"},
                 //{title: "Create classfull subnets", id:"2"},
                 //{title: "Calculate CIDR", id:"3"},
                 {title: "List all subnet addresses", id:"4"}
             ]
          }
    );
	
	this.InfoAttributes = {
		multiline: false,
		enterSubmits: false,
		preventResize: true,
		limitResize: 10,
		modelProperty: 'original'};
	this.InfoModel = {
		'original': "",
		disabled: true};
	
	this.controller.setupWidget('info_msg', this.InfoAttributes, this.InfoModel);
};

MenuAssistant.prototype.listTap = function (event) {
	this.controller.get('info_msg').update("")
	var id = event.originalEvent.target.id,
		className = event.originalEvent.target.className,
		curDrawer, curDrawerNode;
	Mojo.Log.info("Classname:", className, "title:", event.originalEvent.target.title);
	
	Mojo.Log.info("tagName:", event.originalEvent.target.tagName);
	
	if(event.originalEvent.target.tagName == "DIV") {
		Mojo.Log.info("item:" +event.item.id +": "+event.item.title);
		if(event.item.id == "1") {
			this.controller.stageController.pushScene("subdetails")
		}
		if(event.item.id == "2") {
			this.controller.get('info_msg').update("Not available yet")
		}
		if(event.item.id == "3") {
			this.controller.get('info_msg').update("Not available yet")
		}
		if(event.item.id == "4") {
			this.controller.stageController.pushScene("subaddr")
		}
	};
};


MenuAssistant.prototype.handleUpdate = function(event){

	console.log("Subnet Details was changed");

};

MenuAssistant.prototype.activate = function(event) {
};

MenuAssistant.prototype.deactivate = function(event) {
};

MenuAssistant.prototype.cleanup = function(event) {
};

MenuAssistant.prototype.handleCommand = function(event) {

};
