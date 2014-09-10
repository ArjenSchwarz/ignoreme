/*-----------------------------------------------------------------------------------*/
/* GENERAL SCRIPTS */
/*-----------------------------------------------------------------------------------*/
jQuery(document).ready(function(){

	jQuery( '#wrapper' ).addClass( 'loaded' );

	// Table alt row styling
	jQuery( '.entry table tr:odd' ).addClass( 'alt-table-row' );

	// FitVids - Responsive Videos
	jQuery( '.post, .widget, .panel, .page, #featured-slider .slide-media' ).fitVids();

	// Add class to parent menu items with JS until WP does this natively
	jQuery( 'ul.sub-menu, ul.children' ).parents( 'li' ).addClass( 'parent' );
	
	// Single post next/prev navigation
	if(jQuery('#post-entries') != '')  {
		var post_prev_width  = jQuery('#post-entries .nav-prev a').width();
		var post_next_width  = jQuery('#post-entries .nav-next a').width();
		jQuery('#post-entries .nav-prev a').css('left', - (post_prev_width - 25) );
		jQuery('#post-entries .nav-next a').css('right', - (post_next_width - 25) );
	}

	// WooSlider post next/prev navigation
	if(jQuery('.wooslider-direction-nav') != '')  {
		var post_prev_width  = jQuery('.wooslider-direction-nav .wooslider-prev').width();
		var post_next_width  = jQuery('.wooslider-direction-nav .wooslider-next').width();
		jQuery('.wooslider-direction-nav .wooslider-prev').css('left', - (post_prev_width - 25) );
		jQuery('.wooslider-direction-nav .wooslider-next').css('right', - (post_next_width - 25) );
	}
	
	// Center drop down menus
    jQuery('body.page .nav > li > ul, body.single-post .nav > li > ul, body.single-product .nav > li > ul').each(function(){
    	var li_width = jQuery(this).parent('li').width();
    	li_width = ((li_width - 170) / 2) - 5;
    	jQuery(this).css('margin-left', li_width);
    });
    
    // Sidebar nav - Keep dropdowns open
	jQuery( 'body:not(.page, .single-post, .single-product) #header .nav .parent' ).mouseover(function(){
	
		jQuery( this ).addClass( 'keep-open' );
	
	});
	
	jQuery( 'body:not(.page, .single-post, .single-product) #header' ).mouseleave(function(){
		
		jQuery( this ).removeClass( 'keep-open' );
		
	});


	/**
	 * Navigation
	 */
	// Add the 'show-nav' class to the body when the nav toggle is clicked
	jQuery( '.nav-toggle' ).click(function(e) {

		// Prevent default behaviour
		e.preventDefault();

		// Add the 'show-nav' class
		jQuery( 'body' ).toggleClass( 'show-nav' );

		// Check if .top-navigation already exists
		if ( jQuery( '#navigation' ).find( '.top-navigation' ).size() ) return;

		// If it doesn't, clone it (so it will still appear when resizing the browser window in desktop orientation) and add it.
		jQuery( '#top .top-navigation' ).clone().appendTo( '#navigation .menus' );
	});

	// Remove the 'show-nav' class from the body when the nav-close anchor is clicked
	jQuery('.nav-close').click(function(e) {

		// Prevent default behaviour
		e.preventDefault();

		// Remove the 'show-nav' class
		jQuery( 'body' ).removeClass( 'show-nav' );
	});

	// Remove the 'show-nav' class from the body when the use clicks (taps) outside #navigation
	var hasParent = function(el, id) {
        if (el) {
            do {
                if (el.id === id) {
                    return true;
                }
                if (el.nodeType === 9) {
                    break;
                }
            }
            while((el = el.parentNode));
        }
        return false;
    };
    
    if ( document.addEventListener ) {
		document.addEventListener('touchstart', function(e) {
	        if ( jQuery( 'body' ).hasClass( 'show-nav' ) && !hasParent( e.target, 'navigation' ) ) {

	        	// Prevent default behaviour
	            e.preventDefault();

	            // Remove the 'show-nav' class
	            jQuery( 'body' ).removeClass( 'show-nav' );
	        }
	    },
	    true);
	}

	/**
	 * Homepage Tabber
	 */
	// Add the 'show-nav' class to the body when the nav toggle is clicked
	jQuery( '.home-tabber li a' ).click(function(e) {

		// Prevent default behaviour
		e.preventDefault();

		jQuery( '.home-tabber li' ).removeClass( 'active' );

		jQuery( this ).parent().addClass( 'active' );

		var currentTab = jQuery(this).attr('href');

		jQuery( '#home-tabs div' ).hide();

		jQuery( currentTab ).fadeIn( 600, function() {
			jQuery( currentTab ).show();
		});

		return false;

	});

});