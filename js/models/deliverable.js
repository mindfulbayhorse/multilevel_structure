/**
 * Deliverables attributes
 * Olga Zhilkova
 * Deliverable primary and secondary data
 */
define([
	'library/knockout'
], function(ko) {

  'use strict';

  /*
   * Deliverable 
   */
  let Deliverable = function(ID, title, fields) {

    this.ID = ko.observable(ID);
    this.title = ko.observable(title);
    this.fields = ko.observableArray(fields || []);

    return this;
    
  }
  
  return Deliverable;
    
});