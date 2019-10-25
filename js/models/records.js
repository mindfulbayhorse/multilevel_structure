/**
 * Deliverable factory
 * Olga Zhilkova
 * Creating new deliverable or returning exisiting
 */
define([
	'models/deliverable'
], function (Deliverable) {

  'use strict';

  let RecordFactory = (function() {
    
    let records = {}; 
       
    return {
      //create new empty record for deliverable
      addNew: function (id, title, fields) {
        
        let recordID = id;
             
        let currentRecord = records[recordID];
         
        if (!!currentRecord) {    
          
          if (!currentRecord.title()) return false;
          
          recordID++;
        }
     
        let record = new Deliverable(recordID, '', []);
        records[id] = record;
        
        return record; 
        
      }
    }

  })();
  
  return RecordFactory;
    
});