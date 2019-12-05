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
  
  //check local storage for todos
  //let localWBS = ko.utils.parseJson(localStorage.getItem('wbsLocal'));
  let localWBS = [];
  
  let viewWBS = new ViewWBS(localWBS);
  
  let bindingConfig = { 
    //all record in WBS
    deliverables: function() { return {foreach: viewWBS.wbsAll}},
    //the title of current record
    currentTitle: function() {
      return {
        textInput: viewWBS.current().entry.title,
        //class: viewWBS.validTitle(),
        //hasFocus: viewWBS.validTitle()
      }
    },
    //the cost of current record
    currentCost: function() {
      return {
        value: viewWBS.current().entry.cost,
        valueUpdate: 'input'
      }
    },
    //the cost of current record
    currentDateStart: function() {
      return {
        value: viewWBS.current().entry.dateStart,
        valueUpdate: 'input'
      }
    },
    //the cost of current record
    currentDateEnd: function() {
      return {
        value: viewWBS.current().entry.dateEnd,
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
        valueUpdate: 'input',
      }
    },
    //end date of the current record
    recordDateEnd: function() {     
      return { 
        value: this.entry.dateEnd,
        valueUpdate: 'input',
      }
    },
    //choose action with current record
    recordActions:
      function (){
        return {
          foreach: viewWBS.actions,
          value: this.action,
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
          click: function (){viewWBS.addNew(this);},
          //visible: viewWBS.checkOrder(this),
          //enable: viewWBS.checkTitle(this)
        }
      },
    //choose action with current record:
    optionAction:
      function (){
        return this;
    },
    //Break down current deliverable
    breakdown: 
      function (){
        return {
          click: function (){ viewWBS.breakdown(this)},
          enable: viewWBS.checkTitle(this)
        }
      },
  };
  
  ko.bindingProvider.instance = new ko.customBindingProvider(bindingConfig); 
  
  // bind a new instance of our view model to the page
  ko.applyBindings(viewWBS);

});
