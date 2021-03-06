(function($) {
	
	$.fn.validate = function(options) {
	
		//Default Options
		var settings = $.extend({
			failedClass:		'failed',
			passedClass:		'success',
			submitClass:		'.submit',
			//only ajax form if user sets path
			ajaxPath:			''
		}, options);
		
		return this.each(function(){
			var form = this;
			
			//Selects inputs and text areas with required tag
			var inputs = $(form).find('input[required], textarea[required], select[required]');

			//Checks each input to see if valid
			inputs.each(function(){
				$(this).on({
					keypress: function(){
						validateField($(this), settings);
					},
					blur: function(){
						validateField($(this), settings);
					},
					change: function(){
						validateField($(this), settings);
					}
				});
			});
			
			$(settings.submitClass).click(function(e){
				//Start with valid state
				validate = true;
				
				//Checks all inputs have passed checks
				inputs.each(function() {
					validateField($(this), settings);
					//If they have failed class, disable submit button
					if ($(this).hasClass(settings.failedClass)) {
						validate = false;
					}	
				});
				
				//if user has set ajaxPath
				//and all fields are valid
				//then ajax form
				if(settings.ajaxPath != '' && validate){
					//stops page from reloading
					e.preventDefault();
					//performs ajax request
					$.ajax({
						url: settings.ajaxPath,
						data: $(form).serialize(),
						type: 'POST',
						success: function(data) {
							$(form).replaceWith(data);
						}
					});
				//else reload page as normal					
				} else {
					//Form won't submit if validate is false
					return validate;	
				}
			});
			
		});
		
	}
	
	//----------------------------
	//Validate Fields
	//----------------------------
	
	function validateField(el, settings){
		var elType = 			el.prop('type'), 
			elText = 			el.val(),
			elPlaceholder = 	el.attr('placeholder');

		//If there is no text in input field
		//or the text is the same as the placeholder/
		//add class failedClass to field
		if(!elText || elText == elPlaceholder){
			failed(el, settings);
		} else {
			switch (elType){
				case 'number':
					if(!isNumber(elText)){
						failed(el, settings);	
					} else {
						passed(el, settings);
					}
					break;
				case 'email': 
					if(!isValidEmailAddress(elText)){
						failed(el, settings);	
					} else {
						passed(el, settings);
					}
					break;
				case 'tel':
					if(!isValidPhone(elText)){
						failed(el, settings);	
					} else {
						passed(el, settings);
					}
					break;
				case 'select-one':
					if(elText == el.find('option:first-child').val()){
						failed(el, settings);	
					} else {
						passed(el, settings);
					}
					break;
				default:
					passed(el, settings);
					break;
					
			}
		}
		
	}
	
	//----------------------------
	//Validate number
	//----------------------------
	function isNumber(num) {
            var pattern = new RegExp(/^\d+$/);
            return pattern.test(num);
	}
	
	//----------------------------
	//Validate email
	//----------------------------
	function isValidEmailAddress(emailAddress) {
            var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
            return pattern.test(emailAddress);
	}
	
	//----------------------------
	//Validate phone
	//----------------------------
	function isValidPhone(phone){
		var pattern = new RegExp(/^\+?[0-9]{3}-?[0-9]{5,12}/);
		
		return pattern.test(phone);
	}
	
	//----------------------------
	//Add Failed Class
	//----------------------------
	function failed(el, settings){
		return el.removeClass(settings.passedClass).addClass(settings.failedClass);
	}
	
	//----------------------------
	//Add Passed Class
	//----------------------------
	function passed(el, settings){
		return el.removeClass(settings.failedClass).addClass(settings.passedClass);
	}	
	
}(jQuery));