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

    jQuery("#projects h3").click(function(){
        jQuery(this).closest(".projectdetails").find(".articles-list").toggle();
    });

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

		jQuery( currentTab ).fadeIn( 150, function() {
			jQuery( currentTab ).show();
		});

		return false;

	});

});
/* Bigfoot */
(function(){!function(a){return a.bigfoot=function(b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C;return e=void 0,k={actionOriginalFN:"hide",activateCallback:function(){},activateOnHover:!1,allowMultipleFN:!1,anchorPattern:/(fn|footnote|note)[:\-_\d]/gi,anchorParentTagname:"sup",breakpoints:{},deleteOnUnhover:!1,footnoteParentClass:"footnote",footnoteTagname:"li",hoverDelay:250,numberResetSelector:void 0,popoverDeleteDelay:300,popoverCreateDelay:100,positionContent:!0,preventPageScroll:!0,scope:!1,useFootnoteOnlyOnce:!0,contentMarkup:'<aside class="bigfoot-footnote is-positioned-bottom" data-footnote-number="{{FOOTNOTENUM}}" data-footnote-identifier="{{FOOTNOTEID}}" alt="Footnote {{FOOTNOTENUM}}"> <div class="bigfoot-footnote__wrapper"> <div class="bigfoot-footnote__content"> {{FOOTNOTECONTENT}} </div></div> <div class="bigfoot-footnote__tooltip"></div> </aside>',buttonMarkup:'<div class=\'bigfoot-footnote__container\'> <button class="bigfoot-footnote__button" id="{{SUP:data-footnote-backlink-ref}}" data-footnote-number="{{FOOTNOTENUM}}" data-footnote-identifier="{{FOOTNOTEID}}" alt="See Footnote {{FOOTNOTENUM}}" rel="footnote" data-bigfoot-footnote="{{FOOTNOTECONTENT}}"> <svg class="bigfoot-footnote__button__circle" viewbox="0 0 6 6" preserveAspectRatio="xMinYMin"><circle r="3" cx="3" cy="3" fill="white"></circle></svg> <svg class="bigfoot-footnote__button__circle" viewbox="0 0 6 6" preserveAspectRatio="xMinYMin"><circle r="3" cx="3" cy="3" fill="white"></circle></svg> <svg class="bigfoot-footnote__button__circle" viewbox="0 0 6 6" preserveAspectRatio="xMinYMin"><circle r="3" cx="3" cy="3" fill="white"></circle></svg> </button></div>'},y=a.extend(k,b),q={},n=function(){var b,c,d,e,f,g,i,j,k,m,n,o,p,q,r,t,u,w,x,z;for(n=y.scope?""+y.scope+' a[href*="#"]':'a[href*="#"]',d=a(n).filter(function(){var b,c;return b=a(this),c=b.attr("rel"),("null"===c||null==c)&&(c=""),(""+b.attr("href")+c).match(y.anchorPattern)&&b.closest("[class*="+y.footnoteParentClass+"]:not(a):not("+y.anchorParentTagname+")").length<1}),t=[],q=[],k=[],h(d,q),a(q).each(function(){var b,c;return c=a(this).data("footnote-ref").replace(/[:.+~*\]\[]/g,"\\$&"),y.useFootnoteOnlyOnce&&(c=""+c+":not(.footnote-processed)"),b=a(c).closest(y.footnoteTagname),b.length>0?(t.push(b.first().addClass("footnote-processed")),k.push(this)):void 0}),c=a("[data-footnote-identifier]:last"),p=c.length<1?0:+c.data("footnote-identifier"),z=[],u=w=0,x=t.length;x>=0?x>w:w>x;u=x>=0?++w:--w)switch(o=s(a(t[u]).html().trim(),a(k[u]).data("footnote-backlink-ref")),o=o.replace(/"/g,"&quot;").replace(/&lt;/g,"&ltsym;").replace(/&gt;/g,"&gtsym;"),p+=1,m="",i=a(k[u]),j=a(t[u]),null!=y.numberResetSelector?(b=i.closest(y.numberResetSelector),b.is(f)?r+=1:r=1,f=b):r=p,0!==o.indexOf("<")&&(o="<p>"+o+"</p>"),m=y.buttonMarkup.replace(/\{\{FOOTNOTENUM\}\}/g,r).replace(/\{\{FOOTNOTEID\}\}/g,p).replace(/\{\{FOOTNOTECONTENT\}\}/g,o),m=v(m,"SUP",i),m=v(m,"FN",j),e=a(m).insertBefore(i),g=j.parent(),y.actionOriginalFN.toLowerCase()){case"hide":i.addClass("footnote-print-only"),j.addClass("footnote-print-only"),z.push(l(g));break;case"delete":i.remove(),j.remove(),z.push(l(g));break;default:z.push(i.addClass("footnote-print-only"))}return z},h=function(b,c){var d,e,f,g;null==c&&(c=[]),d=void 0,e=void 0,f=void 0,g=void 0,b.each(function(){var b,e;return e=a(this),f="#"+e.attr("href").split("#")[1],d=e.closest(y.anchorParentTagname),b=e.find(y.anchorParentTagname),d.length>0?(g=(d.attr("id")||"")+(e.attr("id")||""),c.push(d.attr({"data-footnote-backlink-ref":g,"data-footnote-ref":f}))):b.length>0?(g=(b.attr("id")||"")+(e.attr("id")||""),c.push(e.attr({"data-footnote-backlink-ref":g,"data-footnote-ref":f}))):(g=e.attr("id")||"",c.push(e.attr({"data-footnote-backlink-ref":g,"data-footnote-ref":f})))})},l=function(a){var b;return b=void 0,a.is(":empty")||0===a.children(":not(.footnote-print-only)").length?(b=a.parent(),"delete"===y.actionOriginalFN.toLowerCase()?a.remove():a.addClass("footnote-print-only"),l(b)):a.children(":not(.footnote-print-only)").length===a.children("hr:not(.footnote-print-only)").length?(b=a.parent(),"delete"===y.actionOriginalFN.toLowerCase()?a.remove():(a.children("hr").addClass("footnote-print-only"),a.addClass("footnote-print-only")),l(b)):void 0},s=function(a,b){var c;return b.indexOf(" ")>=0&&(b=b.trim().replace(/\s+/g,"|").replace(/(.*)/g,"($1)")),c=new RegExp("(\\s|&nbsp;)*<\\s*a[^#<]*#"+b+"[^>]*>(.*?)<\\s*/\\s*a>","g"),a.replace(c,"").replace("[]","")},v=function(a,b,c){var d,e,f,g;for(e=new RegExp("\\{\\{"+b+":([^\\}]*)\\}\\}","g"),d=void 0,g=void 0,f=void 0,d=e.exec(a);d;)d[1]&&(g=c.attr(d[1])||"",a=a.replace("{{"+b+":"+d[1]+"}}",g)),d=e.exec(a);return a},f=function(b){var c,d,e;if(y.activateOnHover){if(c=a(b.target).closest(".bigfoot-footnote__button"),d='[data-footnote-identifier="'+c.attr("data-footnote-identifier")+'"]',c.hasClass("is-active"))return;c.addClass("is-hover-instantiated"),y.allowMultipleFN||(e=".bigfoot-footnote:not("+d+")",u(e)),j(".bigfoot-footnote__button"+d).addClass("is-hover-instantiated")}},z=function(b){var c,d,e;e=a(b.target),c=e.closest(".bigfoot-footnote__button"),d=e.closest(".bigfoot-footnote"),c.length>0?(b.preventDefault(),i(c)):d.length<1&&a(".bigfoot-footnote").length>0&&u()},i=function(a){var b;a.blur(),b='data-footnote-identifier="'+a.attr("data-footnote-identifier")+'"',a.hasClass("changing")||(a.hasClass("is-active")?y.allowMultipleFN?u(".bigfoot-footnote["+b+"]"):u():(a.addClass("changing"),setTimeout(function(){return a.removeClass("changing")},y.popoverCreateDelay),j(".bigfoot-footnote__button["+b+"]"),a.addClass("is-click-instantiated"),y.allowMultipleFN||u(".bigfoot-footnote:not(["+b+"])")))},j=function(b){var c,d;return c=void 0,c="string"!=typeof b&&y.allowMultipleFN?b:"string"!=typeof b?b.first():y.allowMultipleFN?a(b).closest(".bigfoot-footnote__button"):a(b+":first").closest(".bigfoot-footnote__button"),d=a(),c.each(function(){var b,e,f,h;f=a(this),h=void 0;try{return h=y.contentMarkup.replace(/\{\{FOOTNOTENUM\}\}/g,f.attr("data-footnote-number")).replace(/\{\{FOOTNOTEID\}\}/g,f.attr("data-footnote-identifier")).replace(/\{\{FOOTNOTECONTENT\}\}/g,f.attr("data-bigfoot-footnote")).replace(/\&gtsym\;/g,"&gt;").replace(/\&ltsym\;/g,"&lt;"),h=v(h,"BUTTON",f)}finally{b=a(h);try{y.activateCallback(b,f)}catch(i){}b.insertAfter(c),q[f.attr("data-footnote-identifier")]="init",b.attr("bigfoot-max-width",g(b.css("max-width"),b)),b.css("max-width",1e4),e=b.find(".bigfoot-footnote__content"),b.attr("data-bigfoot-max-height",g(e.css("max-height"),e)),w(),f.addClass("is-active"),b.find(".bigfoot-footnote__content").bindScrollHandler(),d=d.add(b)}}),setTimeout(function(){return d.addClass("is-active")},y.popoverCreateDelay),d},d=function(){var a,b;return a=document.createElement("div"),a.style.cssText="display:inline-block;padding:0;line-height:1;position:absolute;visibility:hidden;font-size:1em;",a.appendChild(document.createElement("M")),document.body.appendChild(a),b=a.offsetHeight,document.body.removeChild(a),b},g=function(a,b){return"none"===a?a=1e4:a.indexOf("rem")>=0?a=parseFloat(a)*d():a.indexOf("em")>=0?a=parseFloat(a)*parseFloat(b.css("font-size")):a.indexOf("px")>=0?(a=parseFloat(a),60>=a&&(a/=parseFloat(b.parent().css("width")))):a.indexOf("%")>=0&&(a=parseFloat(a)/100),a},a.fn.bindScrollHandler=function(){return y.preventPageScroll?(a(this).on("DOMMouseScroll mousewheel",function(b){var c,d,e,f,g,h,i,j;return d=a(this),i=d.scrollTop(),h=d[0].scrollHeight,f=parseInt(d.css("height")),c=d.closest(".bigfoot-footnote"),d.scrollTop()>0&&d.scrollTop()<10&&c.addClass("is-scrollable"),c.hasClass("is-scrollable")?(e="DOMMouseScroll"===b.type?-40*b.originalEvent.detail:b.originalEvent.wheelDelta,j=e>0,g=function(){return b.stopPropagation(),b.preventDefault(),b.returnValue=!1,!1},!j&&-e>h-f-i?(d.scrollTop(h),c.addClass("is-fully-scrolled"),g()):j&&e>i?(d.scrollTop(0),c.removeClass("is-fully-scrolled"),g()):c.removeClass("is-fully-scrolled")):void 0}),a(this)):a(this)},A=function(b){return y.deleteOnUnhover&&y.activateOnHover?setTimeout(function(){var c;return c=a(b.target).closest(".bigfoot-footnote, .bigfoot-footnote__button"),a(".bigfoot-footnote__button:hover, .bigfoot-footnote:hover").length<1?u():void 0},y.hoverDelay):void 0},m=function(a){return 27===a.keyCode?u():void 0},u=function(b,c){var d,e,f,g;return null==b&&(b=".bigfoot-footnote"),null==c&&(c=y.popoverDeleteDelay),d=a(),g=void 0,e=void 0,f=void 0,a(b).each(function(){return f=a(this),g=f.attr("data-footnote-identifier"),e=a('.bigfoot-footnote__button[data-footnote-identifier="'+g+'"]'),e.hasClass("changing")?void 0:(d=d.add(e),e.removeClass("is-active is-hover-instantiated is-click-instantiated").addClass("changing"),f.removeClass("is-active").addClass("disapearing"),setTimeout(function(){return f.remove(),delete q[g],e.removeClass("changing")},c))}),d},w=function(b){var c;y.positionContent&&(c=b?b.type:"resize",a(".bigfoot-footnote").each(function(){var b,d,e,f,g,h,i,j,k,l,m,n,o,p,s,t;return f=a(this),h=f.attr("data-footnote-identifier"),g='data-footnote-identifier="'+h+'"',d=f.find(".bigfoot-footnote__content"),b=f.siblings(".bigfoot-footnote__button"),s=x(b),j=parseFloat(f.css("margin-top")),k=+f.attr("data-bigfoot-max-height"),t=2*j+f.outerHeight(),l=1e4,o=s.bottomRoom<t&&s.topRoom>s.bottomRoom,i=q[h],o?("top"!==i&&(q[h]="top",f.addClass("is-positioned-top").removeClass("is-positioned-bottom"),f.css("transform-origin",100*s.leftRelative+"% 100%")),l=s.topRoom-j-15):(("bottom"!==i||"init"===i)&&(q[h]="bottom",f.removeClass("is-positioned-top").addClass("is-positioned-bottom"),f.css("transform-origin",100*s.leftRelative+"% 0%")),l=s.bottomRoom-j-15),f.find(".bigfoot-footnote__content").css({"max-height":Math.min(l,k)+"px"}),"resize"===c&&(n=parseFloat(f.attr("bigfoot-max-width")),e=f.find(".bigfoot-footnote__wrapper"),m=n,1>=n&&(p=function(){var b,c;return c=1e4,y.maxWidthRelativeTo&&(b=a(y.maxWidthRelativeTo),b.length>0&&(c=b.outerWidth())),Math.min(window.innerWidth,c)}(),m=p*n),m=Math.min(m,f.find(".bigfoot-footnote__content").outerWidth()+1),e.css("max-width",m+"px"),f.css({left:-s.leftRelative*m+parseFloat(b.css("margin-left"))+b.outerWidth()/2+"px"}),r(f,s.leftRelative)),parseInt(f.outerHeight())<f.find(".bigfoot-footnote__content")[0].scrollHeight?f.addClass("is-scrollable"):void 0}))},r=function(a,b){var c;null==b&&(b=.5),c=a.find(".bigfoot-footnote__tooltip"),c.length>0&&c.css("left",""+100*b+"%")},x=function(a){var b,c,d,e,f,g;return c=parseFloat(a.css("margin-left")),d=parseFloat(a.outerWidth())-c,b=parseFloat(a.outerHeight()),g=C(),f=a.offset().top-g.scrollY+b/2,e=a.offset().left-g.scrollX+d/2,{topRoom:f,bottomRoom:g.height-f,leftRoom:e,rightRoom:g.width-e,leftRelative:e/g.width,topRelative:f/g.height}},C=function(){return{width:window.innerWidth,height:window.innerHeight,scrollX:window.scrollX,scrollY:window.scrollY}},c=function(a,b,c,d,f){var g,h,i,j,k,l,m;return null==d&&(d=y.popoverDeleteDelay),null==f&&(f=!0),j=void 0,h=void 0,l=void 0,"string"==typeof a?(l="iphone"===a.toLowerCase()?"<320px":"ipad"===a.toLowerCase()?"<768px":a,h=">"===l.charAt(0)?"min":"<"===l.charAt(0)?"max":null,k=h?"("+h+"-width: "+l.substring(1)+")":l,j=window.matchMedia(k)):j=a,j.media&&"invalid"===j.media?{added:!1,mq:j,listener:null}:(m="min"===h,g="max"===h,b=b||p(f,d,m,function(a){return a.addClass("is-bottom-fixed")}),c=c||p(f,d,g,function(){}),i=function(a){a.matches?b(f,e):c(f,e)},j.addListener(i),i(j),y.breakpoints[a]={added:!0,mq:j,listener:i},y.breakpoints[a])},p=function(a,b,c,d){return function(a,e){var f;return f=void 0,a&&(f=e.close(),e.updateSetting("activateCallback",d)),setTimeout(function(){return e.updateSetting("positionContent",c),a?e.activate(f):void 0},b)}},t=function(a,b){var c,d,e,f;if(e=null,c=void 0,f=!1,"string"==typeof a)f=void 0!==y.breakpoints[a];else for(c in y.breakpoints)y.breakpoints.hasOwnProperty(c)&&y.breakpoints[c].mq===a&&(f=!0);return f&&(d=y.breakpoints[c||a],b?b({matches:!1}):d.listener({matches:!1}),d.mq.removeListener(d.listener),delete y.breakpoints[c||a]),f},B=function(a,b){var c,d;if(c=void 0,"string"==typeof a)c=y[a],y[a]=b;else{c={};for(d in a)a.hasOwnProperty(d)&&(c[d]=y[d],y[d]=a[d])}return c},o=function(a){return y[a]},a(document).ready(function(){return n(),a(document).on("mouseenter",".bigfoot-footnote__button",f),a(document).on("touchend click",z),a(document).on("mouseout",".is-hover-instantiated",A),a(document).on("keyup",m),a(window).on("scroll resize",w),a(document).on("gestureend",function(){return w()})}),e={removePopovers:u,close:u,createPopover:j,activate:j,repositionFeet:w,reposition:w,addBreakpoint:c,removeBreakpoint:t,getSetting:o,updateSetting:B}}}(jQuery)}).call(this);
/* End Bigfoot */
