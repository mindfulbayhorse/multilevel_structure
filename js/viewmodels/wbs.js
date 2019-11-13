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
      let indexCurrent = 0;
      let ID = 0;
         
      if (!!currentRecord) {
        
        //get the current record ID
        ID = currentRecord.deliverable.ID();
        orderID = currentRecord.deliverable.order();
        parentID = currentRecord.deliverable.parentID();
        
        self.wbs().forEach( function(element, index) {
          
          if (ID === element.deliverable.ID()) {
            
            indexCurrent = index;
            
            if (!!deliverable) self.wbs.push({
              deliverable: new Deliverable(1, '', ID, []),
              created: true
            });

          }
               
          if (!!indexCurrent && index > indexCurrent && 
            parentID === element.deliverable.parentID()) {

            orderID++;
            element.deliverable.order(orderID);
            
          }
          
        });
                
      }
      
    };
     
    /*
     * check if the title if edited or filled out
     */
    self.checkTitle = function (currentRecord){ 
      
      if (!currentRecord.deliverable) return true;
      
      return !!currentRecord.deliverable.title();
      
    } 
    
    /*
     * show the button new at the last entry of current level
     */
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