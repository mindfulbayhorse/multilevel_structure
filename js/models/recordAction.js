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
   * Record state in WBS 
   */
  let allowedActions = ko.observableArray([
      {id: 'breakdown', text: 'Break down', disabled: true}, 
      {id: 'moveUp', text: 'Move up', disabled: true}, 
      {id: 'moveDown', text: 'Move down', disabled: true},
      {id: 'elevateLevel', text: 'Elevate level', disabled: true},
      {id: 'decreaseLevel', text: 'Decrease level', disabled: true}
  ]);

  return allowedActions;
    
});