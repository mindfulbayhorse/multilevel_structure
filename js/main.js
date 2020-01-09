/**
 * Implemenration of WBS
 * Olga Zhilkova
 */
;require([
  'style/config', 
  '//cdnjs.cloudflare.com/ajax/libs/less.js/3.9.0/less.min.js',
  'library/knockout',
  'extends/provider',
  'viewmodels/wbs'
], function (ko, Provider, ViewWBS) {
  
  'use strict';

  // set ko's current bindingProvider equal to our new binding provider
  ko.customBindingProvider = Provider;
  
  //check local storage for todos
  //let localWBS = ko.utils.parseJson(localStorage.getItem('wbsLocal'));
  let localWBS = [];
  
  let viewWBS = new ViewWBS(localWBS);
  
  let bindingConfig = { 
    //all record in WBS
    deliverables: function() { return {foreach: viewWBS.wbsAll}},
    //the title of current record
    newTitle: function() {
      return {
        value: viewWBS.newDeliverable().title,
        valueUpdate: 'input'
      }
    },
    //the cost of current record
    newCost: function() {
      return {
        value: viewWBS.newDeliverable().cost,
        valueUpdate: 'input'
      }
    },
    //the cost of current record
    newDateStart: function() {
      return {
        value: viewWBS.newDeliverable().dateStart,
        valueUpdate: 'input'
      }
    },
    //the cost of current record
    newDateEnd: function() {
      return {
        value: viewWBS.newDeliverable().dateEnd,
        valueUpdate: 'input'
      }
    },
    //id of the current record
    recordID: function() { 
      return { 
        text: this.entry.ID
      };
    },
    //title of the current record
    recordTitle: function() {     
      return { 
        value: this.entry.title,
        valueUpdate: 'input'
      }
    },
    //cost of the current record
    recordCost: function() {     
      return { 
        value: this.entry.cost,
        valueUpdate: 'input',
      }
    },
    //start date of the current record
    recordDateStart: function() {  
      return { 
        value: this.entry.dateStart,
        valueUpdate: 'input'
      }
    },
    //end date of the current record
    recordDateEnd: function() {     
      return { 
        value: this.entry.dateEnd,
        valueUpdate: 'input'
      }
    },
    //set current record to update its status
    setCurrent: function (){
      return {
        hasFocus: viewWBS.setCurrent(this)
      }       
    },
    //Add new deliverable
    addNew: 
      function (){   
        return {
          click: function (){viewWBS.addNew(viewWBS.newDeliverable)}
        }
      }
  };
   
  ko.bindingProvider.instance = new ko.customBindingProvider(bindingConfig); 
  
  // bind a new instance of our view model to the page
  ko.applyBindings(viewWBS);

});
