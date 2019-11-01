/*
* Olga Zhilkova
* view model for WBS template
*/
define([
  'library/knockout',
  'models/records',
  'models/deliverable',
], function (ko, RecordFactory, Deliverable) {
  
  'use strict';
 
  let ViewWBS = function (wbs) {
    
    let self = this;
    
    self.current = ko.observable();
    
    //all ordered records of deliverables
    self.wbs = ko.observableArray();
    
    //changing current row in user interface
    self.current.subscribe(function(newValue) {
      console.log(newValue);
    }); 
    
    //set current chosen entry in accodance to any changes in wbs
    self.wbs.subscribe(function(changes) {
      changes.forEach(function (element){
        if (element.status === 'added') {
          self.current(element.index);
        }
      });
    }, this, "arrayChange");

    
    //create new empty record for deliverable
    self.add = function (currentRecord) {
      
      let recordID = null;
      
      if (!!currentRecord) {
          
        recordID = currentRecord.deliverable.ID();
        
      }
      
      let deliverable = RecordFactory.addNew(recordID, '', []);
        
      if (!!deliverable) self.wbs.push({
        deliverable: deliverable
      });
 
      return true; 
      
    };
    
    //set status of each row in wbs
    self.setStatus = function (currentRecord) { 
      
      return !!currentRecord.deliverable.title();
      
    }
    
    
  };
  
  return ViewWBS;
  
});