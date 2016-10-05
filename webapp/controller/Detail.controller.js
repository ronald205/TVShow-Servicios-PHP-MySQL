sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/Fragment',
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/ODataModel",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast"
], function (jQuery, Fragment, Controller, ODataModel, JSONModel, History, MessageToast) {
	"use strict";
	
	var globalDataModel;
	var modelPath;

	return Controller.extend("sap.ui.FirstUI5.wt.controller.Detail", {

		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);

			// Set the initial form to be the display one
			this._showFormFragment("DisplayDetail");
		},

		handleEditPress : function () {

			//Clone the data
			globalDataModel = this.getView().getModel("TVShow");
			this._globalData = jQuery.extend({},this.getView().getModel("TVShow").getData());
			this._toggleButtonsAndView(true);

		},

		handleCancelPress : function () {

			//Restore the data
			var oModel = this.getView().getModel("TVShow");
			var oData = oModel.getData();
			oData = this._globalData;
			oModel.setData(oData);

			this._toggleButtonsAndView(false);

		},

		handleSavePress : function () {

			//Save the data...
			//

			var that = this;
			var oModel = this.getView().getModel("TVShow");
			var oData = oModel.getData();

			jQuery.ajax({
				type: "PUT",
				contentType : "application/json",
				url : modelPath,
				dataType : "json",
				async: true,
				data: JSON.stringify(oData),
				success : function(data,textStatus, jqXHR) {
                	console.log("success to Update");
                	MessageToast.show("Successfully Updated",{duration: 2000});
                	that._toggleButtonsAndView(false);
            	},
            	error : function(err){
            		//Restore the data
					var oModel = that.getView().getModel("TVShow");
					var oData = oModel.getData();
					oData = that._globalData;
					oModel.setData(oData);
            		that._toggleButtonsAndView(false);

            		MessageToast.show("Error Occurred, Try Again",{duration: 2000});
            		console.log(err);
            	}
			});

		},

		handleDeletePress: function(){
			var that = this;

			jQuery.ajax({
				type: "DELETE",
				contentType : "application/json",
				url : modelPath,
				dataType : "json",
				async: true,
				success : function(data,textStatus, jqXHR) {
                	console.log("success to delete");
                	MessageToast.show("Successfully Deleted",{duration: 2000});

                	//Refresh Model and go Back
					var oModelTVShows = that.getView().getModel();
					oModelTVShows.loadData('http://localhost/TVShows-UI5/webapp/php/tvshows');
					//Nav Back
					var oHistory = History.getInstance();
					var sPreviousHash = oHistory.getPreviousHash();

					if (sPreviousHash !== undefined) {
						window.history.go(-1);
					} else {
					var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
					oRouter.navTo("overview", true);
					}

            	},
            	error : function(err){
            		console.log("Error");
            		console.log(err);
            	}
			});
		},

		onNavBack: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("overview", true);
			}
		},

		_onObjectMatched: function (oEvent) {
			var oArgs, oView;
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();
			var that = this,
			tvShow = this.getView().getModel("TVShow");

			
			// create a TVShow Model
            var oTVShowModel = new JSONModel();

            // load data from URL
            modelPath = "http://localhost/TVShows-UI5/webapp/php/tvshows/" + oArgs.id;
            console.log(modelPath);
            
            var aData = jQuery.ajax({
               type : "GET",
               contentType : "application/json",
               url : modelPath,
               dataType : "json",
               async: true, 
               success : function(data) {
                  //var oTVShowsModel = new sap.ui.model.json.JSONModel(data);
                  //that.getView().setModel(oTVShowsModel,"TVShow");
                  tvShow.setProperty("/title/",   data[0].title);
                  tvShow.setProperty("/year/",    data[0].year);
                  tvShow.setProperty("/country/", data[0].country);
                  tvShow.setProperty("/poster/",  data[0].poster);
                  tvShow.setProperty("/seasons/", data[0].seasons);
                  tvShow.setProperty("/genre/",   data[0].genre);
                  tvShow.setProperty("/summary/", data[0].summary);                
                  //console.log(data);
                  //console.log(tvShow);
               },
               error: function (xhr, ajaxOptions, thrownError) {
                  console.log(xhr);
                  console.log(ajaxOptions);
                  console.log(thrownError);
               }

           });            

           // oTVShowModel.loadData(modelPath);
           // oView.setModel(oTVShowModel,"TVShow"); 
		},
		_onBindingChange : function (oEvent) {
			// No data for the binding
			if (!this.getView().getBindingContext()) {
				this.getRouter().getTargets().display("notFound");
			}
		},

		_formFragments: {},

		_toggleButtonsAndView : function (bEdit) {
			var oView = this.getView();

			// Show the appropriate action buttons
			oView.byId("edit").setVisible(!bEdit);
			oView.byId("delete").setVisible(!bEdit);
			oView.byId("save").setVisible(bEdit);
			oView.byId("cancel").setVisible(bEdit);

			// Set the right form type
			this._showFormFragment(bEdit ? "ChangeDetail" : "DisplayDetail");
		},

		_getFormFragment: function (sFragmentName) {
			var oFormFragment = this._formFragments[sFragmentName];

			if (oFormFragment) {
				return oFormFragment;
			}

			oFormFragment = sap.ui.xmlfragment(this.getView().getId(), "sap.ui.FirstUI5.wt.fragment." + sFragmentName);

			return this._formFragments[sFragmentName] = oFormFragment;
		},

		_showFormFragment : function (sFragmentName) {
			var oPage = this.getView().byId("page");

			
			
			oPage.removeAllContent();
			oPage.insertContent(this._getFormFragment(sFragmentName));
			
			//var oModel = this.getView().getModel("TVShow")
			//this.getView().setModel(oModel,"TVShow");

		}
	});
});