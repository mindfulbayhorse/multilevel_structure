/* 
 * Table buttons 
 * Description: Plugin for table actions for each row with different levels
 * Author: Olga Zhilkova
 * Version: 1.0 
 */
//jQuery.noConflict();
;(function ( $, window, document, undefined ) {
	
	let pluginName = "multilevelStructure",
	  defaults = {
			//DOM element which is the action type for every WBS row
	        button: "button",
	        //a class name to show what action now the row is under 
	        activeClass: "active",
	        //a class name to show which row now is on focus
	        //activeRow: "table-active",
	        onSave: function(elem){ return true},
	        fields: ["title","cost","period"], 
		};
	
    /* necessary html tags for working plugin properly */
    const structure = {
      containerTable: "tbody",
      containerEntry: "tr",
      fieldEl: "input",
    };
    
    const readOnlyAttr="readonly";
    const buttonNew="new";
    const buttonModify="modify";
    const buttonDiscard='discard';
    const buttonSave='save';
    const buttonMoveUp='moveUp';
    const buttonMoveDown='doveDown';
    const buttonEncreaseLevel='encreaseLevel';
    const buttonDecreaseLevel='decreaseLevel';
    const buttonsList=["edit","new","delete","save","moveUp","moveDown","levelDown","levelUp"];
    const levelSeparator = "_";
    const levelPrexif = "lev_";
    const dot = ".";
    const idAttribute =  "id";    
    
    
	
	function Plugin( element, options ) {
		
		this.element = element;
		this.settings = $.extend( true, {}, defaults, options);
		this._defauls = defaults;
		this._name = pluginName;
    this.init();
	}
	
	
	Plugin.prototype.init = function ()
	{
		let self = this;	   
		$(this.element).click(function(){
		  
		   if ($(this).hasClass('new'))
		     self.addDeliverable(self.settings);
		   
		   if ($(this).hasClass('level_down'))
         self.decreaseLevel(self.settings);
		   
		});
	}
	
	
    //new row is added into the table
	Plugin.prototype.addDeliverable = function(settings)
    {
      //changing the styles of the row and make the input fields read only
      //let doSave=settings.onSave(current_row);
      //if(doSave===true)
      //{
	  
		  let current_row=$(this.element).closest('tr');

          //clonning the current row on lower position with the same level
          let rowNew = $(current_row).attr(idAttribute,increaseOrderNumber($(current_row).attr(idAttribute))).clone(true).insertAfter(current_row);
          
          //$(rowNew).attr(idAttribute,increaseOrderNumber($(current_row).attr(idAttribute)));
          
          console.log($(rowNew).attr('id'));
          
          //all values of the new row must be empty
          for (i = 0, len = settings.fields.length; i < len; i++) {
              rowNew.find(structure.fieldEl + '.' + settings.fields[i]).val('');
          }
          stateEdit(rowNew,settings);
          
          let nextRow=$(rowNew).next();
         
          while($(nextRow).index()>0)
          {
            $(nextRow).attr(idAttribute,increaseOrderNumber($(nextRow).attr(idAttribute)));
            nextRow = $(nextRow).next();
          }
      //}

    }
	
	
	  /*
     * Changing level of the entry to make as a subdirectory of the parent entry
     */
     Plugin.prototype.decreaseLevel = function(settings)
     {
         
       let currentRow = $(this.element).closest('tr');
       //console.log(currentRow);
       //console.log($(currentRow).attr('id'));
       let currentId = $(this.element).closest('tr').attr(idAttribute);
       let currentLevel = getLevel(currentId);
       let currentOrder = findOrderNumber(currentId);
       
       let lastChildLevel = null, prevRowLevel = null;
       
       let previousNumber = currentOrder-1;
       if(previousNumber === 0)
         return;    
       
       
       //must be tested with the level more than first
       let similarLevel = new RegExp('^' + levelPrexif + previousNumber + '$');
       
       let rowSearch = $(this.element).closest('tbody').find('tr').toArray();
       //console.log(rowSearch);
         
       let i=0;
       
       while (prevRowLevel === null  &&  i < rowSearch.length+1)
       {
         
         if (similarLevel.test($(rowSearch[i]).attr(idAttribute))) 
             prevRowLevel = $(rowSearch[i]).attr(idAttribute);
         i++;
       }
       
       
       if(prevRowLevel)
         lastChildLevel = hasSubDeliv(prevRowLevel);
       
       
       
       //let newLevelId = 0;
       if(lastChildLevel)
       {
         lastChildLevel++;
         $(currentRow).attr(idAttribute,levelPrexif + previousNumber + levelSeparator + lastChildLevel);
       }
       else
       {          
         $(currentRow).attr(idAttribute, levelPrexif + previousNumber + levelSeparator + 1);
         //let subLevel 
         //if(!subLevel)
         //  return;
       }
         
       
       let nextRow=$(currentRow).next();
       
       while($(nextRow).index()>0)
       {
         $(nextRow).attr(idAttribute,decreaseOrderNumber($(nextRow).attr(idAttribute)));
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
         if(numberLevel.indexOf(levelSeparator) > -1)
           level = numberLevel.split(levelSeparator);    
         
         
         return level+1;
       }
       
       
       /*
        * Get the number of the parent level
        */
        const hasSubDeliv = function(currentId)
        {
          let similarLevel = new RegExp('^' + currentId + levelSeparator + "\\d$");
          let lastChildLevel = null;     
          
          lastChildLevel =  $('#'+currentId).closest('tbody').find('tr').filter(function(index,element)
          { 
             if(similarLevel.test($(this).attr(idAttribute))) 
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
          findLast = currentId.lastIndexOf(levelSeparator);

          //to check all number for separator symbols must be determined to exclude them from digitals
          if(findLast>-1)
             return parseInt(currentId.slice(findLast + 1));
          return false;
        }
        
       /*
        * Increase order number of the same level
        */
       const increaseOrderNumber = function(currentId)
       {
         let parsedLevel = 0, 
         findLast = currentId.lastIndexOf(levelSeparator);

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
       const decreaseOrderNumber = function(currentId)
       {
         let parsedLevel = 0, 
         findLast = currentId.lastIndexOf(levelSeparator);

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
               
       
    
      

})(jQuery);