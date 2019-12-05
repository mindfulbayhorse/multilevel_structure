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
      {value: 'not_chosen', text: 'Choose action', disabled: true},
      {value: 'new', text: 'Add new', disabled: true}, 
      {value: 'breakdown', text: 'Break down', disabled: true}, 
      {value: 'moveup', text: 'Move up', disabled: true}, 
      {value: 'movedown', text: 'Move down', disabled: true},
      {value: 'elevatelevel', text: 'Elevate level', disabled: true},
      {value: 'decreaselevel', text: 'Decrease level', disabled: true}
  ]);

  return allowedActions;
    
});