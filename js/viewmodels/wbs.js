/*
* Olga Zhilkova
* view model for WBS template
*/
import ko from "knockout";
import Deliverable from '../models/deliverable.js';
export default function (storageWBS) {
    
    let self = this;
    
    //all ordered records of deliverables
    self.wbs = ko.observableArray(ko.utils.arrayMap(storageWBS, function (record) {
      return new Deliverable(record.order, record.title, record.parentID, []);
    }));   
    
    self.currentDate = Date.now();
        
    self.errors = ko.observable();
    
    //current edited or last added deliverable
    self.current = ko.observable(false);

    //parent deliverable that is detailed with children deliverables
    self.parent = ko.observable(0);
    
    //new deliverable
    self.newDeliverable = ko.observable(new Deliverable(0, '', self.parent(), '0.00', self.currentDate, null, false));
    
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
    
    
    self.calculatedParent = ko.computed(function() {
      
      if (!!self.parent()) {
        return self.WBS().find( ({ entry }) => entry.ID === self.parent() );
        
      } else {
        return {entry: new Deliverable(0, '', self.parent(), '0.00', self.currentDate, null, false)};
      }
      
    }, this);

    /*
     * create new empty record for deliverable on root level
     */
    self.addNew = function () {
      
      let orderID = 0;
      
      if (!!self.newDeliverable() && self.newDeliverable().titleValid) {
        
        //get the current record ID
        orderID = self.newDeliverable().order();
        orderID++;
        
        self.newDeliverable().order(orderID);
        
        self.wbs.push({entry: self.newDeliverable()});

        self.newDeliverable(new Deliverable(orderID, '', self.parent(), '0.00', self.currentDate, null, false));
        
        return true;
        
      } 
      
      return false;

    };
       
    /*
     * break down current entry on the sublevel entries
     */
    self.breakdown = function (){
      
      self.parent(self.current().entry.ID());
      
      self.newDeliverable().parentID(self.parent());
      self.newDeliverable().order(0);
      
      self.newDeliverable().dateStart(self.current().entry.dateStart());
      
      self.parent(self.current());

    };
    
    self.setCurrent = function(record){
      self.current(record);

      console.log(record);
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
    self.isSelected = function(record){
    	
		if (self.current().ID() === record.entry().ID()){
			return true;
		}
			
		return false;
        
    }
    
    
    //show errors during user input
    self.showErrors = function(){
      
      if (!self.checkTitle(self.current().entry.title())) self.errors('The title is empty!');
      
      return '';
    }
    
    //list of actions available in WBS for every delivarebl
    self.actions = [
        {id: 'breakdown', text: 'Break down'},
        {id: 'moveUp', text: 'Move up', disabled: function(){ return self.enableMoveUp }},
        {id: 'moveDown', text: 'Move down'},
        {id: 'elevateLevel', text: 'Elevate level'},
        {id: 'decreaseLevel', text: 'Decrease level'}
    ];
    
    // internal computed observable that fires whenever anything changes in wbs
    ko.computed(function () {
      localStorage.setItem('wbsLocal', ko.toJSON(self.wbs()));
    }.bind(this));
    //.extend({
     // rateLimit: { timeout: 500, method: 'notifyWhenChangesStop' }
    //}); // save at most twice per second
    
  };