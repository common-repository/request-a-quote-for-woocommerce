<?php
/*
 * Plugin Name: Request a Quote for WooCommerce
 * Plugin URI: https://www.prodjex.com/wordpress-plugins/
 * Description: Request a Quote plugin for WooCommerce
 * Version: 1.0
 * Author: Prodjex
 * Author URI: https://www.prodjex.com
 * License: GPL12
 */

/**** ADD JAVASCRIPT ****/
add_action( 'wp_enqueue_scripts', 'woosearch_product_scripts' );


function woosearch_product_scripts(){

		wp_enqueue_script( 'custom-script', plugins_url( '/custom.js', __FILE__ ), array( 'jquery' ) );
	
		// localize ajax		
		wp_localize_script( 'custom-script', 'WPIAjax', array( 'ajaxurl' => admin_url( 'admin-ajax.php' ) ) );


}

/**** FORM SHORTCODE *****/
add_shortcode( 'woosearch_quote', 'woosearch_product_quote' );

function woosearch_product_quote(){

	$html = '<form method="post" action="" id="woo-product-inquiry">	
				
				<div style="margin-bottom: 20px;">
					<label style="display: block;">Name</label>
					<input type="text" name="name" value="" style="width: 100%;">
				</div>
				
				<div style="margin-bottom: 20px;">
					<label style="display: block;">Email</label>
					<input type="email" name="email" value="" style="width: 100%;">
				</div>
				
				<div style="margin-bottom: 20px;">
					<label style="display: block;">Phone</label>
					<input type="text" name="phone" value="" style="width: 100%;">
				</div>
				
				<div style="margin-bottom: 20px;">
					<label style="display: block;">Select Products</label>
					<input type="text" name="product_search" value="" placeholder="Type to search..." style="width: 100%;">
				</div>
				
				<div style="margin-bottom: 20px; max-height: 200px; overflow-y: scroll;" class="wpi-result-holder">
					<div class="wpi-search-results">
					</div>
				</div>
				
				<div style="margin-bottom: 20px; display: none; overflow: auto;" class="wpi-select-holder">
					<div style="color: #888; font-size: 12px; margin-bottom: 20px; border-top: 1px solid #e2e2e2; padding-top: 10px;">Selected Products</div>
					<div class="wpi-results">
					</div>
				</div>
				
				<div style="display: none; background: #dd3333; color: #fff; padding: 10px 20px; margin-bottom: 20px;" class="wpi-error">Please fill out all required fields</div>
				<div style="display: none; background: green; color: #fff; padding: 10px 20px; margin-bottom: 20px;" class="wpi-success">We have received your request and will get back to you soon.</div>
				
				<div>
					<input type="submit" value="SEND" id="wpi-submit">
				</div>
	
			</form>';

	return $html;

}

/**** SEND EMAIL *****/
add_action( 'wp_ajax_wpi_action_send', 'wpi_action_send' );
add_action( 'wp_ajax_nopriv_wpi_action_send', 'wpi_action_send' );

function wpi_action_send() {
	
	// get data
	$name = sanitize_text_field($_POST['name']);
	$email = sanitize_email($_POST['email']);
	$phone = sanitize_text_field($_POST['phone']);
	$products = sanitize_text_field($_POST['products']);
	
	if( $name != '' && $email != '' && $phone != '' && $products != '' ){
	
		$message = 'Name: '.$name.'<br/>Email: '.$email.'<br/>Phone: '.$phone.'<br/>Products: <br/></br>'.$products;
	
		$headers = array('Content-Type: text/html; charset=UTF-8');	// to send html in email

        $siteEmail = get_bloginfo('admin_email');
		// send email now
		$sent = wp_mail($siteEmail,'Quote Request',$message,$headers);
	
		// respond
		if( $sent == true )
			die("SENT");
		else
			die("FAILED");
			
	}else{
	
		die("FAILED");
	
	}
	
}

/**** SEARCH PRODUCTS *****/
add_action( 'wp_ajax_wpi_action_search', 'wpi_action_search' );
add_action( 'wp_ajax_nopriv_wpi_action_search', 'wpi_action_search' );

function wpi_action_search() {
	
	// get data
	$q = sanitize_text_field($_POST['q']);
	
	// run query and return results
	die( woosearch_product_search($q) );
	
}

function woosearch_product_search($q){
	
	$query = array(
		'post_status' => 'publish',
		'post_type' => 'product',
		'posts_per_page' => 10,
		's' => $q
	);

	$wpquery = new WP_Query($query);
	
	$output = '';
	foreach ($wpquery->posts as $post) {
		
		// get product info
		$product_name = $post->post_title;
		$product_id = $post->ID;
		$product_image = wp_get_attachment_image_src( get_post_thumbnail_id($product_id) )[0];
		
		if( $product_image == '' )
			$product_image = plugins_url( 'images/placeholder.jpg', __FILE__ );

		if(strpos($product_name,'Warranty') !== false){

        }else {
            $output .= '<div class="wpi-product-result" id="' . $product_id . '" style="overflow: auto; margin-bottom: 10px;"><img src="' . $product_image . '" style="float: left; width: 80px; margin-right: 10px;"><div class="wpi-product-name" style="font-weight: bold;">' . $product_name . '<a href="#" class="wpi-add-product" style="float: right; background: #ee3124; color: #fff; padding: 5px 10px; border: 0; text-decoration: none; box-shadow: 0 0 0 #ccc; cursor: pointer; font-size: 12px;">Add</a><div style="color: #9999; font-size: 13px; font-weight: normal;">ID: ' . $product_id . '</div></div></div>';
        }
				
	}
	
	return $output;
	
}


?>