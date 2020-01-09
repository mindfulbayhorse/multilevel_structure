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
   * Deliverable 
   */
  let Deliverable = function(order, title, parentID, cost, dateStart, dateEnd) {

    this.order = ko.observable(order);
    this.title = ko.observable(title);
    this.parentID = ko.observable(parentID);
    this.cost = ko.observable(cost);
    
    this.dateStart = ko.observable(dateStart);    
    this.dateEnd = ko.observable(dateEnd);
    this.state = ko.observable();    
    
    this.ID = ko.pureComputed(function() {
      
      if (!!this.parentID()) {
        return this.parentID() + "." + this.order();
      } else {
        return this.order();
      }
      
    }, this);

    return this;
    
  }
  
  return Deliverable;
    
});