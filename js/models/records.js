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
        
        if (!!currentRecord) {    
          
          //calculating new ID for all deliverables in WBS
          orderID = currentRecord.order();
          parentID = currentRecord.parentID();
          
          orderID++;
          
          currentRecord = new Deliverable(orderID, '', parentID, []);
          
          if (!!records[currentRecord.ID()]) {
            
            for (let [id, entry] of Object.entries(records)) {
              
              if (parentID === entry.parentID()) {
                
                if (entry.order() >= orderID) {
                  let previousRecord = entry;
                  orderID = previousRecord.order(); 
                  orderID++;
                  previousRecord.order(orderID);
                  records[currentRecord.ID()] = currentRecord;
                  currentRecord = previousRecord;
                }
                
              }
                
            }
            
          } else {
            records[currentRecord.ID()] = currentRecord;
          }
        
        } else {
          
          currentRecord = new Deliverable(orderID, '', parentID, []);
          
          records[currentRecord.ID()] = currentRecord;
          
        }
        
        return currentRecord; 
        
      }
    }

  })();
  
  return RecordFactory;
    
});