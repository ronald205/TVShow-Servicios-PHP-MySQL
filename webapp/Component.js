sap.ui.define([
   "sap/ui/core/UIComponent",
   "sap/ui/model/json/JSONModel",
   "sap/ui/model/resource/ResourceModel"
], function (UIComponent, JSONModel, ResourceModel) {
   "use strict";
   return UIComponent.extend("sap.ui.FirstUI5.wt.Component", {
            metadata : {
		          manifest: "json"       
      },
      init : function () {
            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);
            // create a TVShows Model
            var oTVShowsModel = new JSONModel();
            // load data from URL
            oTVShowsModel.loadData('http://localhost/TVShows-UI5/webapp/php/tvshows');
            //Set This Model to the View
            this.setModel(oTVShowsModel);

            //console.log(oTVShowsModel);

            // set i18n model on view
            var i18nModel = new ResourceModel({
                bundleName: "sap.ui.FirstUI5.wt.i18n.i18n"
                });
            this.setModel(i18nModel, "i18n");

            // create the views based on the url/hash
            this.getRouter().initialize();

      }

   });
});