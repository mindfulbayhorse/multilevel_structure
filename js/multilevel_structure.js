/* 
 * Breakdown list
 * Description: Making work breakdown structure for deliverables or any list
 * Author: Olga Zhilkova
 * Version: 1.0 
 */
;
(function($, window, document, undefined) {

  'use strict';

  /*
   * Single deliverable
   */
  let Entry = function(ID, title) {

    this.ID = ID;
    this.title = ID;

    return this;

  };

  /*
   * Storage of all records of deliverables
   */
  let EntryFactory = (function() {

    let records = {};
    let current = 0;

    return {

      // add new deliverable to collection
      createEntry : function(entryID, title) {

        let recordExists = records[entryID];
        if (!!recordExists) {

          return recordExists;

        } else {

          let entry = new Entry(entryID, title);
          records[entryID] = entry;
          return entry;

        }
      },

      // return all entries
      getList : function() {
        return records;
      },

      // get record by its ID
      getEntry : function(entryID) {
        return records[entryID];
      }

    }

  })();

  /*
   * Methods to update template with event handlings for user interface
   */
  let interfaceProvider = function(contextRules) {

    this.cotext = contextRules;

    // get all nodes that have a content binding
    this.getNodes = function(tempID) {

      let node = document.getElementById(tempID);

      if (node.length === 0)
        return false;

      return node.el.querySelectorAll("[data-template]");

    };

    // return the bindings given a node and the bindingContext
    this.getBindings = function(node) {

      // determine if an element has any binding
      let classes = node.getAttribute("data-template");

      if (!!classes) {

        classes = classes.split(' ');
        // evaluate each class, build a single object to return
        for (var i = 0, j = classes.length; i < j; i++) {

          let bindingAccessor = _self.cotext[classes[i]];
          if (!!bindingAccessor) {

            if (typeof bindingAccessor === "function") {

              // subscribe concrete nodes through view
              bindingAccessor.call(cotext.data);

            } else {
              // show formatted content through view
            }

          }
        }
      }

    };

    // public methods to use
    return {
      getTemplate : getTemplate,
      bindingObject : _self.bindingObject,
      getBindings : getBindings,
      nodes : _self.nodes
    }

  }

  /*
   * Manage necessary actions
   */
  let managerStructure = function(options) {

    // keep only entry IDs
    this.inActionsEntries = {};
    this.options = options;
    let _self = this;

    // add new entry and record the current its state
    let addDeliverable = function(id, title) {

      let entry = EntryFactory.create(id, title);

      inActionsEntries[entry.ID] = {
        state : 'new',
        done : false,
        filled : false
      }

    };

    // fill template with the data and interface events
    let applyEvents = function(sheet) {

      // apply every event to each node in the template
      let nodeID = _self.id || '';

      let contentNodes = sheet.getNodes(nodeID);

      contentNodes.forEach(function(node, index) {

        // sheet.getBindings(node, collection);

      });

    };

    // initializing data for WBS
    let init = function(records) {

      if (records.length === 0)
        return;

      records.forEach(function(val, index) {

        if (!!val.id && !!val.title) {
          _self.addDeliverable(val.id, val.title);
        }

      });

    };

    // public methods
    return {
      add : addDeliverable,
      init : init,
      applyEvents : applyEvents,
      event : event
    }

  };

  /*
   * templateBreakdown - connect template with WBS
   */
  let templateBreakdown = function(deliverables) {

    var self = this;
    // map array of passed in todos to an observableArray of Todo objects
    self.deliverables = ko.observableArray(ko.utils.arrayMap(deliverables,
        function(deliverables) {
          return new Entry(todo.content, todo.done);
        }));

  };

  // setting for template to find html marks for connecting correct event from
  // the Model
  let bindingRules = {

    deliverables : {
      foreach : viewModel.todos
    },
    deliverable : function() {
      return this;
    },

  };

  // initial empty list
  let list = [];

  var viewModel = new templateBreakdown(list || []);

  // initial options
  let options = {
    id : 'WBS'
  };

  // setting up interface provider for template and model content
  let templateProvider = new interfaceProvider(bindingRules);

  // setting up the manager to control template during user interaction
  let manager = new managerStructure(options);

  // filling existing records to the breakdown sheet
  manager.init(list);

  // making template interactive for user
  manager.applyEvents();

})(jQuery, window, document);
