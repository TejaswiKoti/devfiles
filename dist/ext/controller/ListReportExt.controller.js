sap.ui.define(["sap/m/MessageToast","sap/m/MessageBox","sap/ui/core/util/File","sap/ui/export/library","sap/ui/export/Spreadsheet","sap/ui/model/odata/v2/ODataModel","sap/ushell/services/UserInfo"],function(e,t,a,s,r,o){"use strict";var l;return{onInit:function(){l=this;l.oDataModel=l.getOwnerComponent().getModel();l.oDataModel.read("/LOCATION_STB",{success:function(e){l.data=e.results},error:function(){}});if(!this.browseDialog){this.browseDialog=sap.ui.xmlfragment("vcpif.vcplocation.fragments.browse",this)}if(!this.createDialog){this.createDialog=sap.ui.xmlfragment("vcpif.vcplocation.fragments.create",this)}l.table=l.byId("vcpif.vcplocation::sap.suite.ui.generic.template.ListReport.view.ListReport::LOCATION_STB--responsiveTable");var e=document.createElement("script");e.setAttribute("src","https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.10.0/xlsx.js");document.head.appendChild(e);var e=document.createElement("script");e.setAttribute("src","https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.10.0/jszip.js");document.head.appendChild(e);l.byId("vcpif.vcplocation::sap.suite.ui.generic.template.ListReport.view.ListReport::LOCATION_STB--addEntry").setVisible(false)},onBrowse:function(e){this.browseDialog.open();sap.ui.getCore().byId("idUpload").setValue("")},onUpload:function(){var e=sap.ui.getCore().byId("idUpload");var t=e.oFileUpload.files[0];this.import(e.oFileUpload.files[0]);this.browseDialog.close()},onClose:function(){this.browseDialog.close()},import:function(e){var t={};if(e&&window.FileReader){var a=new FileReader;a.onload=function(e){var a=e.target.result;var s=XLSX.read(a,{type:"binary"});s.SheetNames.forEach(function(e){t=XLSX.utils.sheet_to_row_object_array(s.Sheets[e])});for(var r=0;r<t.length;r++){l.oDataModel.create("/LOCATION_STB",t[r],{success:function(){},error:function(){}})}l.table.getModel().refresh(true)};a.onerror=function(e){console.log(e)};a.readAsBinaryString(e)}},onPush:function(a){if(l.table.getSelectedItems().length==0){t.error("No items are selected")}else{for(var s=0;s<l.table.getSelectedItems().length;s++){var r=l.table.getSelectedItems()[s].getBindingContext().getObject();aSelectedItems.push(r)}if(aSelectedItems.length>0){for(var s=0;s<aSelectedItems.length;s++){l.oDataModel.createEntry("/LOCATION",{properties:aSelectedItems[s]})}l.oDataModel.submitChanges({success:function(t){console.log(t);e.show("Successfully pushed");l.delete()}})}}},onDownload:function(e){var t;l.oDataModel.read("/LOCATION_STB",{success:function(e){t=e.results;var a=[],s=[],o,l;for(var i=0;i<Object.keys(t[0]).length-1;i++){s.push({property:Object.keys(t[0])[i]})}o={workbook:{columns:s,hierarchyLevel:"Level"},dataSource:a,fileName:"Table export.xlsx",worker:true};l=new r(o);l.build().finally(function(){l.destroy()})},error:function(){}})},delete:function(){for(var e=0;e<aSelectedItems.length;e++){l.oDataModel.remove("/LOCATION_STB"+"/"+aSelectedItems[e].LOCATION_ID,{success:function(){l.table.getModel().refresh(true)},error:function(){}})}},onCreate:function(e){l.createDialog.open();sap.ui.getCore().byId("idBtn").setText("Save");var t;l.oDataModel.read("/LOCATION_STB",{success:function(e){t=e.results;l.onClear();var a=t.length+1},error:function(){}})},onClear:function(){sap.ui.getCore().byId("lId").setValue("");sap.ui.getCore().byId("lDesc").setValue("");sap.ui.getCore().byId("lType").setValue("");sap.ui.getCore().byId("lat").setValue("");sap.ui.getCore().byId("long").setValue("");sap.ui.getCore().byId("resField1").setValue("");sap.ui.getCore().byId("resField2").setValue("");sap.ui.getCore().byId("resField3").setValue("");sap.ui.getCore().byId("resField4").setValue("");sap.ui.getCore().byId("resField5").setValue("");sap.ui.getCore().byId("auth").setValue("")},onUpdate:function(e){if(l.table.getSelectedItems().length>0){l.createDialog.open();sap.ui.getCore().byId("lId").setEditable(false);sap.ui.getCore().byId("idBtn").setText("Update");var t=l.table.getSelectedItem().getBindingContext().getObject();for(var a=0;a<l.data.length;a++){if(t.LOCATION_ID==l.data[a].LOCATION_ID){l.selectedItem=l.data[a]}}sap.ui.getCore().byId("lId").setValue(l.selectedItem.LOCATION_ID);sap.ui.getCore().byId("lDesc").setValue(l.selectedItem.LOCATION_DESC);sap.ui.getCore().byId("lType").setValue(l.selectedItem.LOCATION_TYPE);sap.ui.getCore().byId("lat").setValue(l.selectedItem.LATITUDE);sap.ui.getCore().byId("long").setValue(l.selectedItem.LONGITUTE);sap.ui.getCore().byId("resField1").setValue(l.selectedItem.RESERVE_FIELD1);sap.ui.getCore().byId("resField2").setValue(l.selectedItem.RESERVE_FIELD2);sap.ui.getCore().byId("resField3").setValue(l.selectedItem.RESERVE_FIELD3);sap.ui.getCore().byId("resField4").setValue(l.selectedItem.RESERVE_FIELD4);sap.ui.getCore().byId("resField5").setValue(l.selectedItem.RESERVE_FIELD5);sap.ui.getCore().byId("auth").setValue(l.selectedItem.AUTH_GROUP)}else{sap.m.MessageBox.error("Please select a row")}},onSave:function(e){var t=e.getSource().getText();var a=new UserInfo;var s=a.getUser().getFullName();var r=sap.ui.core.format.DateFormat.getDateInstance({pattern:"yyyy-MM-dd"});var o=sap.ui.getCore().byId("lId").getValue();var i=sap.ui.getCore().byId("lDesc").getValue();var n=sap.ui.getCore().byId("lType").getValue();var u=sap.ui.getCore().byId("lat").getValue();var d=sap.ui.getCore().byId("long").getValue();var c=sap.ui.getCore().byId("resField1").getValue();var I=sap.ui.getCore().byId("resField2").getValue();var g=sap.ui.getCore().byId("resField3").getValue();var E=sap.ui.getCore().byId("resField4").getValue();var p=sap.ui.getCore().byId("resField5").getValue();var C=sap.ui.getCore().byId("auth").getValue();if(t=="Save"){var D=r.format(new Date);var T=(new Date).toLocaleTimeString("en-US",{hour12:false});var f=r.format(new Date);var m=(new Date).toLocaleTimeString("en-US",{hour12:false});var b={LOCATION_ID:o,LOCATION_DESC:i,LOCATION_TYPE:n,LATITUDE:u,LONGITUTE:d,RESERVE_FIELD1:c,RESERVE_FIELD2:I,RESERVE_FIELD3:g,RESERVE_FIELD4:E,RESERVE_FIELD5:p,AUTH_GROUP:C,CHANGED_DATE:D,CHANGED_TIME:T,CHANGED_BY:s,CREATED_DATE:f,CREATED_TIME:m,CREATED_BY:s};l.oDataModel.create("/LOCATION_STB",b,{success:function(e){l.table.getModel().refresh(true);sap.m.MessageBox.success("Created Successfully")},error:function(){sap.m.MessageBox.error("Creation failed")}});l.onCancel()}if(t=="Update"){var v=r.format(new Date);var y=(new Date).toLocaleTimeString("en-US",{hour12:false});var _=r.format(l.selectedItem.CREATED_DATE);var O=new Date(new Date(new Date(l.selectedItem.CREATED_TIME.ms)).setTime(new Date(l.selectedItem.CREATED_TIME.ms).getTime()+-330*6e4)).toTimeString().slice(0,8);var S=s;var L=l.selectedItem.CREATED_BY;var h={LOCATION_ID:o,LOCATION_DESC:i,LOCATION_TYPE:n,LATITUDE:u,LONGITUTE:d,RESERVE_FIELD1:c,RESERVE_FIELD2:I,RESERVE_FIELD3:g,RESERVE_FIELD4:E,RESERVE_FIELD5:p,AUTH_GROUP:C,CHANGED_DATE:v,CHANGED_TIME:y,CHANGED_BY:S,CREATED_DATE:_,CREATED_TIME:O,CREATED_BY:L};l.oDataModel.update("/LOCATION_STB(LOCATION_ID='"+o+"')",h,{success:function(e){l.table.getModel().refresh(true);sap.m.MessageBox.success("Updated successfully");l.onCancel()},error:function(e){sap.m.MessageToast.show("Not Updated")}})}},onCancel:function(){l.createDialog.close()},onCloseEdit:function(){this.editDialog.close()}}});
//# sourceMappingURL=ListReportExt.controller.js.map