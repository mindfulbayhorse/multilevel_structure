/*
* Olga Zhilkova
* view model for WBS template
*/
define([
  'library/knockout',
  'models/deliverable',
], function (ko, Deliverable) {
  
  'use strict';
 
  let ViewWBS = function (storageWBS) {
    
    let self = this;
    
    //all ordered records of deliverables
    self.wbs = ko.observableArray(ko.utils.arrayMap(storageWBS, function (record) {
      return {deliverable: new Deliverable(record.order, record.title, record.parentID, [])};
    }));
    
    self.action = ko.observable();
    
    //cursor to truck newely added record
    self.current = ko.observable({
      deliverable: new Deliverable(0, '', 0, []), 
      action: self.action,
      isSelected: true});
    
    self.actions = ko.observableArray([
      {value: 'chooseAction'},
      {value: 'createNew'}, 
      {value: 'moveUp'},
      {value: 'breakDown'},
      {value: 'moveDown'}
    ]);

    self.action.subscribe(function(newValue) {
      
      let chosenAction = self.current().action();

      if (chosenAction === 'breakDown'){
        self.breakdown();
      }
    });
    
    //sorting all deliverables in correct order according to ID of new records
    self.wbsAll = ko.computed(function () {
      
      return self.wbs.sorted(function (left, right) {
          
          let a = String(left.deliverable.ID());
          let b = String(right.deliverable.ID());
          
          if (a < b) return -1;
          
          if (a > b) return 1;
          
          return 0;
      });

    });

    /*
     * create new empty record for deliverable
     */
    self.add = function ({deliverable}) {
      
      let parentID = 0;
      let orderID = 0;
      
      if (!!deliverable) {
        
        //get the current record ID
        orderID = deliverable.order();
        parentID = deliverable.parentID();
        orderID++;
         
      } else {
        
        //new record if the parent is a root
        self.wbs().forEach(function (current, index) {
        
            if (current.deliverable.parentID() === parentID) {
              orderID = current.deliverable.order();
            }
        });
        
        //increase last order ID of root level
        orderID++;
      }
      
      let newRecord = new Deliverable(orderID, '', parentID, []);
      
      //new deliverable for user interface
      if (!!newRecord) self.wbs.push({deliverable: newRecord}); 
      
    };  
        
    /*
     * create new empty record for deliverable
     */
    self.addNew = function () {
      
      let parentID = 0;
      let orderID = 0;
      
      if (!!self.current()) {
        
        //get the current record ID
        orderID = self.current().deliverable.order();
        orderID++;
        self.current().deliverable.order(orderID);

        self.wbs.push(self.current());
      } 
    };  
    
    /*
     * break down current entry on the sublevel entries
     */
    self.breakdown = function (){
      
      let parentID = self.current().deliverable.ID();
      
      self.action('chooseAction');
      
      self.current({
          action: self.action,
          deliverable: new Deliverable(1, '', parentID, []),
          isSelected: true
      });      
        
      //insert new deliverable with the parentID of the current deliverable's ID
      self.wbs.push(self.current());
      
    };
    
    //change the order of the current deliverable moving up the record
    self.moveUp = function ({deliverable}){
      
      if (!!deliverable) {
        
        let currentOrder = deliverable.order(); 
        let currentParent = deliverable.parentID();
        
        //get the current deliverable ID and the level
        self.wbs().forEach(function ({deliverable}, index) {
          
          //increase ordinal number of the previous row
          if (deliverable.parentID() === currentParent &&
            currentOrder === deliverable.order()-1){
            
            deliverable.order()++;
            
          }
          
          //decrease ordinal number of current row
          if (deliverable.parentID() === currentParent &&
              currentOrder === deliverable.order()){
              
            deliverable.order()--;
              
          }
          
        });
        
      }
    }
     
    //check if the title if edited or filled out
    self.checkTitle = function ({deliverable}){ 
      
      if (!deliverable) return true;
      
      return !!deliverable.title();
      
    } 
    
    /*
     * show the button new at the last entry of current level
     */
    self.checkOrder = function ({deliverable}){ 
      
      //show button if it is the root level
      if (!deliverable) return true;
      
      //create new record is available only after the last record
      if (!deliverable.parentID()) return false;
      
      let currentOrder = deliverable.order();
      let currentParentID = deliverable.parentID();
      
      //set the visibility to true
      let showBtn = false;
      
      //find the last ID of all deliverable with the same level as current record's level
      self.wbs().forEach(function (current, index) {
      
          if (currentParentID === current.deliverable.parentID()) {
            if (currentOrder >= current.deliverable.order()) {
            
              //always show the button if the orderinal number is larger
              showBtn = true;
            
            } else {
              
              //hide the button in any other cases
              showBtn = false; 
            }
          }
      });
      
      return showBtn;
      
    } 
    
    self.chooseAction = function (){
      console.log(self.current());
    }
    
    self.setCurrent = function (currentDeliverable){
      self.current(currentDeliverable);
    }
    
    
    // internal computed observable that fires whenever anything changes in wbs
    /*ko.computed(function () {
      console.log(self.wbs);
      localStorage.setItem('wbs-local', ko.toJSON(self.wbs));
    }.bind(this)).extend({
      rateLimit: { timeout: 500, method: 'notifyWhenChangesStop' }
    }); // save at most twice per second
    */
  };
  
  return ViewWBS;
  
});