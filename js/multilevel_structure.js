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
      valSelector: "input",
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
    const levelSeparator= "_";
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
		
		let settings = (this.settings);
		$(this.element).each(function()
		{
		    let current_row=$(this).closest(structure.containerEntry),
	         classRange=$(this).attr("class"),
	       	 actionClass;
	       	
	       	for (let i = 0; i < buttonsList.length; i++)
	       	{
	       		actionClass = new RegExp('(^| )' + buttonsList[i] + '( |$)', 'gi');
	       		if (actionClass.test(classRange))
	       		{
	       			  //removing active class from other buttons
	       			  $(current_row).find(settings.button).removeClass(settings.activeClass);	
	       			  
	                  //making button active with needed CSS class
	                  $(this).addClass(settings.activeClass);
	                  switch(buttonsList[i]) {
	                    case buttonsList[0]:
	                      //stateEdit(current_row);
	                      break;
	                    case buttonsList[1]:
	                      stateNew(current_row,settings);
	                      break;
	                    case buttonsList[3]:
	                      //stateSave(current_row);
	                      break;
	                    case buttonsList[6]:
	                      //stateLevelDown(current_row);
	                      break;
	                   default:
	                      return false;
	               }
	                  
	                  
	       		}
	        }
		});
	}
	
	
    //new row is added into the table
    const stateNew = function(current_row,settings)
    {
      //changing the styles of the row and make the input fields read only
      let doSave=settings.onSave(current_row);
      if(doSave===true)
      {
          //clonning the current row on lower position with the same level
          let rowNew = $(current_row).clone(true).insertAfter(current_row);
          
          rowNew.attr(idAttribute,generateLevel($(current_row).attr(idAttribute)));
          
          //all values of the new row must be empty
          for (i = 0, len = settings.fields.length; i < len; i++) {
              rowNew.find(valSelector+'.'+settings.fields[i]).val('');
          }
          stateEdit(rowNew);
          
          let nextRow=$(rowNew).next();
         
          while($(nextRow).index()>0)
          {
            $(nextRow).attr(idAttribute,generateLevel($(nextRow).attr(idAttribute)));
            nextRow=$(nextRow).next();
          }
      }

    }
	
	  
     
     /*
      * edit button action to make any field edible
      */
     const stateEdit = function(current_row)
     {
       //set current row active
       $(current_row).parent().children().removeClass(settings.activeRow);
       $(current_row).addClass(settings.activeRow);
        //there must the choice of editing whole table row
        $.each(settings.fields, function( index, value ) {
         $(current_row).find(constant.valSelector+constant.dot+value).removeAttr(readOnlyAttr);
       });
       
        //focus to only first element
       $(current_row).find(constant.valSelector).first().focus();
       //another button for saving the value must be changed to active state
     
     };
     
	
	
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
      
      
 
     

      
     
      
      

      
   
            
     
      
      

      
      //current row is saved with ajax request
      const stateSave = function(current_row)
      {
        $.each(settings.fields, function( index, value )
        {
          $(current_row).find(constant.valSelector+"."+value).val();
        });
        //sending ajax request to update this row with needed values
      }
      
      
      /*
      * Changing level of the entry to make as a subdirectory of the parent entry
      */
      const stateLevelDown = function(current_row)
      {
        //generating new ID of the level
        var nextLevel = $(current_row).attr(constant.idAttribute)+constant.levelSeparator;
        
        //check the next row for level
        var nextRowID=$(current_row).next().attr(constant.idAttribute);
        var levelIdPatt = new RegExp($(current_row).attr(constant.idAttribute)+constant.levelSeparator+"\\d");
        //check if the current row has parennt to move it ti  lower level
        var checkLevelCurrent=findlevel($(current_row).attr(constant.idAttribute));
        if(checkLevelCurrent>1)
        {
          //reordering all ID of children rows and their children
          //make recursive function the works to last child
          var lengthSubLevel=$(this).closest(constant.containerTable).filter(
            function(index)
            {
              //slice ID to find the prefic before numbers of the level 
              var id= $(this).attr(constant.idAttribute);       
              return levelIdPatt.test($(this).attr(constant.idAttribute));
            }).length;
        }
          
          return true;
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
        if(lastLevel>0)
        {
          //to add new number the last digit must be interger
          newOrder=lastLevel+1;
          return currentId.slice(0,lastLevel+1)+newOrder;
        }
        else
          return 0;
      }
      
      
      /*
      * Get the number of the most last sublevel of ID
      */
      const findNumberLevel = function(currentId)
      {
        var parsedLevel=0, 
            findLast = currentId.lastIndexOf(constant.levelSeparator);
        
        //to check all number for separator symbols must be determined to exclude them from digitals
        if(findLast>-1)
        {
          //to add new number the last digit must be interger
          //make choice if no prefix before lebel ID
          parsedLevel=parseInt(currentId.slice(findLast+1));
          if (isNaN(parsedLevel)) 
            return 0; 
        }
        return parsedLevel;
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
          currentId=currentId.slice(0,levelSep);
          levelSep=findNumberLevel(currentId);
        }
        
        return i;
      }
      
      
      

       
      

})(jQuery);