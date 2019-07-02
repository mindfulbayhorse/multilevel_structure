/* 
 * Table buttons 
 * Description: Plugin for table actions for each row with different levels
 * Author: Olga Zhilkova
 * Version: 1.0 
 */
let  Entry = function ( ID, fields ) {
    
    this.ID = ID;
    //if (fields['level'])
    this.fields = fields;
    
};
  
let  entryFactory = (function () {
    let entriesPool = {}, existingEntry;
    
    return {
      createEntry: function ( entryID, fields ) {
   
        existingEntry = existingEntry[ entryID ];
        if ( !!existingEntry ) {
          return existingEntry;
        } else {
   
          let entry = new Entry( entryID, fields );
          entriesPool[entryID] = book;
          return entry;
   
        }
      }
  }
    
})();

let managerEntries = (function () {
  let entryProcesses = {};  
  
  /*
   * initializing action for whole table onsisting of the data
   */
  let init = function ( options ) {
    
    this.settings = $.extend( true, {}, this.defaults, options);    
    let self = this;
    $(options.elementID)
      .unbind()
      .click(function(e) {
          handleAction(e.target);
       });
    
  };
  
  
  /*
   * dividing events on concrete DOM type elements
   */
  let handleAction = function ( element ) {
    let typeButton = /button/i;
    if (typeButton.test(element.tagName))
      console.log(element);
    /*if($(this).hasClass('new') === true)
      self.addEntity($(this));
  
     if($(this).hasClass('decrLevel') === true)
    decreaseLevel($(this));*/
  };
  
  /*
   * creating new row with all separate fields, buttons and ordial level number
   */
  let addEntry = function ( btn ) {
    
    let settings = $(btn).data('plugin_' + pluginName).settings;
    let current_row = $(btn).closest('tr');
    
    //generating new level ID accroding to current tabel row
    levNewID = incOrdinalNumber(settings.findLevel($(current_row).attr(idAttr)));
  
    let btns =  $(entityTemplate(settings))
      .attr(idAttr,levNewID)
      .insertAfter(current_row)
      .find('button');    
    
    $(btns).each( function() {
      
      if ( !$.data(this, "plugin_" + pluginName )) {
        $.data(this, "plugin_" + pluginName,
        new Plugin(this, settings ));
      }
      
    });
       
     let rowNew = $('#'+levNewID);

     stateEdit(rowNew,settings);
        
    let nextRow=$(rowNew).next();
          
    while($(nextRow).index()>0) {
       $(nextRow).attr(idAttr,incOrdinalNumber(settings.findLevel($(nextRow).attr(idAttr))));
       nextRow = $(nextRow).next();
     }

  }
  
  return {
    init: init
  }
  
})();  


