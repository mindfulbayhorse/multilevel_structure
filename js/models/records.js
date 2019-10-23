/**
 * Deliverables storage
 * Olga Zhilkova
 * Storage of all deliverabels to keep each deliverable in its own state and computed ID
 */
define([
	'models/deliverable'
], function (Deliverable) {

  'use strict';

  /*
   * Deliverable factory
   */
  let Records = (function() {

    let exisitingRecords = {};
    
    let createDeliverable = function (title, fields, current) {
      
      let currentRecord = exisitingRecords[current];
      
      if (!!currentRecord) {
        
        return false;

      } else {
        //calculate ID by checking if deliverable is already existent
        let recordID = current + 1;
        let record = new Deliverable(recordID, title, fields);
        exisitingRecords[recordID] = record;
        //find out if the level is the same as on next
        //recalculate all next ID of larger ID in the records database according to the level
        return recordID;
      } 
      
    };
    
    return {
      add: createDeliverable,
      all: exisitingRecords
    }
    
  })();
  
  return Records;
    
});