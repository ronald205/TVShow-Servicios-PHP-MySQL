sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel"
], function (Controller,JSONModel,ResourceModel) {
    "use strict";

    return Controller.extend("sap.ui.FirstUI5.wt.controller.ShowsList", {

        onShowHello: function () {
            // show a native JavaScript alert
            alert("Hello World");
        },

        onPress: function (oEvent) {
            
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            var oItem = oEvent.getSource();
            var oCtx = oItem.getBindingContext();

            oRouter.navTo("detail",{
                id: oCtx.getProperty("id")
            });
        }

    });
});