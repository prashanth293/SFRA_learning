'use strict';

var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var CustomerMgr = require('dw/customer/CustomerMgr');
var Logger = require('dw/system/Logger');
var File = require('dw/io/File');
let FileWriter = require('dw/io/FileWriter');
var CSVStreamWriter = require('dw/io/CSVStreamWriter');


function notifyMeJob() {
	try {
		var filePath = File.IMPEX + File.SEPARATOR + 'src' + File.SEPARATOR + 'notifyme' + File.SEPARATOR + 'export';
        var importDir = new File(filePath);
        importDir.mkdirs();
        var notifymeFile = new File(filePath + File.SEPARATOR + 'coData.csv');
        if(notifymeFile.exists())
        {
            notifymeFile.remove();
        }
        notifymeFile.createNewFile();
        var csvWriter = new CSVStreamWriter(new FileWriter(notifymeFile)); 
        var fileHeader = ['Email','ProductId(s)','Fname','Lname','Type','TimeStamp'];
        csvWriter.writeNext(fileHeader);
        var notifyMeObjs = CustomObjectMgr.getAllCustomObjects('OOSNotifyMe');
        var notifyMeObj;
        while (notifyMeObjs.hasNext()) {
            notifyMeObj = notifyMeObjs.next();
            var fileObject = [];
            var customerEmail = notifyMeObj.custom.email;
            fileObject.push(customerEmail);
            var productIds = notifyMeObj.custom.skusObject;
            fileObject.push(productIds);
            var customer = CustomerMgr.getCustomerByLogin(customerEmail);
            var firstName = '';
            var lastName = '';
            if (customer && customer.profile) {
            	firstName = customer.profile.firstName;
            	lastName = customer.profile.lastName;
            }
            fileObject.push(firstName);
            fileObject.push(lastName);
            var type = customer && customer.registered ? 'Registered' : 'Guest';
            fileObject.push(type);
            var timeStamp = notifyMeObj.creationDate;
            fileObject.push(timeStamp);
            csvWriter.writeNext(fileObject);
        }
        csvWriter.close();
		return true;
	} catch(e) {
		Logger.error(e.message);
		return false;
	}
}

module.exports = {
		FnNotifyMeJob: notifyMeJob
}