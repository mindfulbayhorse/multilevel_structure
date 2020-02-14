/**
 * Deliverables attributes
 * Olga Zhilkova
 * Deliverable primary and secondary data
 */
define([
  'library/knockout',
], function(ko) {

  'use strict';
  
  /*
   * Action 
   */
  let recordAction = function(id, title, exec) {

    this.id = id;
    this.text = title;
    this.disabled = ko.observable(false);
    this.click = exec;
    
    return this;
    
  }


  return recordAction;
    
});