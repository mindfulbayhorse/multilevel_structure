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
  let Deliverable = function(order, title, parentID, fields) {

    this.order = ko.observable(order);
    this.title = ko.observable(title);
    this.parentID = ko.observable(parentID);
    this.fields = ko.observableArray(fields || []);
    this.ID = ko.pureComputed(function() {
      return this.parentID() + "." + this.order();
    }, this);

    return this;
    
  }
  
  return Deliverable;
    
});