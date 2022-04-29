sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "acc/products/utils/OdataService"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageToast, OdataService) {
        "use strict";

        return Controller.extend("acc.products.controller.MainView", {
            onInit: function () {
                let oMainModel = new JSONModel([]);
                this.getView().setModel(oMainModel, "ProductsJSONModel");
                this.getProductsModel();
            },

            //Cómo tener un JSON model
            getProductsModel: function () {
                                // Primero solicitamos al servicio la cantitad total de items que existen 
                                this.getOdataService().read("/Products/$count")
                                .then(oResponseCount => {
                                    // salió todo ok
                                    // Una vez tengamos el total, hacemos un read al servicio pasando
                                    // como parámetro un $top con la cantidad total que retornó
                                    // la request anterior
                                    this.getOdataService().read(`/Products`, {
                                        urlParameters: { "$top": oResponseCount }
                                    })
                                        .then(oResponse => {
                                            // Vamos a crear nuestro JSONMODEL
                                            let oModel = new JSONModel(oResponse.results);
                                            this.getView().setModel(oModel, "ProductsJSONModel");
            
                                        })
                                        .catch(oError => {
                                            // salió todo mal
                                            MessageToast.show("Anduvo mal");
                                            console.error("Bajón: ", oError);
                                        })
                                })
                                .catch(oError => {
                                    // salió todo mal
                                    MessageToast.show("Anduvo mal");
                                    console.error("Bajón: ", oError);
                                });

                                
                // this.getOdataService().read(sPath, {
                //     "$skiptoken": sSkipTokenParam
                // })
                //     .then(oResponse => {
                //         debugger;
                //         let sSkipToken,
                //             aResponse,
                //             sPath,
                //             aCurrentDataFromModel;
                //         aResponse = oResponse.results;
                //         aCurrentDataFromModel = this.getView().getModel("ProductsJSONModel").getData();

                //         if (aCurrentDataFromModel.length) {
                //             aCurrentDataFromModel.concat(aResponse)
                //         } else {
                //             aCurrentDataFromModel = aResponse;
                //         }

                //         this.getView().getModel("ProductsJSONModel").setData(aCurrentDataFromModel);
                //         if (oResponse.__next) {
                //             // aCurrentDataFromModel.length > 0 ? aCurrentDataFromModel.concat(aResponse) : aCurrentDataFromModel = aResponse;
                //             sSkipToken = oResponse.__next.split("=").pop();
                //             this.getProductsModel("/Products", sSkipToken);
                //         }
                //     })
                //     .catch(oError => {
                //         // salió todo mal
                //         MessageToast.show("Anduvo mal");
                //         console.error("Bajón: ", oError);
                //     });
            },

            /**
             * Method for using Odata Services.
             * @public
             * @returns the oData Service
             */
            getOdataService: function () {
                if (!this._odataService) {
                    this._odataService = new OdataService(this.getOwnerComponent().getModel("ProductsModel"));
                }
                return this._odataService;
            },
        });
    });
