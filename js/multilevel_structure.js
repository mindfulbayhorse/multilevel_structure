/* 
 * Table buttons 
 * Description: Plugin for table actions for each row with different levels
 * Author: Olga Zhilkova
 * Version: 1.0 
 */
//jQuery.noConflict();
(function($){
    
    $.fn.multilevelStructure = function(options)
    {
      var defaults = {
        element: "button",
        editClass: "edit",
        activeButtonClass: "active",
        activeRow: "table-active",
        prefixRowId: "deliv",
        idAttribute: "id",
        levelSeparator: "_",
        onSave: function(elem){ return true},
        fields: ["title","cost","period"], 
      };
      
      const constant= {
        buttons: ["edit","new","delete","save","moveUp","moveDown","levelDown","levelUp"],
        containerTable: "tbody",
        containerEntry: "tr",
        valSelector: "input",
        dot: ".",
        readAttr: "readonly"
      };
      
      /* future possible options */
      //the choice to edit just one field
      
      
      /* necessary html tags for working plugin properly */
      //all classes in Constant object must exist in html
      //check additional classes that uses user or bootstrap styles and safe them in html
      
      //merging user setting and defining standard settings
      var settings = $.extend( true, {}, defaults, options);
      
      var Implement = function(action,current_row){
        
        switch(action) {
            case constant.buttons[0]:
                stateEdit(current_row);
                break;
            case constant.buttons[1]:
                stateNew(current_row);
                break;
            case constant.buttons[3]:
                stateSave(current_row);
                break;
            case constant.buttons[6]:
                stateLevelDown(current_row);
                break;
            default:
                return false;
        }

      };
      
        //edit start button action to make any field edible
        var stateEdit = function(current_row)
        {
          //set current row active
          $(current_row).parent().children().removeClass(settings.activeRow);
          $(current_row).addClass(settings.activeRow);
           //there must the choice of editing whole table row
           $.each(settings.fields, function( index, value ) {
            $(current_row).find(constant.valSelector+constant.dot+value).removeAttr(constant.readAttr);
          });
          
           //focus to only first element
          $(current_row).find(constant.valSelector).first().focus();
          //another button for saving the value must be changed to active state
        
        };
            
     
      
      
      //new row is added into the table
      var stateNew = function(current_row)
      {
        //changing the styles of the row and make the input fields read only
        var doSave=settings.onSave(current_row);
        if(doSave===true)
        {
            //clonning the current row on lower position with the same level
            var rowNew = $(current_row).clone(true).insertAfter(current_row);
            
            rowNew.attr(settings.idAttribute,generateLevel($(current_row).attr(settings.idAttribute)));
            
            //all values of the new row must be empty
            for (i = 0, len = settings.fields.length; i < len; i++) {
                rowNew.find(constant.valSelector+'.'+settings.fields[i]).val('');
            }
            stateEdit(rowNew);
            
            var nextRow=$(rowNew).next();
           
            while($(nextRow).index()>0)
            {
              $(nextRow).attr(settings.idAttribute,generateLevel($(nextRow).attr(settings.idAttribute)));
              nextRow=$(nextRow).next();
            }
        }

      }
      
      //current row is saved with ajax request
      var stateSave = function(current_row)
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
      var stateLevelDown = function(current_row)
      {
        //generating new ID of the level
        var nextLevel = $(current_row).attr(settings.idAttribute)+settings.levelSeparator;
        
        //check the next row for level
        var nextRowID=$(current_row).next().attr(settings.idAttribute);
        var levelIdPatt = new RegExp($(current_row).attr(settings.idAttribute)+settings.levelSeparator+"\\d");
        //check if the current row has parennt to move it ti  lower level
        var checkLevelCurrent=findlevel($(current_row).attr(settings.idAttribute));
        if(checkLevelCurrent>1)
        {
          //reordering all ID of children rows and their children
          //make recursive function the works to last child
          var lengthSubLevel=$(this).closest(constant.containerTable).filter(
            function(index)
            {
              //slice ID to find the prefic before numbers of the level 
              var id= $(this).attr(settings.idAttribute);       
              return levelIdPatt.test($(this).attr(settings.idAttribute));
            }).length;
        }
          
          return true;
      }
      
      /*
      * Generate the next level relating to the current level
      */
      var generateLevel = function(currentId)
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
      var findNumberLevel = function(currentId)
      {
        var parsedLevel=0, 
            findLast = currentId.lastIndexOf(settings.levelSeparator);
        
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
      var findLevel = function(currentId)
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
      
      
      /*
      * Deleting row 
      */
      var stateDelete = function(current_row)
      {
        //active state for row
        //asking before deleting the row if the user sure about it
        //check is the winodw is plugin or local window
        //deleting the row from the DOM
        //deleting row from the DB
      }
      
      
      /*
      * reordering all table with new row and new row ID
      */
      var reorderTable = function(current_row)
      {
        //the next rows must be rearanged with last number increased on one more count
        //all rows that are childrens from the first level rows and further levels must have first and other needed numbers incresed
      }
      
      
      /*
      * main implementation for assigning elements
      */
      var bondButtons = function()
      {
        var button=$(this),
          current_row=$(this).closest(constant.containerEntry);
        
        //identifing objects for every action
        $.each(constant.buttons, function( index, value ) {
            
            if ($(button).hasClass(value)===true)
            {
              //removing active class from other buttons
              $(current_row).find(settings.element).removeClass(settings.activeButtonClass);
              //making button active with needed CSS class
              $(button).addClass(settings.activeButtonClass);
              Implement(value,current_row); 
            }
            
          });
      }
       
      return this.bind('click',bondButtons);
    };
 

    // Private function for debugging.
    function debug_props(obj)
    {
      window.console.log("Attribute of the button: " + obj.attr('class'));
        
    };
    
    //
    function find_length(obj)
    {
      window.console.log("Field: " + obj.length);
       
    };
 

})(jQuery);