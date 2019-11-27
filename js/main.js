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
  //let localWBS = ko.utils.parseJson(localStorage.getItem('wbs-local'));
  let localWBS = [];
  
  let viewWBS = new ViewWBS(localWBS);
  
  let bindingConfig = {    
    currentTitle: function() {
      return {
        value: viewWBS.current().deliverable.title,
        attr: {
          title: viewWBS.current().deliverable.order,
        },
        valueUpdate: 'input',
      }
    },
    deliverables: function() { return {foreach: viewWBS.wbsAll}},
    recordID: function() { 
      return { 
        text: this.deliverable.ID
      };
    },
    recordTitle: function() {     
      return { 
        value: this.deliverable.title,
        valueUpdate: 'input'
      }
    },
    //set current record to update its status
    setCurrent: function (){
      return {
        hasFocus: viewWBS.setCurrent(this)
      }       
    },
    _index: function(){
       return{ 
         attr: {
          id: this
         }
       }
    },
    recordField: function() {     
      return { 
        value: this.deliverable.fields,
        valueUpdate: 'input',
      }
    },
    //Add new deliverable
    recordCreate: 
      function (){   
        return {
          click: function (){viewWBS.add(this.deliverable);},
          //visible: viewWBS.checkOrder(this),
          //enable: viewWBS.checkTitle(this)
        }
      },
    //choose action with current record
    recordActions:
      function (){
        return {
          foreach: viewWBS.actions,
          value: viewWBS.action,
          valueUpdate: 'input'
        }
    },
    //choose action with current record:
    recordAction:
      function (){
        return {
          value: this.value,
          text: this.value
        }
    },
    //choose action with current record:
    optionAction:
      function (){
        return {
          value: this.value,
          text: this.value
        }
    },
    //Break down current deliverable
    breakdown: 
      function (){
        return {
          click: function (){ viewWBS.breakdown(this)},
          enable: viewWBS.checkTitle(this)
        }
      },
    //Add new deliverable
    recordCreate: 
      function (){   
        return {
          click: function (){viewWBS.addNew(viewWBS.current);},
          //visible: viewWBS.checkOrder(this),
          //enable: viewWBS.checkTitle(this)
        }
      },
  };
  
  ko.bindingProvider.instance = new ko.customBindingProvider(bindingConfig); 
  
  // bind a new instance of our view model to the page
  ko.applyBindings(viewWBS);

});
