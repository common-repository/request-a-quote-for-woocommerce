(function($) {

	var wpi_xhr;

	$(document).ready(function(){
	
		// form submit
		$('#woo-product-inquiry').on('submit', function(e) {
			
			e.preventDefault();	// disable default action
			
			$('#wpi-submit').val('Sending...');
			
			// hide previous error
			$('.wpi-error').hide();
						
			// process form now
			name = $('#woo-product-inquiry [name=name]').val();
			email = $('#woo-product-inquiry [name=email]').val();
			phone = $('#woo-product-inquiry [name=phone]').val();
			
			// remove 'delete buttons from products'
			$('.wpi-results').find('.wpi-product-result').each(function(){
			
				$(this).find('a').remove();
			
			});
			
			products = $('.wpi-results').html();
			
			
			
			if( $.trim(name) != '' && $.trim(email) != '' && $.trim(phone) != '' ){
			
				if( $.trim(products) != '' ){
			
					// send data to email
					var data = {
						action: 'wpi_action_send',
						name: name,
						email: email,
						phone: phone,
						products: products
					};

					$.post(WPIAjax.ajaxurl,data,function(response) {
				
						if( response == 'SENT' ){
					
							// clear fields and show message
							$('#woo-product-inquiry [name=name]').val('');
							$('#woo-product-inquiry [name=email]').val('');
							$('#woo-product-inquiry [name=phone]').val('');
							$('#woo-product-inquiry [name=product_search]').val('');
							
							// clear search and products
							$('.wpi-results').html('');
							$('.wpi-select-holder').hide();
							
							$('.wpi-search-results').html('');
							
							$('.wpi-success').show();
							
							$('#wpi-submit').val('SEND');
					
						}else{
					
							// email failed
							$('.wpi-error').html('Email delivery failed! Please try again later').show();
							
							$('#wpi-submit').val('SEND');
					
						}
				
					});
					
				}else{
				
					// fields are missing
					$('.wpi-error').html('Please select at least one product').show();
					
					$('#wpi-submit').val('SEND');
				
				}
			
			}else{
			
				// fields are missing
				$('.wpi-error').html('Please fill out all required fields').show();
				
				$('#wpi-submit').val('SEND');
			
			}
			
			return false;
	  	});
	  	
	  	// search products
	  	$('[name=product_search]').on('keyup', function(e) {
			
			e.preventDefault();	// disable default action
			
			if( wpi_xhr && wpi_xhr.readyState != 4 ){
				wpi_xhr.abort();
			}
						
			// process form now
			q = $('#woo-product-inquiry [name=product_search]').val();
			
			if( $.trim(q) != '' && q.length >= 2 ){
			
				$('.wpi-search-results').html('Loading...');
			
				// send data to email
				var data = {
					action: 'wpi_action_search',
					q: q
				};

				wpi_xhr = $.post(WPIAjax.ajaxurl,data,function(response) {
				
					$('.wpi-search-results').html(response);
				
				});
			
			}else{
			
				// remove previous results
				$('.wpi-search-results').html('');
			
			}
			
			return false;
	  	});
	  	
	  	$('.wpi-search-results').on('click','.wpi-add-product',function(e){
	  		
	  		e.preventDefault();	// disable default action
	  		
	  		// clone current product
	  		html = $(this).closest('.wpi-product-result').clone();
	  		
	  		var product_id = html.attr('id');	// product id for current product
	  		var exists = false;
	  		
	  		$('.wpi-results .wpi-product-result').each(function(){
	  		
	  			if( $(this).attr('id') == product_id ){
	  				
	  				exists = true;
	  				
	  				// increment quantity
	  				quantity = parseInt($(this).find('.wpi-quantity').html()) + 1;
	  				
	  				$(this).find('.wpi-quantity').html(quantity);
	  				
	  			}else{
	  				console.log('New');
	  			}
	  		
	  		});
	  		
	  		if( exists == false ){
	  		
				//html.find('a').remove();	// remove add button
				html.find('a').removeClass('wpi-add-product').addClass('wpi-remove-product').css({ 'background': '#fff', 'color':'#dd3333', 'padding': '0', 'font-size' : '16px' }).html('x');
				html.find('.wpi-product-name').append('<div style="color: #9999; font-size: 13px; font-weight: normal;">Quantity: <span class="wpi-quantity">1</span></div>');
				html.wrap('<div>');			// wrap div to get outer HTML
										
				$('.wpi-results').append(html.parent().html());
			
				// show selected products
				$('.wpi-select-holder').show();
				
			}
			
			// update button
			/*
			$(this).html('Added').css({
				'background' : '#fff',
				'border': '1px solid #ee3124 !important',
				'color': '#ee3124'
			});
			*/
	  	
	  	});
	  	
	  	// remove product
	  	$('.wpi-results').on('click','.wpi-remove-product',function(e){
	  		
	  		e.preventDefault();	// disable default action
	  		
	  		// clone current product
	  		html = $(this).closest('.wpi-product-result');
	  		
	  		var product_id = html.attr('id');	// product id for current product
	  		
	  		quantity = parseInt(html.find('.wpi-quantity').html());
	  		
	  		if( quantity == 1 ){
	  		
	  			// remove product
	  			html.remove();
	  		
	  		}else{
	  		
	  			// decrement quantity
	  			quantity = quantity - 1;
	  			
	  			html.find('.wpi-quantity').html(quantity);
	  		
	  		}
	  		
	  		// hide selected products if all are gone
	  		if( $.trim($('.wpi-results').html()) == ''	){
	  			$('.wpi-select-holder').hide();
	  		}
	  	
	  	});
	  
	});
	
})( jQuery );