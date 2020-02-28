/*
* Olga Zhilkova
* view model for WBS template
*/
define([
  'library/knockout',
  'models/deliverable',
  'models/recordaction'
], function (ko, Deliverable, Action) {
  
  'use strict';
 
  let ViewWBS = function (storageWBS) {
    
    let self = this;
    
    //all ordered records of deliverables
    self.wbs = ko.observableArray(ko.utils.arrayMap(storageWBS, function (record) {
      return new Deliverable(record.order, record.title, record.parentID, []);
    }));   
    
    self.currentDate = Date.now();
        
    self.errors = ko.observable();
    
    self.collection = ko.observable({});
    
    self.validField = ko.observable(false);
    
    self.newDeliverable = ko.observable(new Deliverable(0, '', 0, '0.00', self.currentDate, null, false));
   
    //current edited or last added deliverable
    self.current = ko.observable();
    
    //parent deliverable that is detailed with children deliverables
    self.parent = ko.observable();
    
    
    //actions are available
    self.actionsBar = ko.observable(false);
    
    self.current.subscribe(function(newValue) {
      
      if (!!newValue) {
        self.actionsBar(true);
      } else {
        self.actionsBar(false);
      }
      
      
    });
    /*
     * sorting all deliverables in correct order according to ID of new records
     */
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
      
      if (!!self.newDeliverable() && self.newDeliverable().titleValid) {
        
        //get the current record ID
        orderID = self.newDeliverable().order();
        orderID++;
        self.newDeliverable().order(orderID);
        
        //self.current({entry: self.newDeliverable()});
        
        //self.wbs.push(self.current());
        
        self.wbs.push({entry: self.newDeliverable()});
        
        //it is nesessary to ensure that there is no entry with the same ID, because previous entry will be overwitten by new
        //self.collection()[self.current().entry.ID()] = self.current().entry;

        self.newDeliverable(new Deliverable(orderID, '', 0, '0.00', self.currentDate, null, false));
        
        
        return true;
        
      } 
      
      return false;

    };
       
    /*
     * break down current entry on the sublevel entries
     */
    self.breakdown = function (){
      
      self.parent(self.collection()[self.current().entry.ID()]);
      
      self.newDeliverable.parentID = self.current().entry.ID();
      
      self.newDeliverable.dateStart = self.current().entry.dateStart();
      
      self.current({entry: self.newDeliverable});
      
    };
    
    //get the level of the parent deliverable
    self.currentLevel = function ({entry}){
      
      if (!!self.parent){
        if (parent().ID() === entry.parentID()) return true;
      } else {
        if (entry.parentID() === 0) return true;
      }
      
      return false;
    }
    
    /*
     * extract deliverable by its ID
     */
    self.getByID = function(ID){
      
      //it is necessary to update ID and check for renewal of other ID withing some amount of time
      return self.collection()[ID];
    }
    
    //change the order of the current deliverable moving up the record
    self.moveUp = function (){
      
      //try to use new ES 6 operators
    }
    
    /*
     * descend the order of the deliverable
     */
    self.moveDown = function(){
      
    }
    
    /*
     * make moveUp button available for current deliverable
     */
    self.enableMoveUp = function (){
      
      if (self.current().entry.order()===0) {
        return true;
      }
      
      return false;
    }
    
    /*
     * decrease the level of the deliverable
     */
    self.decreaseLevel = function(){
      return 
    }
    
    /*
     * increase the level of the deliverable
     */
    self.elevateLevel = function(){
      
    }
     
    //validating necessary field to procede with operations on current deliverable
    //self.validField = function(record){
      
      //return !!record().title();
        
    //}
    
    //show errors during user input
    self.showErrors = function(){
      
      if (!self.checkTitle(self.current().entry.title())) self.errors('The title is empty!');
      
      return '';
    }
    
    //list of actions available in WBS for every delivarebl
    let listActions = [
        {id: 'breakdown', text: 'Break down', click: function () { return self.breakdown} },
        {id: 'moveUp', text: 'Move up', disabled: function(){ return self.enableMoveUp }},
        {id: 'moveDown', text: 'Move down'},
        {id: 'elevateLevel', text: 'Elevate level'},
        {id: 'decreaseLevel', text: 'Decrease level'}
    ];
    
    self.actions = listActions;
    
    // internal computed observable that fires whenever anything changes in wbs
    //ko.computed(function () {
    //  localStorage.setItem('wbsLocal', ko.toJSON(self.wbs()));
    //}.bind(this)).extend({
     // rateLimit: { timeout: 500, method: 'notifyWhenChangesStop' }
    //}); // save at most twice per second
    
  };
  
  return ViewWBS;
  
});