/*
* Olga Zhilkova
* view model for WBS template
*/
define([
  'library/knockout',
  'models/deliverable',
], function (ko, Deliverable) {
  
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
    
    //sorting all deliverables in correct order according to ID of new records
    self.wbsAll = ko.pureComputed(function () {
      return self.wbs.sorted(function (left, right) {
          if (left.deliverable.ID() === right.deliverable.ID()) return 0;
          
          if (left.deliverable.ID() < right.deliverable.ID()) return -1;
          
          if (left.deliverable.ID() > right.deliverable.ID()) return 1;
      });

    });

    //set current chosen entry in accodance to any changes in wbs
    self.wbs.subscribe(function(changes) {
      
      changes.forEach(function (element){
        
        //changing ID of each deliverable while adding new one
        if (element.status === 'added') {
          
          let previousRecord = null;
          let currentRecord = null;
          let parentID = element.value.deliverable.parentID();
          let newOrderID = element.value.deliverable.order();
            
          self.wbs().forEach(function (current, index) {
            
            //comparing records withing the same level
            if (parentID === current.deliverable.parentID()) {
              
              if (current.deliverable.order() >= newOrderID &&
                  index !== element.index) {  

                previousRecord = current.deliverable;
                let orderID = previousRecord.order(); 
                orderID++;
                
                current.deliverable.order(orderID);
                //currentRecord = previousRecord;
              }
              
            }
          });
      
         }
      });
    }, this, "arrayChange");

    //create new empty record for deliverable
    self.add = function (currentRecord) {
      
      let recordID = null;
      let parentID = 0;
      let orderID = 0;
      
      if (!!currentRecord) {
        
        //get the current record ID
        orderID = currentRecord.deliverable.order();
        parentID = currentRecord.deliverable.parentID();
        orderID++;
         
      }
      
      let newRecord = new Deliverable(orderID, '', parentID, []);
      
      //new deliverable for user interface
      if (!!deliverable) self.wbs.push({
        deliverable: newRecord,
        
      }); 
      
    };
    
    //decrease Level of current Record and change ID
    self.decreaseLevel = function (currentRecord) {
      
      let previousOrder = currentRecord.deliverable.order();
      let previousParent = currentRecord.deliverable.parentID();
      
      let newParent = null;
      let newOrder = 0;
      
      let decreasedOrder = previousOrder;
      previousOrder--;
      
      self.wbs().forEach(function (current, index) {
        
        if (previousParent === current.deliverable.parentID()) {

          if (current.deliverable.order() === previousOrder) {  

            newParent = current.deliverable.ID();

          }
        }
      });
      
      //before changing an order it must find out the childrens of previous parent
      self.wbs().forEach(function (current, index) {
          
          if (!!newParent && newParent === current.deliverable.parentID()) {
            newOrder = current.deliverable.order();
          }
      });
      
      newOrder++;
      
      currentRecord.deliverable.order(newOrder);
      currentRecord.deliverable.parentID(newParent);
      
      //decrease ordinal number of all deliverables 
      self.wbs().forEach(function (current, index) {
      
          if (previousParent === current.deliverable.parentID() &&
              decreasedOrder < current.deliverable.order()) {
            
            current.deliverable.order(decreasedOrder);
            
            decreasedOrder++;
          }
          
      });
      
    }
    
    //set status of each row when it is edited
    self.setStatus = function (currentRecord){ 
      
      return !!currentRecord.deliverable.title();
      
    }
    
    
  };
  
  return ViewWBS;
  
});