let managerStructure = {
	
	pluginName: "multilevelStructure",
	
	defaults:  {
	        actionEl: "button",
	        activeClass: "active",
	        prefixID: "lev_",
	        //make a protection from adding and deleting necessary object property
	        //incorporate the publish and subscriber methods separately from this module by the
	        //event listeners and backward function with another publisher and subscribers updating page functionality
	        fields: ["title","period","cost"],
	        fldsSett: {
	         title: {
	           type: "input"
	         },
	         period: {
             type: "input"
           },
           period_scale: {
             type: "select",
             list:   ['hours', 'days', 'weeks', 'months']
           },
           cost: {
             type: "input",
             format: 'dd.dd $'
           },
           done: {
             type: "checkbox"
           },
	        } 
		},

	
    /* necessary html tags for working plugin properly */
    structure: {
      containerTable: "tbody",
      containerEntry: "tr",
      fieldEl: "input",
    },
    
    readOnlyAttr: "readonly",
    actions: ["create", "modify", 
      "discard", "save", 
      "moveUp", "moveDown", 
      "encreaseLevel", 'decreaseLevel'],
    
    btnsList: { 
      create:  'Create new entity',
      modify:  'Edit entity',
      save: 'Save entity',
      discard: 'Delete entity',
      move_up: 'Move entity up',
      move_down: 'Move entity down',
      increase_level: 'Increase level of entity',
      decrease_level: 'Increase level of entity'
    },

    levelSep: "_",
    dot: ".",
    idAttr: "id",
    listFields: ["level","title","period","period_scale","cost","startFrom","endBy"],

	
	/*
	 * Template for separate table row
	 */
	entityTemplate:function(settings) {
	  
	  let entity = document.createElement('tr');
	  let entityDelete = null;
	  
	  //the panel with buttons
	  let entityActions = document.createElement('th');
	  entityActions.className = 'actions';
	  
	  //inserting each button to the button panel
    for (let [action, title] of Object.entries(btnsList)) {
       
       if (action.toString() === 'discard') {
         //separate button for deleting entry
         entityDelete = document.createElement('th');
         entityDelete.className = 'actions';
         entityDelete.appendChild(addBtn(settings.actionEl, action, title));
       }
       else
         entityActions.appendChild(addBtn(settings.actionEl, action, title));
     }
    
    entity.appendChild(entityActions);
	  
	  //the column containing the level ID of the entity
	  let entityFld = document.createElement('td');
	  entityFld.className = 'level';
	  entity.appendChild(entityFld);
	  
	  settings.fields.forEach(function(element) {
	    
	    entityFld = document.createElement('td');
	    entityFld.className = element;
	    entity.appendChild(entityFld);
	    
	  });

	  if(entityDelete !== null)
	    entity.appendChild(entityDelete);
	  
	  return entity;
    
	},
	
	
	/*
	 * draw button html and its necessary attributes
	 */
	addBtn: function(el, action, title) {
	  
    let btn = document.createElement(el);
    btn.className = action;
    
    if (el === 'button') {
      btn.setAttribute('name', action);
      btn.setAttribute('value', action);
      btn.setAttribute('title', title);
      //use `${key} ${value}` to substitute classes by template
    }
    btn.innnerHTML = '<span class="invisible">' + title + '</span>';
    
    return btn;
	},
	
	
	/*
	 * insert the input field into the entity of the multilevel table
	 */
  addField: function() {
    
    let inp = document.createElement('input');
    inp.setAttribute('type','text');
    inp.setAttribute('readonly','readonly');
    
    //set title and aria-label from customized settings
    if (this.settings.actionForm) {
      inp.setAttribute('form',this.settings.actionForm);
    }
      
    //aditional class for users can be inserted
    inp.className = element;
  },
	
  
	  /*
     * Changing level of the entry to make as a subdirectory of the parent entry
     */
    decreaseLevel: function(e) {
       
      let lastChildLevel = null, prevRowLevel = null;
      let actionBtn = e || this;
      let previousNumber;
         
      let currentRow = $(actionBtn).closest('tr');
      let currentId = $(actionBtn).closest('tr').attr(idAttr);       
       
      let allLevels = this.findLevel(currentId);
      depthLevel = allLevels.lentgh;
      
      //get the 
      if (depthLevel >1 ) previousNumber;    
      previousNumber = allLevels;
   
      //must be tested with the level more than first
      let similarLevel = new RegExp('^' + levelPrexif + previousNumber + '$');
       
       let rowSearch = $(actionBtn).closest('tbody').find('tr').toArray();

       let i=0;
       
       while (prevRowLevel === null  &&  i < rowSearch.length+1) {
         
         if (similarLevel.test($(rowSearch[i]).attr(idAttr))) {
           prevRowLevel = $(rowSearch[i]).attr(idAttr);
         }
             
         i++;
       }  
       
       if (prevRowLevel) lastChildLevel = hasSubDeliv(prevRowLevel);       
       
       //let newLevelId = 0;
       if(lastChildLevel) {
         lastChildLevel++;
         $(currentRow).attr(idAttr,levelPrexif + previousNumber + levelSep + lastChildLevel);
       } else {          
         $(currentRow).attr(idAttr, levelPrexif + previousNumber + levelSep + 1);
         //let subLevel 
         //if(!subLevel)
         //  return;
       }
         
       let nextRow = $(currentRow).next() || null;
       
       while(nextRow) {
         
         $(nextRow)
           .attr(idAttr,decOrdinalNumber(findLevel($(nextRow).attr(idAttr))));
         
         nextRow = $(nextRow).next() || null;
       }

     },
	  
     
     /*
      * edit button action to make any field edible
      */
     stateEdit: function(current_row,settings)
     {
       //set current row active
       $(current_row).parent().children().removeClass(settings.activeRow);
       $(current_row).addClass(settings.activeRow);
        //there must the choice of editing whole table row
        $.each(settings.fields, function( index, value ) {
         $(current_row).find(structure.fieldEl+dot+value).removeAttr(readOnlyAttr);
       });
       
        //focus to only first element
       $(current_row).find(structure.fieldEl).first().focus();
       //another button for saving the value must be changed to active state
     
     },
     
     
     //current row is saved with ajax request
     stateSave: function(current_row)
     {
       $.each(settings.fields, function( index, value ) {
         $(current_row).find(constant.valSelector + "." + value).val();
       });
       //sending ajax request to update this row with needed values
     },
           
       
   /*
   * Get the number of the parent level
   */
   hasSubDeliv: function(currentId) {
          
     let similarLevel = new RegExp('^' + currentId + levelSep + "\\d$");
     let lastChildLevel = null;     
          
     lastChildLevel =  $('#'+currentId)
       .closest('tbody')
       .find('tr')
       .filter(function(index,element) {
         if (similarLevel.test($(this).attr(idAttr))) return 1;
        }).length;
          
     return lastChildLevel;
   },
        
        
  /*
  * Find order number
  */
  findLevel: function(currentId) {
         
    let parsedLevel = 0, 
      pureID,
      numbers = [];
              
    if (this.settings.prefix) {
      let prefix = currentId.lastIndexOf(settings.prefix);
      if (prefix !== false) {
        pureID = currentId.slice(prefix+1);
        numbers = currentId.split(levelSep);
       }
     }
            
     return numbers;
   },
   
  
  /*
  * Increase order number of the same level
  */
  incOrdinalNumber: function(numbersLevel) {
       
    numbersLevel[numbersLevel.length]--;
       
    return numbersLevel.join(levelSep);
    
  },
       
       
  /*
  * Increase order number of the same level
  */
  decOrdinalNumber: function(numbersLevel) {
    
    numbersLevel[numbersLevel.length]--;
         
    return numbersLevel.join(levelSep);
    
  }    
	
	
	 // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
   /* $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if ( !$.data(this, "plugin_" + pluginName )) {
                $.data( this, "plugin_" + pluginName,
                new Plugin( this, options ));
            }
        });
    }*/
               
};