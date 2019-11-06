/**
 * Implemenration of WBS
 * Olga Zhilkova
 */
;require([
  'library/knockout',
  'extends/provider',
  'viewmodels/wbs',
  'controller/recordmanager',
], function (ko, Provider, ViewWBS, RecordManager) {
  'use strict';

  // set ko's current bindingProvider equal to our new binding provider
  ko.customBindingProvider = Provider;
  
  let viewWBS = new ViewWBS([]);
  
  let bindingConfig = {    
    deliverables: {foreach: viewWBS.wbsAll},
    recordID: function() { return { text: this.deliverable.ID};},
    recordTitle: function() { 
      return { 
        value: this.deliverable.title,
        valueUpdate: 'input'
      }
    },
    recordCreate: 
      function (){
      
      return {
        click: function (){ viewWBS.add(this);},
        enable: viewWBS.setStatus(this),
      }
    }
      
  };
  
  ko.bindingProvider.instance = new ko.customBindingProvider(bindingConfig); 

  // bind a new instance of our view model to the page
  ko.applyBindings(viewWBS);
  
  viewWBS.current(0);
  viewWBS.add(); 
  

});
