$(function(jQuery){
    
    $.fn.validate = function(options)
    {

     
       var defaults = {
        classError: 'invalid',
        submit: '',
        eventInput: '',
        requiredData: 'required',
      };
      
      
      const mainParams={
        form: 'form',
        typesFields: {hidden:'hidden',
                        submit:'submit',
                        hidden:'hidden',
                        radio:'radio',
                        checkbox:'checkbox'},
        typesMasks: ['phone','email'],
        typesGroup: ['bithday','gender'],
        typeInput: 'input',
        eventInput: ['change','focus'],
      };
      
        //merging user setting and defining standard settings
      var settings = $.extend( true, {}, defaults, options);
      
      var formID=$(this).attr("id");
      var submitButton= $(this).find(mainParams.typeInput+'[type="'+mainParams.typesFields.submit+'"]');
      
      var valid=true;
       
      if(settings.submit!=='')
      {
        var submitButton=this.find(settings.submit);
      }
      else
        var submitButton= $(this).find(mainParams.typeInput+'[type="'+mainParams.typesFields.submit+'"]');
        
      
      var initLoading = function()
      {
        if($(submitButton).length>0)
         $(submitButton).attr('disabled','disabled');
         
          if($(this).is(mainParams.typesFields.form))
            $(this).prop('onSubmit',false);
          
          
          switch (settings.eventInput)
          {
             case mainParams.eventInput[0]:
                 $('#'+formID+' '+mainParams.typeInput).filter(function(index,element)
                    {
                        if($(this).attr('type')!=mainParams.typesFields.hidden && 
                            $(this).attr('type')!=mainParams.typesFields.submit &&
                            $(this).attr('type')!=mainParams.typesFields.radio)
                            {
                                if($(this).data() && $(this).data(setting.requiredData)===true)
                                return 1;
                            }
        
                    }).change(function(){
                        
                        bondSubmit();
                        
                    });
                    break;
             
             default:
                bondSubmit();
                break;
          }
         
            
          //if it needs to remove placeholder
            /*.focus(function()
            {
                if($(this).val()===$(this).prop('placeholder'))
                {
                    $(this).val('');
                }
                
            }).blur(function(){
                
                if(!$(this).val())
                {
                    $(this).val($(this).prop('placeholder'));
                }
                
            });*/
      };
      
      
      

      var bondSubmit = function()
      {       
        
        //identifing require fields
       
        $('#'+formID+' '+mainParams.typeInput).filter(function(index,element)
        {
            
            if($(this).attr('type')!=mainParams.typesFields.hidden && 
                    $(this).attr('type')!=mainParams.typesFields.submit &&
                    $(this).attr('type')!=mainParams.typesFields.radio)
                    {
                        if($(this).data() && $(this).data(settings.requiredData)===true)
                                return 1;
                    }
        }).each(function( index )
        {
            if($(this).attr('type')===mainParams.typesFields.checkbox)
            {
               if($(this).prop( "checked" )===false)
                    valid=false;
            }
            else
            {
                if (!$(this).val())
                {
                    $(this).addClass(settings.classError);
                    valid=false;
                }
                else
                    $(this).removeClass(settings.classError);
            }
                
        });
    
            if (valid===true)
            {
                if($(submitButton).length>0)
                    $(submitButton).removeAttr('disabled');
                if($(this).is(mainParams.form))
                {
                    $(this).removeProp('onSubmit');
                }  
            }
            else
            {
                if($(submitButton).length>0)
                 $(submitButton).attr('disabled','disabled');
                 setTimeout(bondSubmit, 100);
            }
 
      };
      
      
       $(this).each(function()
       {
            initLoading();
       });
     
      
      
      return valid; 

    };
});