/**
 * Deliverable factory
 * Olga Zhilkova
 * Creating new deliverable or returning exisiting
 */
define([
	'models/deliverable',
], function (Deliverable) {

  'use strict';
  
  let RecordFactory = (function() {
    
    let records = {}; 
    
    return {
      //create new empty record for deliverable
      addNew: function ( recordID, title, fields) {
             
        let currentRecord = records[recordID];
        let parentID = 0;
        let orderID = 0;
        let previousRecord = null;
        
        if (!!currentRecord) {    
          
          //calculating new ID for all deliverables in WBS
          orderID = currentRecord.order();
          parentID = currentRecord.parentID();
          
          orderID++;
          
          currentRecord = new Deliverable(orderID, '', parentID, []);
          
          if (!!records[currentRecord.ID()]) {
            
            for (let [id, entry] of Object.entries(records)) {
              
              //comparing records withing the same level
              if (parentID === entry.parentID()) {
                
                if (entry.order() >= orderID) {                
                  previousRecord = entry;
                  orderID = previousRecord.order(); 
                  orderID++;
                  previousRecord.order(orderID);
                  records[currentRecord.ID()] = currentRecord;
                  currentRecord = previousRecord;
                }
                
              }
                
            }
            
            if (!!previousRecord) {
              records[previousRecord.ID()] = previousRecord;
            }
            
          } else {
            records[currentRecord.ID()] = currentRecord;
          }
        
        } else {
          
          currentRecord = new Deliverable(orderID, '', parentID, []);
          
          records[currentRecord.ID()] = currentRecord;
          
        }
        
        return currentRecord; 
        
      },
      
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
        
      }; 
      
      getRecords: function () {
        return records;
      }
    }

  })();
  
  return RecordFactory;
    
});