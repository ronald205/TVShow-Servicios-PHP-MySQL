sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel"
], function (Controller,JSONModel,ResourceModel) {
    "use strict";

    return Controller.extend("sap.ui.FirstUI5.wt.controller.App", {

        onAfterRendering: function() {

        },

        onInit: function() {
            /*
            // create a TVShows Model
            var oTVShowsModel = new JSONModel();
            // load data from URL
            oTVShowsModel.loadData('http://localhost:8888/proxy/api/tvshows');
            //Set This Model to the View
            this.setModel(oTVShowsModel);
            */
        },


    	handleNewPress: function() {
    		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("new");
    	}

    });
});