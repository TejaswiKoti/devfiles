sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/util/File",
    'sap/ui/export/library',
    'sap/ui/export/Spreadsheet',
    'sap/ui/model/odata/v2/ODataModel',
    "sap/ushell/services/UserInfo"
], function(MessageToast, MessageBox, File, exportLibrary, Spreadsheet, ODataModel) {
    'use strict';
    var that;

    return {
        onInit:function(){
            that=this;
            that.oDataModel = that.getOwnerComponent().getModel();
            that.oDataModel.read("/LOCATION_STB",{
                success:function(data){
                    that.data= data.results
                },
                error:function(){}
            })
            if (!this.browseDialog) {
                this.browseDialog = sap.ui.xmlfragment("vcpif.vcplocation.fragments.browse", this);
            }
            if (!this.createDialog) {
                this.createDialog = sap.ui.xmlfragment("vcpif.vcplocation.fragments.create", this);
            }
           
            that.table = that.byId("vcpif.vcplocation::sap.suite.ui.generic.template.ListReport.view.ListReport::LOCATION_STB--responsiveTable")
            var jQueryScript = document.createElement('script');

            jQueryScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.10.0/xlsx.js');

            document.head.appendChild(jQueryScript);



            var jQueryScript = document.createElement('script');

            jQueryScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.10.0/jszip.js');

            document.head.appendChild(jQueryScript);

            that.byId("vcpif.vcplocation::sap.suite.ui.generic.template.ListReport.view.ListReport::LOCATION_STB--addEntry").setVisible(false);
        },
        onBrowse: function (oEvent) {
            this.browseDialog.open();
            sap.ui.getCore().byId("idUpload").setValue("");
        },
        onUpload: function () {
            var fileupload = sap.ui.getCore().byId("idUpload");

            var file = fileupload.oFileUpload.files[0];
            this.import(fileupload.oFileUpload.files[0]);
            this.browseDialog.close();
        },
        onClose: function () {
            this.browseDialog.close();
        },

        import: function (file) {
          
            var excelData = {};
            if (file && window.FileReader) {
                var reader = new FileReader();
                reader.onload = function (e) {

                    var data = e.target.result;
                    var workbook = XLSX.read(data, {
                        type: 'binary'
                    });
                    workbook.SheetNames.forEach(function (sheetName) {
                        // Here is your object for every sheet in workbook
                        excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);

                    });

                    for (var i = 0; i < excelData.length; i++) {
                        that.oDataModel.create("/LOCATION_STB", excelData[i], {
                            success: function () { },
                            error: function () { }
                        })
                    }
                    that.table.getModel().refresh(true);
                };

                reader.onerror = function (ex) {
                    console.log(ex);
                };
                reader.readAsBinaryString(file);
            }
        },
        onPush: function (oEvent) {
     
            if (that.table.getSelectedItems().length == 0) {
                MessageBox.error("No items are selected");
            }

            else {
                for (var i = 0; i < that.table.getSelectedItems().length; i++) {
                    var oSelected = that.table.getSelectedItems()[i].getBindingContext().getObject();
                    aSelectedItems.push(oSelected);
                }

                if (aSelectedItems.length > 0) {
                    for (var i = 0; i < aSelectedItems.length; i++) {
                        that.oDataModel.createEntry("/LOCATION", {
                            properties: aSelectedItems[i]
                        })
                    }
                    that.oDataModel.submitChanges({
                        success: function (odata1) {
                            console.log(odata1)
                            MessageToast.show("Successfully pushed");
                            that.delete();
                        }
                    })
                }
            }
        },
        onDownload: function (oEvent) {
            var arr;

       
            that.oDataModel.read("/LOCATION_STB", {
                success: function (data) {
                    arr = data.results;
                    var oRowBinding = [], aCols = [], oSettings, oSheet;

                    for (var i = 0; i < Object.keys(arr[0]).length - 1; i++) {

                        aCols.push({

                            property: Object.keys(arr[0])[i]

                        })

                    }

                    oSettings = {

                        workbook: {

                            columns: aCols,

                            hierarchyLevel: 'Level'

                        },
                        dataSource: oRowBinding,

                        fileName: 'Table export.xlsx',

                        worker: true // We need to disable worker because we are using a MockServer as OData Service

                    };

                    oSheet = new Spreadsheet(oSettings);

                    oSheet.build().finally(function () {

                        oSheet.destroy();

                    });


                },
                error: function () { }
            })
        },
        delete: function () {
         
            for (var i = 0; i < aSelectedItems.length; i++) {
                that.oDataModel.remove("/LOCATION_STB" + "/" + aSelectedItems[i].LOCATION_ID, {
                    success: function () {
                        that.table.getModel().refresh(true);
                    },
                    error: function () { }
                })
            }
        },
        onCreate: function (oEvent) {
            that.createDialog.open();
            sap.ui.getCore().byId("idBtn").setText("Save");

            var oData;
            that.oDataModel.read("/LOCATION_STB", {
                success: function (data) {
                    oData = data.results;
                    that.onClear();
                    var len = oData.length + 1;
                    // sap.ui.getCore().byId("lId").setValue(len);


                },
                error: function () { }
            });
        },
        onClear: function () {
            sap.ui.getCore().byId("lId").setValue("");
            sap.ui.getCore().byId("lDesc").setValue("");
            sap.ui.getCore().byId("lType").setValue("");
            sap.ui.getCore().byId("lat").setValue("");
            sap.ui.getCore().byId("long").setValue("");
            sap.ui.getCore().byId("resField1").setValue("");
            sap.ui.getCore().byId("resField2").setValue("");
            sap.ui.getCore().byId("resField3").setValue("");
            sap.ui.getCore().byId("resField4").setValue("");
            sap.ui.getCore().byId("resField5").setValue("");
            sap.ui.getCore().byId("auth").setValue("");
        },

        onUpdate: function (oEvent) {
            if (that.table.getSelectedItems().length > 0) {
                that.createDialog.open();
                sap.ui.getCore().byId("lId").setEditable(false);
                sap.ui.getCore().byId("idBtn").setText("Update");
                var selected = that.table.getSelectedItem().getBindingContext().getObject();
                for(var i=0;i<that.data.length;i++){
                    if(selected.LOCATION_ID == that.data[i].LOCATION_ID){
                        that.selectedItem = that.data[i]
                    }
                }
               

                sap.ui.getCore().byId("lId").setValue(that.selectedItem.LOCATION_ID);
                sap.ui.getCore().byId("lDesc").setValue(that.selectedItem.LOCATION_DESC);
                sap.ui.getCore().byId("lType").setValue(that.selectedItem.LOCATION_TYPE);
                sap.ui.getCore().byId("lat").setValue(that.selectedItem.LATITUDE);
                sap.ui.getCore().byId("long").setValue(that.selectedItem.LONGITUTE);
                sap.ui.getCore().byId("resField1").setValue(that.selectedItem.RESERVE_FIELD1);
                sap.ui.getCore().byId("resField2").setValue(that.selectedItem.RESERVE_FIELD2);
                sap.ui.getCore().byId("resField3").setValue(that.selectedItem.RESERVE_FIELD3);
                sap.ui.getCore().byId("resField4").setValue(that.selectedItem.RESERVE_FIELD4);
                sap.ui.getCore().byId("resField5").setValue(that.selectedItem.RESERVE_FIELD5);
                sap.ui.getCore().byId("auth").setValue(that.selectedItem.AUTH_GROUP);
            }
            else {
                sap.m.MessageBox.error("Please select a row");
            }
        },
        onSave: function (oEvent) {
            // To create or update the record
            var btnText = oEvent.getSource().getText();
            var oUserInfoService = new UserInfo();
            var username = oUserInfoService.getUser().getFullName();
            var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" });

            var id = sap.ui.getCore().byId("lId").getValue();
            var desc = sap.ui.getCore().byId("lDesc").getValue();
            var type = sap.ui.getCore().byId("lType").getValue();
            var lat = sap.ui.getCore().byId("lat").getValue();
            var long = sap.ui.getCore().byId("long").getValue();
            var rf1 = sap.ui.getCore().byId("resField1").getValue();
            var rf2 = sap.ui.getCore().byId("resField2").getValue();
            var rf3 = sap.ui.getCore().byId("resField3").getValue();
            var rf4 = sap.ui.getCore().byId("resField4").getValue();
            var rf5 = sap.ui.getCore().byId("resField5").getValue();
            var auth = sap.ui.getCore().byId("auth").getValue();
            if (btnText == "Save") {

                var chDate = dateFormat.format(new Date());
                var chTime = new Date().toLocaleTimeString("en-US", { hour12: false })
                var crDate = dateFormat.format(new Date());
                var crTime = new Date().toLocaleTimeString("en-US", { hour12: false })


                var obj = {
                    LOCATION_ID: id,
                    LOCATION_DESC: desc,
                    LOCATION_TYPE: type,
                    LATITUDE:lat,
                    LONGITUTE:long,
                    RESERVE_FIELD1: rf1,
                    RESERVE_FIELD2: rf2,
                    RESERVE_FIELD3: rf3,
                    RESERVE_FIELD4: rf4,
                    RESERVE_FIELD5: rf5,
                    AUTH_GROUP:auth,
                    CHANGED_DATE: chDate,
                    CHANGED_TIME: chTime,
                    CHANGED_BY: username,
                    CREATED_DATE: crDate,
                    CREATED_TIME: crTime,
                    CREATED_BY: username
                };
                that.oDataModel.create("/LOCATION_STB", obj, {
                    success: function (data) {
                        that.table.getModel().refresh(true);
                        sap.m.MessageBox.success("Created Successfully");
                    },
                    error: function () {
                        sap.m.MessageBox.error("Creation failed");
                    }
                })
                that.onCancel();
            }
            if (btnText == "Update") {
                
                // var selectedItem= that.table.getSelectedItem().getBindingContext().getObject();

                var chDate1 = dateFormat.format(new Date());
                var chTime1 = new Date().toLocaleTimeString("en-US", { hour12: false })
                var crDate1 = dateFormat.format(that.selectedItem.CREATED_DATE);
                var crTime1 = new Date(new Date(new Date(that.selectedItem.CREATED_TIME.ms)).setTime(new Date(that.selectedItem.CREATED_TIME.ms).getTime()+(-330*60000))).toTimeString().slice(0,8);
                var chBy1 = username;
                var crBy1 = that.selectedItem.CREATED_BY;

                var updatedObj = {
                    LOCATION_ID: id,
                    LOCATION_DESC: desc,
                    LOCATION_TYPE: type,
                    LATITUDE:lat,
                    LONGITUTE:long,
                    RESERVE_FIELD1: rf1,
                    RESERVE_FIELD2: rf2,
                    RESERVE_FIELD3: rf3,
                    RESERVE_FIELD4: rf4,
                    RESERVE_FIELD5: rf5,
                    AUTH_GROUP:auth,
                    CHANGED_DATE: chDate1,
                    CHANGED_TIME: chTime1,
                    CHANGED_BY: chBy1,
                    CREATED_DATE: crDate1,
                    CREATED_TIME: crTime1,
                    CREATED_BY: crBy1
                };

                that.oDataModel.update("/LOCATION_STB(LOCATION_ID='" + id + "')", updatedObj, {
                    success: function (result) {

                        that.table.getModel().refresh(true);
                        sap.m.MessageBox.success("Updated successfully");
                        that.onCancel();
                    },
                    error: function (error) {
                        sap.m.MessageToast.show("Not Updated")
                    }
                })
               
            }
           
        },
        onCancel: function () {
            that.createDialog.close();
        },
       
        onCloseEdit: function () {
            this.editDialog.close();
        }
    };
});









