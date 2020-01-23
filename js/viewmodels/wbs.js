/*
* Olga Zhilkova
* view model for WBS template
*/
define([
  'library/knockout',
  'models/deliverable',
  'models/recordaction'
], function (ko, Deliverable, actions) {
  
  'use strict';
 
  let ViewWBS = function (storageWBS) {
    
    let self = this;
    
    //all ordered records of deliverables
    self.wbs = ko.observableArray(ko.utils.arrayMap(storageWBS, function (record) {
      return new Deliverable(record.order, record.title, record.parentID, []);
    }));   
    
    self.currentDate = Date.now();
    
    self.actions = actions;
    
    self.action = ko.observable();
    
    self.newDeliverable = ko.observable(new Deliverable(0, '', 0, '0.00', null, null, false));
    
    //cursor to truck newely added record
    self.current = ko.observable();

    self.action.subscribe(function (newValue) { 
      
      let chosenAction = self.action();
      
      if (chosenAction === 'breakdown'){
        self.breakdown();
      }
    });
    
    //sorting all deliverables in correct order according to ID of new records
    self.wbsAll = ko.computed(function () {
      
      return self.wbs.sorted(function (left, right) {
          
          let a = String(left.entry.ID());
          let b = String(right.entry.ID());
          
          if (a < b) return -1;
          
          if (a > b) return 1;
          
          return 0;
      });

    });

    /*
     * create new empty record for deliverable on root level
     */
    self.addNew = function () {
      
      let parentID = 0;
      let orderID = 0;
      
      if (!!self.newDeliverable && !!self.newDeliverable().title()) {
        
        //get the current record ID
        orderID = self.newDeliverable().order();
        orderID++;
        self.newDeliverable().order(orderID);
        
        self.current({entry: self.newDeliverable()});

        self.wbs.push(self.current());
        
        self.newDeliverable(new Deliverable(0, '', 0, '0.00', null, null, false));
        
      } 

    };
    
    //validate title
    self.validTitle = function (){
      
      if (!!self.current().title()) {
        return '';
      } else {
        return 'err';
      }
      
    }
    
    /*
     * break down current entry on the sublevel entries
     */
    self.breakdown = function (){
      
      let parentID = self.current().entry.ID();
      
      //self.action('not_chosen');
      
      self.current({
        entry: new Deliverable(1, '', parentID, '0.00', self.currentUTC, null, false),
        action: 'not_chosen'   
      });
        
      //insert new deliverable with the parentID of the current deliverable's ID
      self.wbs.push(self.current());
      
    };
    
    //change the order of the current deliverable moving up the record
    self.moveUp = function (){
      
      if (!!self.current()) {
        
        let currentOrder = self.current().order(); 
        let currentParent = self.current().parentID();
        
        //get the current deliverable ID and the level
        self.wbs().forEach(function (deliverable, index) {
          
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
    self.checkTitle = function ({entry}){ 
      
      if (!entry) return true;
      
      return !!entry.title();
      
    } 
    
    /*
     * show the button new at the last entry of current level
     */
    self.checkOrder = function (){ 
      
      //show button if it is the root level
      if (!self.current()) return true;
      
      //create new record is available only after the last record
      if (!self.current().entry.parentID()) return false;
      
      let currentOrder = self.current().entry.order();
      let currentParentID = self.current().entry.parentID();
      
      //set the visibility to true
      let showBtn = false;
      
      //find the last ID of all deliverable with the same level as current record's level
      self.wbs().forEach(function (deliverable, index) {
      
          if (currentParentID === deliverable.parentID()) {
            if (currentOrder >= deliverable.order()) {
            
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
    
    self.setCurrent = function (record){
      self.current(record);
      console.log(self.current);
    }
    
    // internal computed observable that fires whenever anything changes in wbs
    ko.computed(function () {
      localStorage.setItem('wbsLocal', ko.toJSON(self.wbs()));
    }.bind(this)).extend({
      rateLimit: { timeout: 500, method: 'notifyWhenChangesStop' }
    }); // save at most twice per second
    
  };
  
  return ViewWBS;
  
});