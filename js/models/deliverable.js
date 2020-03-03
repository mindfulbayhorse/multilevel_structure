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
  let Deliverable = function(order, title, parentID, cost, dateStart, dateEnd, isPackage) {

    this.order = ko.observable(order);
    this.title = ko.observable(title);
    this.parentID = ko.observable(parentID);
    this.cost = ko.observable(cost);
    
    this.dateStart = ko.observable(dateStart);    
    this.dateEnd = ko.observable(dateEnd);
    this.isPackage = ko.observable(false);
    
    this.isSelected = ko.observable(false);
    
    this.ID = ko.pureComputed(function() {
      
      if (!!this.parentID()) {
        return this.parentID() + "." + this.order();
      } else {
        return this.order();
      }
      
    }, this);
    
    //validate title for empty string
    this.titleValid = ko.observable(function() {
      return !this.title();
    });
    
    
    this.isActive = ko.pureComputed(function() {
      
      if (this.isSelected()) {
        return 'active';
      }
      
      return '';
      
    }, this);

    return this;
    
  }
  
  return Deliverable;
    
});