/**
 * Deliverable factory
 * Olga Zhilkova
 * Creating new deliverable or returning exisiting
 */
define([
  'library/knockout',
	'models/records'
], function (ko, RecordFactory) {

  'use strict';

  let RecordManager = (function() {
    
    let recordTables = ko.observableArray(); 
       
    return {
      //create new empty record for deliverable
      addNewRecord: function(id, title, fields) {
        
        console.log(id + ' - id');
        
        let record  = RecordFactory.addNew(id, title, fields);
       
        if (record) {
          recordTables.push({
              deliverable: record,
              current: true,
              editing: true
          })
        }
      },
      
      updateStatusRecord: function(id){
        recordTables[id].current = true;
      },
      
      recordTables: recordTables
    }

  })();
  
  return RecordManager;
    
});