function CidrcalcAssistant() {
}

CidrcalcAssistant.prototype.setup = function() {
	this.toolsIndex = 2;
	this.toolsList = [
		{label: "Subnet Details", command: 'subdetails'},
		{label: "Classfull Subnet Creator", command: 'classcreator'},
		{label: "CIDR Calculator", command: 'cidrcalc'}, 
		{label: "Subnet Addresses", command: 'subaddr'}];
		
	var toolsMenuPrev = {};
	var toolsMenuNext = {};
	
	 if (this.toolsIndex > 0) {
	 toolsMenuPrev = { icon: 'back', command: 'do-previous'};
	 } else {
	 toolsMenuPrev = {icon: "", command: '', label: ""};
	 }
	 
	 if (this.toolsIndex < 3) {
	 toolsMenuNext = { icon: 'forward', command: 'do-next'};
	 } else {
	 toolsMenuNext = {icon: "", command: '', label: ""};
	 }
	
	this.controller.setupWidget("tools-menu", undefined, {items: this.toolsList});
	
	this.MenuAttributes = {
		visible : true
	}
	
	this.MenuModel = {
		visible: true,
		items: [toolsMenuPrev,
			{label: this.toolsList[this.toolsIndex].label,
			submenu: "tools-menu",
			width: 210},
			toolsMenuNext
		]
	};
	this.controller.setupWidget(Mojo.Menu.viewMenu, this.MenuAttributes, this.MenuModel);
};

CidrcalcAssistant.prototype.activate = function(event) {
};

CidrcalcAssistant.prototype.deactivate = function(event) {
};

CidrcalcAssistant.prototype.cleanup = function(event) {
};
CidrcalcAssistant.prototype.handleCommand = function(event) {
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