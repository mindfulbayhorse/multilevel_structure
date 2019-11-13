/**
 * Implemenration of WBS
 * Olga Zhilkova
 */
;require([
  'library/knockout',
  'extends/provider',
  'viewmodels/wbs',
], function (ko, Provider, ViewWBS) {
  'use strict';

  // set ko's current bindingProvider equal to our new binding provider
  ko.customBindingProvider = Provider;
  
  let viewWBS = new ViewWBS([]);
  
  let bindingConfig = {    
    deliverables: function() { return {foreach: viewWBS.wbsAll}},
    recordID: function() { return { text: this.deliverable.ID};},
    recordTitle: function() {     
      return { 
        value: this.deliverable.title,
        valueUpdate: 'input'
      }
    },
    //Add new deliverable
    recordCreate: 
      function (){   
        return {
          click: function (){ viewWBS.add(this);},
          visible: viewWBS.checkOrder(this),
          enable: viewWBS.checkTitle(this)
        }
      },
    //Break down current deliverable
    breakdown: 
      function (){
        return {
          click: function (){ viewWBS.breakdown(this)},
        }
      } 
  };
  
  ko.bindingProvider.instance = new ko.customBindingProvider(bindingConfig); 

  // bind a new instance of our view model to the page
  ko.applyBindings(viewWBS);
  
  viewWBS.add([]); 

});
