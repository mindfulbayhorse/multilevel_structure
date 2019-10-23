/**
 * Implemenration of WBS
 * Olga Zhilkova
 */
;require([
  'library/knockout',
  'extends/provider',
  'viewmodels/wbs',
  'models/records'
], function (ko, Provider, ViewWBS, Records) {
  'use strict';

  // set ko's current bindingProvider equal to our new binding provider
  
  ko.customBindingProvider = Provider;
  
  let viewWBS = new ViewWBS([]);
  
  let bindingConfig = {    
    deliverables: {foreach: viewWBS.wbs},
    recordID: function() { return { text: this.ID};},
  };
  
  ko.bindingProvider.instance = new ko.customBindingProvider(bindingConfig); 

  // bind a new instance of our view model to the page
  ko.applyBindings(viewWBS);
  
  viewWBS.current(Records.add('',[],0));
  viewWBS.add();
  console.log(viewWBS.wbs);
  
  console.log(viewWBS.current);
  
  
});
