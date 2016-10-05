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

	return Controller.extend("sap.ui.FirstUI5.wt.controller.New", {

		onInit: function () {
			/*var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);

			// Set the initial form to be the display one
			*/
			
			//URL Path
			modelPath = "http://localhost/TVShows-UI5/webapp/php/tvshows"

			//Create an Empty TV Show Model
            var oTVShowModel = new JSONModel();
            //Assign to the view
            var oView = this.getView();
            oView.setModel(oTVShowModel,"TVShow"); 

            //Show Change Fragment
			this._showFormFragment("ChangeDetail");

		},

		handleCancelPress : function () {

			//Nav Back
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("overview", true);
			}

		},

		handleSavePress : function () {

			var that = this;
			//Save the Data
			var oModel = this.getView().getModel("TVShow");
			jQuery.ajax({
				type: "POST",
				contentType : "application/json",
				url : modelPath,
				dataType : "json",
				async: true,
				data: JSON.stringify(oModel.getData()),
				success : function(data,textStatus, jqXHR) {
                	console.log("success to Update");
                	MessageToast.show("Successfully Saved",{duration: 2000});
                	//Refresh Model
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
            		MessageToast.show("Error Occurred, Try Again",{duration: 2000});
            		console.log(err);
            	}
			});


			/*
			//Save the data...
			var oModel = this.getView().getModel("TVShow");
			oModel.loadData(modelPath,oModel.getData(),true,"POST");
			*/
			//this._toggleButtonsAndView(false);



		},


		_onObjectMatched: function (oEvent) {
			var oArgs, oView;
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();

			
			// create a TVShow Model
            var oTVShowModel = new JSONModel();
            // load data from URL
            modelPath = "http://localhost/TVShows-UI5/webapp/php/tvshows/" + oArgs.id;
            oTVShowModel.loadData(modelPath);
            //Set This Model to the View
            oView.setModel(oTVShowModel,"TVShow"); 

            /*
			oView.bindElement({
				path : "/(" + oArgs.id + ")",
				events : {
					change: this._onBindingChange.bind(this),
					dataRequested: function (oEvent) {
						oView.setBusy(true);
					},
					dataReceived: function (oEvent) {
						oView.setBusy(false);
					}
				}
			}); */

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

			//var oModel = this.getView().getModel("TVShow")
			
			oPage.removeAllContent();
			oPage.insertContent(this._getFormFragment(sFragmentName));

			//this.getView().setModel(oModel,"TVShow");

		}
	});
});