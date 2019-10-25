/*
* Olga Zhilkova
* view model for WBS template
*/
define([
  'library/knockout',
  'controller/recordmanager',
  'models/deliverable',
], function (ko, RecordManager, Deliverable) {
  
  'use strict';
 
  let ViewWBS = function (wbs) {
    
    let self = this;
    
    self.current = ko.observable();
    
    self.wbs = ko.observableArray();
    
    //changing current row in user interface
    self.current.subscribe(function(newValue) {
      
    });    
    
    //create new empty record for deliverable
    self.add = function () {
      
      let recordID = self.current();
           
      let currentRecord = self.wbs()[recordID];
      
      console.log(self.wbs()[recordID]);
       
      if (!!currentRecord) {    
        
        if (!currentRecord.title()) return false;
        
        recordID++;
      }
   
      self.wbs.push( new Deliverable(recordID, '', []));
      RecordManager.addNewRecord(recordID, '', []);
      self.current(recordID);
      
      return true; 
      
    };
    
    self.setIsSelected = function (){
      console.log(this.deliverable.id);
    }
    
  };
  
  return ViewWBS;
  
});