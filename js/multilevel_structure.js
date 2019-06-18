/* 
 * Table buttons 
 * Description: Plugin for table actions for each row with different levels
 * Author: Olga Zhilkova
 * Version: 1.0 
 */
;(function ( $, window, document, undefined ) {
	
	let pluginName = "multilevelStructure";
	
	let  defaults = {
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
		};

	
    /* necessary html tags for working plugin properly */
    const structure = {
      containerTable: "tbody",
      containerEntry: "tr",
      fieldEl: "input",
    };
    
    const readOnlyAttr="readonly";
    const actions = ["create", "modify", 
      "discard", "save", 
      "moveUp", "moveDown", 
      "encreaseLevel", 'decreaseLevel'];
    
    const btnsList = { 
      create:  'Create new entity',
      modify:  'Edit entity',
      save: 'Save entity',
      discard: 'Delete entity',
      move_up: 'Move entity up',
      move_down: 'Move entity down',
      increase_level: 'Increase level of entity',
      decrease_level: 'Increase level of entity'
    };

    const levelSep = "_";
    const dot = ".";
    const idAttr =  "id";   
    const listFields = ["level","title","period","period_scale","cost","startFrom","endBy"];
    
    
	
	function Plugin( element, options ) {
		
		this.element = element;
		this.settings = $.extend( true, {}, defaults, options);
		this._defauls = defaults;
		this._name = pluginName;
    this.init();
    
    
	}	
	
	
	/*
	 * initializing action for each button of the table row
	 */
	Plugin.prototype.init = function ()
	{
		let self = this;	   
		$(this.element).click(function() {
	  
	    if($(this).hasClass('new') === true)
	      self.addDeliverable($(this));
	  
	     if($(this).hasClass('decrLevel') === true)
	    decreaseLevel($(this));
		});
		
	}
	
	
    /*
     * creating new row with all separate fields, buttons and ordial level number
     */
	  Plugin.prototype.addDeliverable = function(btn)
    {
	    
	    let settings = $(btn).data('plugin_' + pluginName).settings;
		  let current_row=$(btn).closest('tr');
		  
		  //generating new level ID accroding to current tabel row
		  levNewID = incOrdinalNumber($(current_row).attr(idAttr));
		
		  let btns =  $(entityTemplate(settings))
		    .attr(idAttr,levNewID)
		    .insertAfter(current_row)
		    .find('button');	  
		  
		  $(btns).each(function(){
		    
		    if ( !$.data(this, "plugin_" + pluginName )) {
	        $.data(this, "plugin_" + pluginName,
	        new Plugin(this, settings ));
		    }
		  });
			   
		   let rowNew = $('#'+levNewID);

          stateEdit(rowNew,settings);
          
          let nextRow=$(rowNew).next();
          
         
          while($(nextRow).index()>0)
          {
            $(nextRow).attr(idAttr,incOrdinalNumber($(nextRow).attr(idAttr)));
            nextRow = $(nextRow).next();
          }

    }
	
	
	/*
	 * Template for separate table row
	 */
	const entityTemplate = function(settings) {
	  
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
    
	};
	
	
	/*
	 * draw button html and its necessary attributes
	 */
	const addBtn = function(el, action, title) {
	  
    let btn = document.createElement(el);
    btn.className = action;
    
    if (el === 'button')
    {
      btn.setAttribute('name', action);
      btn.setAttribute('value', action);
      btn.setAttribute('title', title);
      //use `${key} ${value}` to substitute classes by template
    }
    btn.innnerHTML = '<span class="invisible">' + title + '</span>';
    
    return btn;
	}
	
	
	/*
	 * insert the input field into the entity of the multilevel table
	 */
  const addField = function() {
    
    let inp = document.createElement('input');
    inp.setAttribute('type','text');
    inp.setAttribute('readonly','readonly');
    
    //set title and aria-label from customized settings
    if(this.settings.actionForm)
      inp.setAttribute('form',this.settings.actionForm);
    
    //aditional class for users can be inserted
    inp.className = element;
  }
	
  
	  /*
     * Changing level of the entry to make as a subdirectory of the parent entry
     */
    const decreaseLevel = function(e) {
       
       let actionBtn = e || this;
         
       let currentRow = $(actionBtn).closest('tr');

       let currentId = $(actionBtn).closest('tr').attr(idAttr);
       let currentLevel = getLevel(currentId);
       let currentOrder = findOrderNumber(currentId);
       
       let lastChildLevel = null, prevRowLevel = null;
       
       let previousNumber = currentOrder-1;
       if(previousNumber === 0)
         return;    
       
       
       //must be tested with the level more than first
       let similarLevel = new RegExp('^' + levelPrexif + previousNumber + '$');
       
       let rowSearch = $(actionBtn).closest('tbody').find('tr').toArray();

         
       let i=0;
       
       while (prevRowLevel === null  &&  i < rowSearch.length+1)
       {
         
         if (similarLevel.test($(rowSearch[i]).attr(idAttr))) 
             prevRowLevel = $(rowSearch[i]).attr(idAttr);
         i++;
       }  
       
       if(prevRowLevel)
         lastChildLevel = hasSubDeliv(prevRowLevel);       
       
       //let newLevelId = 0;
       if(lastChildLevel)
       {
         lastChildLevel++;
         $(currentRow).attr(idAttr,levelPrexif + previousNumber + levelSep + lastChildLevel);
       }
       else
       {          
         $(currentRow).attr(idAttr, levelPrexif + previousNumber + levelSep + 1);
         //let subLevel 
         //if(!subLevel)
         //  return;
       }
         
       
       let nextRow=$(currentRow).next();
       
       while($(nextRow).index()>0)
       {
         $(nextRow).attr(idAttr,decreaseOrderNumber($(nextRow).attr(idAttr)));
         nextRow = $(nextRow).next();
       }

     }
	  
     
     /*
      * edit button action to make any field edible
      */
     const stateEdit = function(current_row,settings)
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
     
     };
     
     
     //current row is saved with ajax request
     const stateSave = function(current_row)
     {
       $.each(settings.fields, function( index, value )
       {
         $(current_row).find(constant.valSelector + "." + value).val();
       });
       //sending ajax request to update this row with needed values
     }
           
      
      /*
       * Get the number of the parent level
       */
       const getLevel = function(currentId)
       {
         let numberLevel = currentId.slice(levelPrexif.length);
         
         let level = 0;
         if(numberLevel.indexOf(levelSep) > -1)
           level = numberLevel.split(levelSep);    
         
         
         return level+1;
       }
       
       
       /*
        * Get the number of the parent level
        */
        const hasSubDeliv = function(currentId)
        {
          let similarLevel = new RegExp('^' + currentId + levelSep + "\\d$");
          let lastChildLevel = null;     
          
          lastChildLevel =  $('#'+currentId).closest('tbody').find('tr').filter(function(index,element)
          { 
             if(similarLevel.test($(this).attr(idAttr))) 
                 return 1;
          }).length;
          
          return lastChildLevel;
        }
        
        
        /*
         * Find order number
         */
       const findOrderNumber = function(currentId)
        {
          let parsedLevel = 0, 
          findLast = currentId.lastIndexOf(levelSep);

          //to check all number for separator symbols must be determined to exclude them from digitals
          if(findLast>-1)
             return parseInt(currentId.slice(findLast + 1));
          return false;
        }
        
       /*
        * Increase order number of the same level
        */
       const incOrdinalNumber = function(currentId)
       {
         let parsedLevel = 0, 
         findLast = currentId.lastIndexOf(levelSep);

         //to check all number for separator symbols must be determined to exclude them from digitals
         if(findLast>-1)
         {
            //to add new number the last digit must be interger
            //make choice if no prefix before lebel ID
           
            parsedLevel = parseInt(currentId.slice(findLast + 1));
            
            //check how function parseInt works
            if (!isNaN(parsedLevel)) {
              parsedLevel++;
             return currentId.slice(0, findLast+1) + parsedLevel;
          }
            
         }
         
         return false;
       }
       
       
       /*
        * Increase order number of the same level
        */
       const decOrdialNumber = function(currentId)
       {
         let parsedLevel = 0, 
         findLast = currentId.lastIndexOf(levelSep);

         //to check all number for separator symbols must be determined to exclude them from digitals
         if(findLast>-1)
         {
            //to add new number the last digit must be interger
            //make choice if no prefix before lebel ID
            parsedLevel = parseInt(currentId.slice(findLast + 1));
            
            //check how function parseInt works
            if (isNaN(parsedLevel))
              return false;
            
            parsedLevel--;
            if(parsedLevel>0)
             return currentId.slice(0, findLast+1) + parsedLevel;
         }
         
         return false;
       }        
      
      
      /*
      * Get the level of the current row
      */
      const findLevel = function(currentId)
      {
        var i=0, levelSep=findNumberLevel(currentId);
        
        while(levelSep>0)
        {
          i++;
          currentId = currentId.slice(0,levelSep);
          levelSep = findNumberLevel(currentId);
        }
        
        return i;
      }
      
      /*
       * Generate the next level relating to the current level
       */
       const generateLevel = function(currentId)
       {
         var newOrder, newId; 
         //the last number of the new row must be increased to 1
          
         var lastLevel = findNumberLevel(currentId);
         
         //to check all number for separator symbols must be determined to exclude them from digitals
         if(lastLevel > 0)
         {
           //to add new number the last digit must be interger
           newOrder = lastLevel + 1;
           return currentId.slice(0, lastLevel + 1) + newOrder;
         }
         else
           return 0;
       } 
     
	
	
	 // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if ( !$.data(this, "plugin_" + pluginName )) {
                $.data( this, "plugin_" + pluginName,
                new Plugin( this, options ));
            }
        });
    }
               
       
    
      

})(jQuery,window, document);