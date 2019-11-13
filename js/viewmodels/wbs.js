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
    
    //all ordered records of deliverables
    self.wbsAll= [];
    
    var test = ko.observableArray(self.wbs());
    
    //sorting all deliverables in correct order according to ID of new records
    self.wbsAll = ko.computed(function () {
      
      return self.wbs.sorted(function (left, right) {
          
          let a = String(left.deliverable.ID());
          let b = String(right.deliverable.ID());
          
          if (a < b) return -1;
          
          if (a > b) return 1;
          
          return 0;
      });

    });

    //set current chosen entry in accodance to any changes in wbs
    self.wbs.subscribe(function (changes) {
      
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

    /*
     * create new empty record for deliverable
     */
    self.add = function (currentRecord) {
      
      let recordID = null;
      let parentID = 0;
      let orderID = 0;
      
      if (!!currentRecord.deliverable) {
        
        //get the current record ID
        orderID = currentRecord.deliverable.order();
        parentID = currentRecord.deliverable.parentID();
        orderID++;
         
      } else {
        //new record if the parent is a root
        self.wbs().forEach(function (current, index) {
        
            if (current.deliverable.parentID() === parentID) {
              orderID = current.deliverable.order();
            }
        });
        
        orderID++;
      }
      
      let newRecord = new Deliverable(orderID, '', parentID, []);
      
      //new deliverable for user interface
      if (!!deliverable) self.wbs.push({
        deliverable: newRecord,
        status: 'new'
      }); 
      
    };  
    
    /*
     * break down current entry on the sublevel entries
     */
    self.breakdown = function (currentRecord){
      
      let orderID = 1;
      let parentID = 0;
      
      if (!!currentRecord) {
        
        //get the current record ID
        parentID = currentRecord.deliverable.ID();
        
        let newRecord = new Deliverable(orderID, '', parentID, []);
        
        //new deliverable for user interface
        if (!!deliverable) self.wbs.push({
          deliverable: newRecord,
          created: true
        }); 
        
      }
      
    };
    
    //set status of each row when it is edited
    self.setStatus = function (currentRecord){ 
      
      if (!!currentRecord) return true;
      
      return !!currentRecord.deliverable.title();
      
    }   
    
    //set status of each row when it is edited
    self.setStateEdited = function (currentRecord){ 
      
      if (!!currentRecord) {
        currentRecord.edited = !!currentRecord.deliverable.title();
      }
      
    } 
    
    //set status of each row when it is edited
    self.checkOrder = function (currentRecord){ 
      
      if (!currentRecord.deliverable) return true;
      
      if (!currentRecord.deliverable.parentID()) return false;
      
      let currentOrder = currentRecord.deliverable.order();
      let currentParentID = currentRecord.deliverable.parentID();
      
      let showBtn = false;
      
      //decrease ordinal number of all deliverables 
      self.wbs().forEach(function (current, index) {
      
          if (currentParentID === current.deliverable.parentID()) {
            if (currentOrder >= current.deliverable.order()) {
            
              showBtn = true;
            
            } else showBtn = false; 
          }
      });
      
      return showBtn;
      
    } 
    
  };
  
  return ViewWBS;
  
});