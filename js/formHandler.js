$(function()

{	
	var msg_success = "Your message has been sent.";
	var msg_failed = "Sorry it seems that our mail server is not responding, Sorry for the inconvenience!"
	$("input,textarea").jqBootstrapValidation(
    {
     	preventSubmit: true,
     	submitSuccess: function($form, event)
	 	{			
			if(!$form.attr('action')) // Check form doesnt have action attribute
			{
				event.preventDefault(); // prevent default submit behaviour
			
				var processorFile = getProcessorPath($form);
				var formData = {};

				$form.find("input, textarea, option:selected").each(function(e) // Loop over form objects build data object
				{		
					var fieldData =  $(this).val();
					var fieldID =  $(this).attr('id');
				
					if($(this).is(':checkbox')) // Handle Checkboxes
					{
						fieldData = $(this).is(":checked");
					}
					else if($(this).is(':radio')) // Handle Radios
					{
						fieldData = $(this).val()+' = '+$(this).is(":checked");
					}
					else if($(this).is('option:selected')) // Handle Option Selects
					{
						fieldID = $(this).parent().attr('id');
					}
					
					formData[fieldID] = fieldData;		
				});
				
				$.ajax({
		        	url: processorFile,
		    		type: "POST",
		    		data: formData,
		    		cache: false,
		    		success: function() // Success
		 			{  
						if(msg_success!="") // Show Success Message
						{
							$form.append("<div id='form-alert'><div class='alert alert-success'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button><strong>"+msg_success+"</strong></div></div>");
						}
						else // Re-Direct
						{
							window.location.replace($form.attr('success-url'));
						}	
						
						$form.trigger("reset"); // Clear Form	
		 	   		},
			   		error: function() // Fail
			   		{
						   console.log (msg_failed);
						if(msg_failed!="")
						
						{
							
							$form.append("<div id='form-alert'><div class='alert alert-danger'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button><strong>"+msg_failed+"</strong></div></div>");
						}	
			   		},
		   		});
			}
         },
         filter: function() // Handle hidden form elements
		 {
			 return $(this).is(":visible");
         },
	 });
	 
	 // Get Path to processor PHP file
	 function getProcessorPath(form)
	 {
		var path = "./includes/"+form.attr('id')+".php";
		
		if(form.attr('template-path')) // Check For Template path
		{
			path = form.attr('template-path')+"/includes/"+form.attr('id')+".php";
		}
		
	 	return path
	 }
});