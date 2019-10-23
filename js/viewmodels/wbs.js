/*
* Olga Zhilkova
* view model for WBS template
*/
define([
  'library/knockout',
  'models/deliverable',
  'models/records'
], function (ko, Deliverable, Records) {
  
  'use strict';
 
  let ViewWBS = function (wbs) {
    
    let self = this;
    
    self.wbs = ko.observableArray(ko.utils.arrayMap(wbs, function (record) {
      return new Deliverable(record.ID, record.title, record.fields);
    })); 
    
    self.current = ko.observable();
    
    // add a new todo, when enter key is pressed
    self.add = function () {
      
      let current = self.current();

      if (current) {
        console.log(Records.all[current]);
        self.wbs.push(Records.all[current]);
      }
    };
    
  };
  
  return ViewWBS;
  
});