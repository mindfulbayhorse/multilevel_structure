/**
 * Implemenration of WBS
 * Olga Zhilkova
 */
require([ 
  'library/knockout',
  'extends/provider',
  'viewmodels/wbs'
], function (ko, Provider, ViewWBS) {
  
  'use strict';

  //set ko's current bindingProvider equal to our new binding provider
  ko.customBindingProvider = Provider;
  
  //check local storage for todos
  let localWBS = ko.utils.parseJson(localStorage.getItem('wbsLocal'));
  
  let viewWBS = new ViewWBS([]);
  
  let bindingConfig = { 
    //all records in WBS
    deliverables: function() { return {foreach: viewWBS.wbsAll}},
    //visible deliverables to match current parent
    chosenDeliverables: function (){
      return {
        visible: viewWBS.currentLevel
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
        valueUpdate: 'input',
        class: this.entry.classTitle
      }
    },
    actionsBar: {
      visible: viewWBS.actionsBar
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
    //selected entry from table
    setCurrent: function(){
      return {
        checkedValue: this,
        checked: viewWBS.current
      }
    },
    //selected entry from table
    isSelected: function()
      {
        return {
          hasFocus: this.entry.isSelected,
          class: this.entry.isActive,
          visible:  viewWBS.parent()===this.entry.parentID()
        }
        
      },
    //actions list for each record in WBS
    actions: function() {return {foreach: viewWBS.actions}},
    //button for each action
    action: function(){ 
      return {
        html: this.text,
        attr: {name: this.id},
        click: function () { return viewWBS[this.id]() }
      }
    },
    actionsBar: function(){
      return {
        visible: viewWBS.actionsBar
      }
    },
    //the title of current record
    newTitle: function() {
      return {
        value: viewWBS.newDeliverable().title,
        valueUpdate: 'input'
      }
    },
    //the title of current record
    newID: function() {
      return {
        value: viewWBS.newDeliverable().ID,
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
        value: viewWBS.newDeliverable.dateStart,
        valueUpdate: 'input'
      }
    },
    //the cost of current record
    newDateEnd: function() {
      return {
        value: viewWBS.newDeliverable.dateEnd,
        valueUpdate: 'input'
      }
    },
    //the flag that current deliverable is the package
    newPackage: function() {
      return {
        checked: viewWBS.newDeliverable.isPackage,
      }
    },
    //add new deliverable from the form
    addNew: function (){
      return {
        click: viewWBS.addNew
      }
    },  
    //add new deliverable from the form
    newRequest: function(){
      return {
        submit: function(){ return false;}
      }
    }, 
    //hint for filling necessary title
    validTitle: {
      visible: viewWBS.validField
    },
    //the flag that current deliverable is the package
    parentTitle: function() {
        return {
          text: viewWBS.parent.entry.title,
        }
    },
    showErrMsg: {
      visible: viewWBS.validField,
    },
    treeLevels: function () { return {foreach: viewWBS.wbsAll}},
    //show the links for the curent level of WBS
    titleLevel: {
      visible: function (){ return viewWBS.currentLevel(this) }
    },
    request: {
      submit: function (){ return false;}
    },
    breakdown: {
      visible: viewWBS.parent
    }
  };
   
  ko.bindingProvider.instance = new ko.customBindingProvider(bindingConfig); 
  
  // bind a new instance of our view model to the page
  ko.applyBindings(viewWBS);

});
