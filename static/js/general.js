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

/* http://prismjs.com/download.html?themes=prism-okaidia&languages=markup+twig+css+css-extras+clike+javascript+php+php-extras+bash+c+sql+http+ruby+go+swift+objectivec+ini&plugins=line-numbers */
self="undefined"!=typeof window?window:"undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope?self:{};var Prism=function(){var e=/\blang(?:uage)?-(?!\*)(\w+)\b/i,t=self.Prism={util:{encode:function(e){return e instanceof n?new n(e.type,t.util.encode(e.content)):"Array"===t.util.type(e)?e.map(t.util.encode):e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(e){return Object.prototype.toString.call(e).match(/\[object (\w+)\]/)[1]},clone:function(e){var n=t.util.type(e);switch(n){case"Object":var r={};for(var a in e)e.hasOwnProperty(a)&&(r[a]=t.util.clone(e[a]));return r;case"Array":return e.slice()}return e}},languages:{extend:function(e,n){var r=t.util.clone(t.languages[e]);for(var a in n)r[a]=n[a];return r},insertBefore:function(e,n,r,a){a=a||t.languages;var i=a[e],o={};for(var l in i)if(i.hasOwnProperty(l)){if(l==n)for(var s in r)r.hasOwnProperty(s)&&(o[s]=r[s]);o[l]=i[l]}return a[e]=o},DFS:function(e,n){for(var r in e)n.call(e,r,e[r]),"Object"===t.util.type(e)&&t.languages.DFS(e[r],n)}},highlightAll:function(e,n){for(var r,a=document.querySelectorAll('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'),i=0;r=a[i++];)t.highlightElement(r,e===!0,n)},highlightElement:function(r,a,i){for(var o,l,s=r;s&&!e.test(s.className);)s=s.parentNode;if(s&&(o=(s.className.match(e)||[,""])[1],l=t.languages[o]),l){r.className=r.className.replace(e,"").replace(/\s+/g," ")+" language-"+o,s=r.parentNode,/pre/i.test(s.nodeName)&&(s.className=s.className.replace(e,"").replace(/\s+/g," ")+" language-"+o);var c=r.textContent;if(c){var g={element:r,language:o,grammar:l,code:c};if(t.hooks.run("before-highlight",g),a&&self.Worker){var u=new Worker(t.filename);u.onmessage=function(e){g.highlightedCode=n.stringify(JSON.parse(e.data),o),t.hooks.run("before-insert",g),g.element.innerHTML=g.highlightedCode,i&&i.call(g.element),t.hooks.run("after-highlight",g)},u.postMessage(JSON.stringify({language:g.language,code:g.code}))}else g.highlightedCode=t.highlight(g.code,g.grammar,g.language),t.hooks.run("before-insert",g),g.element.innerHTML=g.highlightedCode,i&&i.call(r),t.hooks.run("after-highlight",g)}}},highlight:function(e,r,a){var i=t.tokenize(e,r);return n.stringify(t.util.encode(i),a)},tokenize:function(e,n){var r=t.Token,a=[e],i=n.rest;if(i){for(var o in i)n[o]=i[o];delete n.rest}e:for(var o in n)if(n.hasOwnProperty(o)&&n[o]){var l=n[o];l="Array"===t.util.type(l)?l:[l];for(var s=0;s<l.length;++s){var c=l[s],g=c.inside,u=!!c.lookbehind,f=0;c=c.pattern||c;for(var h=0;h<a.length;h++){var d=a[h];if(a.length>e.length)break e;if(!(d instanceof r)){c.lastIndex=0;var p=c.exec(d);if(p){u&&(f=p[1].length);var m=p.index-1+f,p=p[0].slice(f),v=p.length,y=m+v,k=d.slice(0,m+1),b=d.slice(y+1),w=[h,1];k&&w.push(k);var N=new r(o,g?t.tokenize(p,g):p);w.push(N),b&&w.push(b),Array.prototype.splice.apply(a,w)}}}}}return a},hooks:{all:{},add:function(e,n){var r=t.hooks.all;r[e]=r[e]||[],r[e].push(n)},run:function(e,n){var r=t.hooks.all[e];if(r&&r.length)for(var a,i=0;a=r[i++];)a(n)}}},n=t.Token=function(e,t){this.type=e,this.content=t};if(n.stringify=function(e,r,a){if("string"==typeof e)return e;if("[object Array]"==Object.prototype.toString.call(e))return e.map(function(t){return n.stringify(t,r,e)}).join("");var i={type:e.type,content:n.stringify(e.content,r,a),tag:"span",classes:["token",e.type],attributes:{},language:r,parent:a};"comment"==i.type&&(i.attributes.spellcheck="true"),t.hooks.run("wrap",i);var o="";for(var l in i.attributes)o+=l+'="'+(i.attributes[l]||"")+'"';return"<"+i.tag+' class="'+i.classes.join(" ")+'" '+o+">"+i.content+"</"+i.tag+">"},!self.document)return self.addEventListener?(self.addEventListener("message",function(e){var n=JSON.parse(e.data),r=n.language,a=n.code;self.postMessage(JSON.stringify(t.tokenize(a,t.languages[r]))),self.close()},!1),self.Prism):self.Prism;var r=document.getElementsByTagName("script");return r=r[r.length-1],r&&(t.filename=r.src,document.addEventListener&&!r.hasAttribute("data-manual")&&document.addEventListener("DOMContentLoaded",t.highlightAll)),self.Prism}();"undefined"!=typeof module&&module.exports&&(module.exports=Prism);;
Prism.languages.markup={comment:/<!--[\w\W]*?-->/g,prolog:/<\?.+?\?>/,doctype:/<!DOCTYPE.+?>/,cdata:/<!\[CDATA\[[\w\W]*?]]>/i,tag:{pattern:/<\/?[\w:-]+\s*(?:\s+[\w:-]+(?:=(?:("|')(\\?[\w\W])*?\1|[^\s'">=]+))?\s*)*\/?>/gi,inside:{tag:{pattern:/^<\/?[\w:-]+/i,inside:{punctuation:/^<\/?/,namespace:/^[\w-]+?:/}},"attr-value":{pattern:/=(?:('|")[\w\W]*?(\1)|[^\s>]+)/gi,inside:{punctuation:/=|>|"/g}},punctuation:/\/?>/g,"attr-name":{pattern:/[\w:-]+/g,inside:{namespace:/^[\w-]+?:/}}}},entity:/\&#?[\da-z]{1,8};/gi},Prism.hooks.add("wrap",function(t){"entity"===t.type&&(t.attributes.title=t.content.replace(/&amp;/,"&"))});;
Prism.languages.twig={comment:/\{\#[\s\S]*?\#\}/g,tag:{pattern:/(\{\{[\s\S]*?\}\}|\{\%[\s\S]*?\%\})/g,inside:{ld:{pattern:/^(\{\{\-?|\{\%\-?\s*\w+)/,inside:{punctuation:/^(\{\{|\{\%)\-?/,keyword:/\w+/}},rd:{pattern:/\-?(\%\}|\}\})$/,inside:{punctuation:/.*/}},string:{pattern:/("|')(\\?.)*?\1/g,inside:{punctuation:/^('|")|('|")$/g}},keyword:/\b(if)\b/g,"boolean":/\b(true|false|null)\b/g,number:/\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/g,operator:/==|=|\!=|<|>|>=|<=|\+|\-|~|\*|\/|\/\/|%|\*\*|\|/g,"space-operator":{pattern:/(\s)(\b(not|b\-and|b\-xor|b\-or|and|or|in|matches|starts with|ends with|is)\b|\?|:|\?\:)(?=\s)/g,lookbehind:!0,inside:{operator:/.*/}},property:/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g,punctuation:/\(|\)|\[\]|\[|\]|\{|\}|\:|\.|,/g}},other:{pattern:/[\s\S]*/,inside:Prism.languages.markup}};;
Prism.languages.css={comment:/\/\*[\w\W]*?\*\//g,atrule:{pattern:/@[\w-]+?.*?(;|(?=\s*{))/gi,inside:{punctuation:/[;:]/g}},url:/url\((["']?).*?\1\)/gi,selector:/[^\{\}\s][^\{\};]*(?=\s*\{)/g,property:/(\b|\B)[\w-]+(?=\s*:)/gi,string:/("|')(\\?.)*?\1/g,important:/\B!important\b/gi,punctuation:/[\{\};:]/g,"function":/[-a-z0-9]+(?=\()/gi},Prism.languages.markup&&Prism.languages.insertBefore("markup","tag",{style:{pattern:/<style[\w\W]*?>[\w\W]*?<\/style>/gi,inside:{tag:{pattern:/<style[\w\W]*?>|<\/style>/gi,inside:Prism.languages.markup.tag.inside},rest:Prism.languages.css}}});;
Prism.languages.css.selector={pattern:/[^\{\}\s][^\{\}]*(?=\s*\{)/g,inside:{"pseudo-element":/:(?:after|before|first-letter|first-line|selection)|::[-\w]+/g,"pseudo-class":/:[-\w]+(?:\(.*\))?/g,"class":/\.[-:\.\w]+/g,id:/#[-:\.\w]+/g}},Prism.languages.insertBefore("css","ignore",{hexcode:/#[\da-f]{3,6}/gi,entity:/\\[\da-f]{1,8}/gi,number:/[\d%\.]+/g});;
Prism.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\w\W]*?\*\//g,lookbehind:!0},{pattern:/(^|[^\\:])\/\/.*?(\r?\n|$)/g,lookbehind:!0}],string:/("|')(\\?.)*?\1/g,"class-name":{pattern:/((?:(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/gi,lookbehind:!0,inside:{punctuation:/(\.|\\)/}},keyword:/\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/g,"boolean":/\b(true|false)\b/g,"function":{pattern:/[a-z0-9_]+\(/gi,inside:{punctuation:/\(/}},number:/\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/g,operator:/[-+]{1,2}|!|<=?|>=?|={1,3}|&{1,2}|\|?\||\?|\*|\/|\~|\^|\%/g,ignore:/&(lt|gt|amp);/gi,punctuation:/[{}[\];(),.:]/g};;
Prism.languages.javascript=Prism.languages.extend("clike",{keyword:/\b(break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|function|get|if|implements|import|in|instanceof|interface|let|new|null|package|private|protected|public|return|set|static|super|switch|this|throw|true|try|typeof|var|void|while|with|yield)\b/g,number:/\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?|NaN|-?Infinity)\b/g}),Prism.languages.insertBefore("javascript","keyword",{regex:{pattern:/(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\r\n])+\/[gim]{0,3}(?=\s*($|[\r\n,.;})]))/g,lookbehind:!0}}),Prism.languages.markup&&Prism.languages.insertBefore("markup","tag",{script:{pattern:/<script[\w\W]*?>[\w\W]*?<\/script>/gi,inside:{tag:{pattern:/<script[\w\W]*?>|<\/script>/gi,inside:Prism.languages.markup.tag.inside},rest:Prism.languages.javascript}}});;
Prism.languages.php=Prism.languages.extend("clike",{keyword:/\b(and|or|xor|array|as|break|case|cfunction|class|const|continue|declare|default|die|do|else|elseif|enddeclare|endfor|endforeach|endif|endswitch|endwhile|extends|for|foreach|function|include|include_once|global|if|new|return|static|switch|use|require|require_once|var|while|abstract|interface|public|implements|private|protected|parent|throw|null|echo|print|trait|namespace|final|yield|goto|instanceof|finally|try|catch)\b/gi,constant:/\b[A-Z0-9_]{2,}\b/g,comment:{pattern:/(^|[^\\])(\/\*[\w\W]*?\*\/|(^|[^:])(\/\/|#).*?(\r?\n|$))/g,lookbehind:!0}}),Prism.languages.insertBefore("php","keyword",{delimiter:/(\?>|<\?php|<\?)/gi,variable:/(\$\w+)\b/gi,"package":{pattern:/(\\|namespace\s+|use\s+)[\w\\]+/g,lookbehind:!0,inside:{punctuation:/\\/}}}),Prism.languages.insertBefore("php","operator",{property:{pattern:/(->)[\w]+/g,lookbehind:!0}}),Prism.languages.markup&&(Prism.hooks.add("before-highlight",function(e){"php"===e.language&&(e.tokenStack=[],e.code=e.code.replace(/(?:<\?php|<\?)[\w\W]*?(?:\?>)/gi,function(n){return e.tokenStack.push(n),"{{{PHP"+e.tokenStack.length+"}}}"}))}),Prism.hooks.add("after-highlight",function(e){if("php"===e.language){for(var n,a=0;n=e.tokenStack[a];a++)e.highlightedCode=e.highlightedCode.replace("{{{PHP"+(a+1)+"}}}",Prism.highlight(n,e.grammar,"php"));e.element.innerHTML=e.highlightedCode}}),Prism.hooks.add("wrap",function(e){"php"===e.language&&"markup"===e.type&&(e.content=e.content.replace(/(\{\{\{PHP[0-9]+\}\}\})/g,'<span class="token php">$1</span>'))}),Prism.languages.insertBefore("php","comment",{markup:{pattern:/<[^?]\/?(.*?)>/g,inside:Prism.languages.markup},php:/\{\{\{PHP[0-9]+\}\}\}/g}));;
Prism.languages.insertBefore("php","variable",{"this":/\$this/g,global:/\$_?(GLOBALS|SERVER|GET|POST|FILES|REQUEST|SESSION|ENV|COOKIE|HTTP_RAW_POST_DATA|argc|argv|php_errormsg|http_response_header)/g,scope:{pattern:/\b[\w\\]+::/g,inside:{keyword:/(static|self|parent)/,punctuation:/(::|\\)/}}});;
Prism.languages.bash=Prism.languages.extend("clike",{comment:{pattern:/(^|[^"{\\])(#.*?(\r?\n|$))/g,lookbehind:!0},string:{pattern:/("|')(\\?[\s\S])*?\1/g,inside:{property:/\$([a-zA-Z0-9_#\?\-\*!@]+|\{[^\}]+\})/g}},keyword:/\b(if|then|else|elif|fi|for|break|continue|while|in|case|function|select|do|done|until|echo|exit|return|set|declare)\b/g}),Prism.languages.insertBefore("bash","keyword",{property:/\$([a-zA-Z0-9_#\?\-\*!@]+|\{[^}]+\})/g}),Prism.languages.insertBefore("bash","comment",{important:/(^#!\s*\/bin\/bash)|(^#!\s*\/bin\/sh)/g});;
Prism.languages.c=Prism.languages.extend("clike",{string:/("|')([^\n\\\1]|\\.|\\\r*\n)*?\1/g,keyword:/\b(asm|typeof|inline|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while)\b/g,operator:/[-+]{1,2}|!=?|<{1,2}=?|>{1,2}=?|\->|={1,2}|\^|~|%|&{1,2}|\|?\||\?|\*|\//g}),Prism.languages.insertBefore("c","string",{property:{pattern:/((^|\n)\s*)#\s*[a-z]+([^\n\\]|\\.|\\\r*\n)*/gi,lookbehind:!0,inside:{string:{pattern:/(#\s*include\s*)(<.+?>|("|')(\\?.)+?\3)/g,lookbehind:!0}}}}),delete Prism.languages.c["class-name"],delete Prism.languages.c["boolean"];;
Prism.languages.sql={comment:{pattern:/(^|[^\\])(\/\*[\w\W]*?\*\/|((--)|(\/\/)|#).*?(\r?\n|$))/g,lookbehind:!0},string:/("|')(\\?[\s\S])*?\1/g,keyword:/\b(ACTION|ADD|AFTER|ALGORITHM|ALTER|ANALYZE|APPLY|AS|ASC|AUTHORIZATION|BACKUP|BDB|BEGIN|BERKELEYDB|BIGINT|BINARY|BIT|BLOB|BOOL|BOOLEAN|BREAK|BROWSE|BTREE|BULK|BY|CALL|CASCADE|CASCADED|CASE|CHAIN|CHAR VARYING|CHARACTER VARYING|CHECK|CHECKPOINT|CLOSE|CLUSTERED|COALESCE|COLUMN|COLUMNS|COMMENT|COMMIT|COMMITTED|COMPUTE|CONNECT|CONSISTENT|CONSTRAINT|CONTAINS|CONTAINSTABLE|CONTINUE|CONVERT|CREATE|CROSS|CURRENT|CURRENT_DATE|CURRENT_TIME|CURRENT_TIMESTAMP|CURRENT_USER|CURSOR|DATA|DATABASE|DATABASES|DATETIME|DBCC|DEALLOCATE|DEC|DECIMAL|DECLARE|DEFAULT|DEFINER|DELAYED|DELETE|DENY|DESC|DESCRIBE|DETERMINISTIC|DISABLE|DISCARD|DISK|DISTINCT|DISTINCTROW|DISTRIBUTED|DO|DOUBLE|DOUBLE PRECISION|DROP|DUMMY|DUMP|DUMPFILE|DUPLICATE KEY|ELSE|ENABLE|ENCLOSED BY|END|ENGINE|ENUM|ERRLVL|ERRORS|ESCAPE|ESCAPED BY|EXCEPT|EXEC|EXECUTE|EXIT|EXPLAIN|EXTENDED|FETCH|FIELDS|FILE|FILLFACTOR|FIRST|FIXED|FLOAT|FOLLOWING|FOR|FOR EACH ROW|FORCE|FOREIGN|FREETEXT|FREETEXTTABLE|FROM|FULL|FUNCTION|GEOMETRY|GEOMETRYCOLLECTION|GLOBAL|GOTO|GRANT|GROUP|HANDLER|HASH|HAVING|HOLDLOCK|IDENTITY|IDENTITY_INSERT|IDENTITYCOL|IF|IGNORE|IMPORT|INDEX|INFILE|INNER|INNODB|INOUT|INSERT|INT|INTEGER|INTERSECT|INTO|INVOKER|ISOLATION LEVEL|JOIN|KEY|KEYS|KILL|LANGUAGE SQL|LAST|LEFT|LIMIT|LINENO|LINES|LINESTRING|LOAD|LOCAL|LOCK|LONGBLOB|LONGTEXT|MATCH|MATCHED|MEDIUMBLOB|MEDIUMINT|MEDIUMTEXT|MERGE|MIDDLEINT|MODIFIES SQL DATA|MODIFY|MULTILINESTRING|MULTIPOINT|MULTIPOLYGON|NATIONAL|NATIONAL CHAR VARYING|NATIONAL CHARACTER|NATIONAL CHARACTER VARYING|NATIONAL VARCHAR|NATURAL|NCHAR|NCHAR VARCHAR|NEXT|NO|NO SQL|NOCHECK|NOCYCLE|NONCLUSTERED|NULLIF|NUMERIC|OF|OFF|OFFSETS|ON|OPEN|OPENDATASOURCE|OPENQUERY|OPENROWSET|OPTIMIZE|OPTION|OPTIONALLY|ORDER|OUT|OUTER|OUTFILE|OVER|PARTIAL|PARTITION|PERCENT|PIVOT|PLAN|POINT|POLYGON|PRECEDING|PRECISION|PREV|PRIMARY|PRINT|PRIVILEGES|PROC|PROCEDURE|PUBLIC|PURGE|QUICK|RAISERROR|READ|READS SQL DATA|READTEXT|REAL|RECONFIGURE|REFERENCES|RELEASE|RENAME|REPEATABLE|REPLICATION|REQUIRE|RESTORE|RESTRICT|RETURN|RETURNS|REVOKE|RIGHT|ROLLBACK|ROUTINE|ROWCOUNT|ROWGUIDCOL|ROWS?|RTREE|RULE|SAVE|SAVEPOINT|SCHEMA|SELECT|SERIAL|SERIALIZABLE|SESSION|SESSION_USER|SET|SETUSER|SHARE MODE|SHOW|SHUTDOWN|SIMPLE|SMALLINT|SNAPSHOT|SOME|SONAME|START|STARTING BY|STATISTICS|STATUS|STRIPED|SYSTEM_USER|TABLE|TABLES|TABLESPACE|TEMPORARY|TEMPTABLE|TERMINATED BY|TEXT|TEXTSIZE|THEN|TIMESTAMP|TINYBLOB|TINYINT|TINYTEXT|TO|TOP|TRAN|TRANSACTION|TRANSACTIONS|TRIGGER|TRUNCATE|TSEQUAL|TYPE|TYPES|UNBOUNDED|UNCOMMITTED|UNDEFINED|UNION|UNPIVOT|UPDATE|UPDATETEXT|USAGE|USE|USER|USING|VALUE|VALUES|VARBINARY|VARCHAR|VARCHARACTER|VARYING|VIEW|WAITFOR|WARNINGS|WHEN|WHERE|WHILE|WITH|WITH ROLLUP|WITHIN|WORK|WRITE|WRITETEXT)\b/gi,"boolean":/\b(TRUE|FALSE|NULL)\b/gi,number:/\b-?(0x)?\d*\.?[\da-f]+\b/g,operator:/\b(ALL|AND|ANY|BETWEEN|EXISTS|IN|LIKE|NOT|OR|IS|UNIQUE|CHARACTER SET|COLLATE|DIV|OFFSET|REGEXP|RLIKE|SOUNDS LIKE|XOR)\b|[-+]{1}|!|=?&lt;|=?&gt;|={1}|(&amp;){1,2}|\|?\||\?|\*|\//gi,ignore:/&(lt|gt|amp);/gi,punctuation:/[;[\]()`,.]/g};;
Prism.languages.http={"request-line":{pattern:/^(POST|GET|PUT|DELETE|OPTIONS|PATCH|TRACE|CONNECT)\b\shttps?:\/\/\S+\sHTTP\/[0-9.]+/g,inside:{property:/^\b(POST|GET|PUT|DELETE|OPTIONS|PATCH|TRACE|CONNECT)\b/g,"attr-name":/:\w+/g}},"response-status":{pattern:/^HTTP\/1.[01] [0-9]+.*/g,inside:{property:/[0-9]+[A-Z\s-]+$/g}},keyword:/^[\w-]+:(?=.+)/gm};var httpLanguages={"application/json":Prism.languages.javascript,"application/xml":Prism.languages.markup,"text/xml":Prism.languages.markup,"text/html":Prism.languages.markup};for(var contentType in httpLanguages)if(httpLanguages[contentType]){var options={};options[contentType]={pattern:new RegExp("(content-type:\\s*"+contentType+"[\\w\\W]*?)\\n\\n[\\w\\W]*","gi"),lookbehind:!0,inside:{rest:httpLanguages[contentType]}},Prism.languages.insertBefore("http","keyword",options)};
Prism.languages.ruby=Prism.languages.extend("clike",{comment:/#[^\r\n]*(\r?\n|$)/g,keyword:/\b(alias|and|BEGIN|begin|break|case|class|def|define_method|defined|do|each|else|elsif|END|end|ensure|false|for|if|in|module|new|next|nil|not|or|raise|redo|require|rescue|retry|return|self|super|then|throw|true|undef|unless|until|when|while|yield)\b/g,builtin:/\b(Array|Bignum|Binding|Class|Continuation|Dir|Exception|FalseClass|File|Stat|File|Fixnum|Fload|Hash|Integer|IO|MatchData|Method|Module|NilClass|Numeric|Object|Proc|Range|Regexp|String|Struct|TMS|Symbol|ThreadGroup|Thread|Time|TrueClass)\b/,constant:/\b[A-Z][a-zA-Z_0-9]*[?!]?\b/g}),Prism.languages.insertBefore("ruby","keyword",{regex:{pattern:/(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\r\n])+\/[gim]{0,3}(?=\s*($|[\r\n,.;})]))/g,lookbehind:!0},variable:/[@$]+\b[a-zA-Z_][a-zA-Z_0-9]*[?!]?\b/g,symbol:/:\b[a-zA-Z_][a-zA-Z_0-9]*[?!]?\b/g});;
Prism.languages.go=Prism.languages.extend("clike",{keyword:/\b(break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go(to)?|if|import|interface|map|package|range|return|select|struct|switch|type|var)\b/g,builtin:/\b(bool|byte|complex(64|128)|error|float(32|64)|rune|string|u?int(8|16|32|64|)|uintptr|append|cap|close|complex|copy|delete|imag|len|make|new|panic|print(ln)?|real|recover)\b/g,"boolean":/\b(_|iota|nil|true|false)\b/g,operator:/([(){}\[\]]|[*\/%^!]=?|\+[=+]?|-[>=-]?|\|[=|]?|>[=>]?|<(<|[=-])?|==?|&(&|=|^=?)?|\.(\.\.)?|[,;]|:=?)/g,number:/\b(-?(0x[a-f\d]+|(\d+\.?\d*|\.\d+)(e[-+]?\d+)?)i?)\b/gi,string:/("|'|`)(\\?.|\r|\n)*?\1/g}),delete Prism.languages.go["class-name"];;
Prism.languages.swift=Prism.languages.extend("clike",{keyword:/\b(as|associativity|break|case|class|continue|convenience|default|deinit|didSet|do|dynamicType|else|enum|extension|fallthrough|final|for|func|get|if|import|in|infix|init|inout|internal|is|lazy|left|let|mutating|new|none|nonmutating|operator|optional|override|postfix|precedence|prefix|private|protocol|public|required|return|right|safe|self|Self|set|static|struct|subscript|super|switch|Type|typealias|unowned|unowned|unsafe|var|weak|where|while|willSet|__COLUMN__|__FILE__|__FUNCTION__|__LINE__)\b/g,number:/\b([\d_]+(\.[\de_]+)?|0x[a-f0-9_]+(\.[a-f0-9p_]+)?|0b[01_]+|0o[0-7_]+)\b/gi,constant:/\b(nil|[A-Z_]{2,}|k[A-Z][A-Za-z_]+)\b/g,atrule:/\@\b(IBOutlet|IBDesignable|IBAction|IBInspectable|class_protocol|exported|noreturn|NSCopying|NSManaged|objc|UIApplicationMain|auto_closure)\b/g,builtin:/\b([A-Z]\S+|abs|advance|alignof|alignofValue|assert|contains|count|countElements|debugPrint|debugPrintln|distance|dropFirst|dropLast|dump|enumerate|equal|filter|find|first|getVaList|indices|isEmpty|join|last|lazy|lexicographicalCompare|map|max|maxElement|min|minElement|numericCast|overlaps|partition|prefix|print|println|reduce|reflect|reverse|sizeof|sizeofValue|sort|sorted|split|startsWith|stride|strideof|strideofValue|suffix|swap|toDebugString|toString|transcode|underestimateCount|unsafeBitCast|withExtendedLifetime|withUnsafeMutablePointer|withUnsafeMutablePointers|withUnsafePointer|withUnsafePointers|withVaList)\b/g});
;
Prism.languages.objectivec=Prism.languages.extend("c",{keyword:/(\b(asm|typeof|inline|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while|in|self|super)\b)|((?=[\w|@])(@interface|@end|@implementation|@protocol|@class|@public|@protected|@private|@property|@try|@catch|@finally|@throw|@synthesize|@dynamic|@selector)\b)/g,string:/(?:("|')([^\n\\\1]|\\.|\\\r*\n)*?\1)|(@"([^\n\\"]|\\.|\\\r*\n)*?")/g,operator:/[-+]{1,2}|!=?|<{1,2}=?|>{1,2}=?|\->|={1,2}|\^|~|%|&{1,2}|\|?\||\?|\*|\/|@/g});;
Prism.languages.ini={comment:/^\s*;.*$/gm,important:/\[.*?\]/gm,constant:/^\s*[^\s\=]+?(?=[ \t]*\=)/gm,"attr-value":{pattern:/\=.*/gm,inside:{punctuation:/^[\=]/g}}};;
Prism.languages.yaml={scalar:{pattern:/([\-:]\s*(![^\s]+)?[ \t]*[|>])[ \t]*(?:((?:\r?\n|\r)[ \t]+)[^\r\n]+(?:\3[^\r\n]+)*)/,lookbehind:!0,alias:"string"},comment:/#.*/,key:{pattern:/(\s*[:\-,[{\r\n?][ \t]*(![^\s]+)?[ \t]*)[^\r\n{[\]},#]+?(?=\s*:\s)/,lookbehind:!0,alias:"atrule"},directive:{pattern:/(^[ \t]*)%.+/m,lookbehind:!0,alias:"important"},datetime:{pattern:/([:\-,[{]\s*(![^\s]+)?[ \t]*)(\d{4}-\d\d?-\d\d?([tT]|[ \t]+)\d\d?:\d{2}:\d{2}(\.\d*)?[ \t]*(Z|[-+]\d\d?(:\d{2})?)?|\d{4}-\d{2}-\d{2}|\d\d?:\d{2}(:\d{2}(\.\d*)?)?)(?=[ \t]*($|,|]|}))/m,lookbehind:!0,alias:"number"},"boolean":{pattern:/([:\-,[{]\s*(![^\s]+)?[ \t]*)(true|false)[ \t]*(?=$|,|]|})/im,lookbehind:!0,alias:"important"},"null":{pattern:/([:\-,[{]\s*(![^\s]+)?[ \t]*)(null|~)[ \t]*(?=$|,|]|})/im,lookbehind:!0,alias:"important"},string:{pattern:/([:\-,[{]\s*(![^\s]+)?[ \t]*)("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')(?=[ \t]*($|,|]|}))/m,lookbehind:!0},number:{pattern:/([:\-,[{]\s*(![^\s]+)?[ \t]*)[+\-]?(0x[\da-f]+|0o[0-7]+|(\d+\.?\d*|\.?\d+)(e[\+\-]?\d+)?|\.inf|\.nan)[ \t]*(?=$|,|]|})/im,lookbehind:!0},tag:/![^\s]+/,important:/[&*][\w]+/,punctuation:/---|[:[\]{}\-,|>?]|\.\.\./};
Prism.languages.docker={keyword:{pattern:/(^\s*)(?:ONBUILD|FROM|MAINTAINER|RUN|EXPOSE|ENV|ADD|COPY|VOLUME|USER|WORKDIR|CMD|LABEL|ENTRYPOINT)(?=\s)/im,lookbehind:!0},string:/("|')(?:(?!\1)[^\\\r\n]|\\(?:\r\n|[\s\S]))*?\1/,comment:/#.*/,punctuation:/---|\.\.\.|[:[\]{}\-,|>?]/};
Prism.hooks.add("after-highlight",function(e){var n=e.element.parentNode;if(n&&/pre/i.test(n.nodeName)&&-1!==n.className.indexOf("line-numbers")){var t,a=1+e.code.split("\n").length;lines=new Array(a),lines=lines.join("<span></span>"),t=document.createElement("span"),t.className="line-numbers-rows",t.innerHTML=lines,n.hasAttribute("data-start")&&(n.style.counterReset="linenumber "+(parseInt(n.getAttribute("data-start"),10)-1)),e.element.appendChild(t)}});;
Prism.languages.json={property:/".*?"(?=\s*:)/gi,string:/"(?!:)(\\?[^"])*?"(?!:)/g,number:/\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/g,punctuation:/[{}[\]);,]/g,operator:/:/g,"boolean":/\b(true|false)\b/gi,"null":/\bnull\b/gi},Prism.languages.jsonp=Prism.languages.json;
/* End prism */
/* Bigfoot */
(function(){!function(a){return a.bigfoot=function(b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C;return e=void 0,k={actionOriginalFN:"hide",activateCallback:function(){},activateOnHover:!1,allowMultipleFN:!1,anchorPattern:/(fn|footnote|note)[:\-_\d]/gi,anchorParentTagname:"sup",breakpoints:{},deleteOnUnhover:!1,footnoteParentClass:"footnote",footnoteTagname:"li",hoverDelay:250,numberResetSelector:void 0,popoverDeleteDelay:300,popoverCreateDelay:100,positionContent:!0,preventPageScroll:!0,scope:!1,useFootnoteOnlyOnce:!0,contentMarkup:'<aside class="bigfoot-footnote is-positioned-bottom" data-footnote-number="{{FOOTNOTENUM}}" data-footnote-identifier="{{FOOTNOTEID}}" alt="Footnote {{FOOTNOTENUM}}"> <div class="bigfoot-footnote__wrapper"> <div class="bigfoot-footnote__content"> {{FOOTNOTECONTENT}} </div></div> <div class="bigfoot-footnote__tooltip"></div> </aside>',buttonMarkup:'<div class=\'bigfoot-footnote__container\'> <button class="bigfoot-footnote__button" id="{{SUP:data-footnote-backlink-ref}}" data-footnote-number="{{FOOTNOTENUM}}" data-footnote-identifier="{{FOOTNOTEID}}" alt="See Footnote {{FOOTNOTENUM}}" rel="footnote" data-bigfoot-footnote="{{FOOTNOTECONTENT}}"> <svg class="bigfoot-footnote__button__circle" viewbox="0 0 6 6" preserveAspectRatio="xMinYMin"><circle r="3" cx="3" cy="3" fill="white"></circle></svg> <svg class="bigfoot-footnote__button__circle" viewbox="0 0 6 6" preserveAspectRatio="xMinYMin"><circle r="3" cx="3" cy="3" fill="white"></circle></svg> <svg class="bigfoot-footnote__button__circle" viewbox="0 0 6 6" preserveAspectRatio="xMinYMin"><circle r="3" cx="3" cy="3" fill="white"></circle></svg> </button></div>'},y=a.extend(k,b),q={},n=function(){var b,c,d,e,f,g,i,j,k,m,n,o,p,q,r,t,u,w,x,z;for(n=y.scope?""+y.scope+' a[href*="#"]':'a[href*="#"]',d=a(n).filter(function(){var b,c;return b=a(this),c=b.attr("rel"),("null"===c||null==c)&&(c=""),(""+b.attr("href")+c).match(y.anchorPattern)&&b.closest("[class*="+y.footnoteParentClass+"]:not(a):not("+y.anchorParentTagname+")").length<1}),t=[],q=[],k=[],h(d,q),a(q).each(function(){var b,c;return c=a(this).data("footnote-ref").replace(/[:.+~*\]\[]/g,"\\$&"),y.useFootnoteOnlyOnce&&(c=""+c+":not(.footnote-processed)"),b=a(c).closest(y.footnoteTagname),b.length>0?(t.push(b.first().addClass("footnote-processed")),k.push(this)):void 0}),c=a("[data-footnote-identifier]:last"),p=c.length<1?0:+c.data("footnote-identifier"),z=[],u=w=0,x=t.length;x>=0?x>w:w>x;u=x>=0?++w:--w)switch(o=s(a(t[u]).html().trim(),a(k[u]).data("footnote-backlink-ref")),o=o.replace(/"/g,"&quot;").replace(/&lt;/g,"&ltsym;").replace(/&gt;/g,"&gtsym;"),p+=1,m="",i=a(k[u]),j=a(t[u]),null!=y.numberResetSelector?(b=i.closest(y.numberResetSelector),b.is(f)?r+=1:r=1,f=b):r=p,0!==o.indexOf("<")&&(o="<p>"+o+"</p>"),m=y.buttonMarkup.replace(/\{\{FOOTNOTENUM\}\}/g,r).replace(/\{\{FOOTNOTEID\}\}/g,p).replace(/\{\{FOOTNOTECONTENT\}\}/g,o),m=v(m,"SUP",i),m=v(m,"FN",j),e=a(m).insertBefore(i),g=j.parent(),y.actionOriginalFN.toLowerCase()){case"hide":i.addClass("footnote-print-only"),j.addClass("footnote-print-only"),z.push(l(g));break;case"delete":i.remove(),j.remove(),z.push(l(g));break;default:z.push(i.addClass("footnote-print-only"))}return z},h=function(b,c){var d,e,f,g;null==c&&(c=[]),d=void 0,e=void 0,f=void 0,g=void 0,b.each(function(){var b,e;return e=a(this),f="#"+e.attr("href").split("#")[1],d=e.closest(y.anchorParentTagname),b=e.find(y.anchorParentTagname),d.length>0?(g=(d.attr("id")||"")+(e.attr("id")||""),c.push(d.attr({"data-footnote-backlink-ref":g,"data-footnote-ref":f}))):b.length>0?(g=(b.attr("id")||"")+(e.attr("id")||""),c.push(e.attr({"data-footnote-backlink-ref":g,"data-footnote-ref":f}))):(g=e.attr("id")||"",c.push(e.attr({"data-footnote-backlink-ref":g,"data-footnote-ref":f})))})},l=function(a){var b;return b=void 0,a.is(":empty")||0===a.children(":not(.footnote-print-only)").length?(b=a.parent(),"delete"===y.actionOriginalFN.toLowerCase()?a.remove():a.addClass("footnote-print-only"),l(b)):a.children(":not(.footnote-print-only)").length===a.children("hr:not(.footnote-print-only)").length?(b=a.parent(),"delete"===y.actionOriginalFN.toLowerCase()?a.remove():(a.children("hr").addClass("footnote-print-only"),a.addClass("footnote-print-only")),l(b)):void 0},s=function(a,b){var c;return b.indexOf(" ")>=0&&(b=b.trim().replace(/\s+/g,"|").replace(/(.*)/g,"($1)")),c=new RegExp("(\\s|&nbsp;)*<\\s*a[^#<]*#"+b+"[^>]*>(.*?)<\\s*/\\s*a>","g"),a.replace(c,"").replace("[]","")},v=function(a,b,c){var d,e,f,g;for(e=new RegExp("\\{\\{"+b+":([^\\}]*)\\}\\}","g"),d=void 0,g=void 0,f=void 0,d=e.exec(a);d;)d[1]&&(g=c.attr(d[1])||"",a=a.replace("{{"+b+":"+d[1]+"}}",g)),d=e.exec(a);return a},f=function(b){var c,d,e;if(y.activateOnHover){if(c=a(b.target).closest(".bigfoot-footnote__button"),d='[data-footnote-identifier="'+c.attr("data-footnote-identifier")+'"]',c.hasClass("is-active"))return;c.addClass("is-hover-instantiated"),y.allowMultipleFN||(e=".bigfoot-footnote:not("+d+")",u(e)),j(".bigfoot-footnote__button"+d).addClass("is-hover-instantiated")}},z=function(b){var c,d,e;e=a(b.target),c=e.closest(".bigfoot-footnote__button"),d=e.closest(".bigfoot-footnote"),c.length>0?(b.preventDefault(),i(c)):d.length<1&&a(".bigfoot-footnote").length>0&&u()},i=function(a){var b;a.blur(),b='data-footnote-identifier="'+a.attr("data-footnote-identifier")+'"',a.hasClass("changing")||(a.hasClass("is-active")?y.allowMultipleFN?u(".bigfoot-footnote["+b+"]"):u():(a.addClass("changing"),setTimeout(function(){return a.removeClass("changing")},y.popoverCreateDelay),j(".bigfoot-footnote__button["+b+"]"),a.addClass("is-click-instantiated"),y.allowMultipleFN||u(".bigfoot-footnote:not(["+b+"])")))},j=function(b){var c,d;return c=void 0,c="string"!=typeof b&&y.allowMultipleFN?b:"string"!=typeof b?b.first():y.allowMultipleFN?a(b).closest(".bigfoot-footnote__button"):a(b+":first").closest(".bigfoot-footnote__button"),d=a(),c.each(function(){var b,e,f,h;f=a(this),h=void 0;try{return h=y.contentMarkup.replace(/\{\{FOOTNOTENUM\}\}/g,f.attr("data-footnote-number")).replace(/\{\{FOOTNOTEID\}\}/g,f.attr("data-footnote-identifier")).replace(/\{\{FOOTNOTECONTENT\}\}/g,f.attr("data-bigfoot-footnote")).replace(/\&gtsym\;/g,"&gt;").replace(/\&ltsym\;/g,"&lt;"),h=v(h,"BUTTON",f)}finally{b=a(h);try{y.activateCallback(b,f)}catch(i){}b.insertAfter(c),q[f.attr("data-footnote-identifier")]="init",b.attr("bigfoot-max-width",g(b.css("max-width"),b)),b.css("max-width",1e4),e=b.find(".bigfoot-footnote__content"),b.attr("data-bigfoot-max-height",g(e.css("max-height"),e)),w(),f.addClass("is-active"),b.find(".bigfoot-footnote__content").bindScrollHandler(),d=d.add(b)}}),setTimeout(function(){return d.addClass("is-active")},y.popoverCreateDelay),d},d=function(){var a,b;return a=document.createElement("div"),a.style.cssText="display:inline-block;padding:0;line-height:1;position:absolute;visibility:hidden;font-size:1em;",a.appendChild(document.createElement("M")),document.body.appendChild(a),b=a.offsetHeight,document.body.removeChild(a),b},g=function(a,b){return"none"===a?a=1e4:a.indexOf("rem")>=0?a=parseFloat(a)*d():a.indexOf("em")>=0?a=parseFloat(a)*parseFloat(b.css("font-size")):a.indexOf("px")>=0?(a=parseFloat(a),60>=a&&(a/=parseFloat(b.parent().css("width")))):a.indexOf("%")>=0&&(a=parseFloat(a)/100),a},a.fn.bindScrollHandler=function(){return y.preventPageScroll?(a(this).on("DOMMouseScroll mousewheel",function(b){var c,d,e,f,g,h,i,j;return d=a(this),i=d.scrollTop(),h=d[0].scrollHeight,f=parseInt(d.css("height")),c=d.closest(".bigfoot-footnote"),d.scrollTop()>0&&d.scrollTop()<10&&c.addClass("is-scrollable"),c.hasClass("is-scrollable")?(e="DOMMouseScroll"===b.type?-40*b.originalEvent.detail:b.originalEvent.wheelDelta,j=e>0,g=function(){return b.stopPropagation(),b.preventDefault(),b.returnValue=!1,!1},!j&&-e>h-f-i?(d.scrollTop(h),c.addClass("is-fully-scrolled"),g()):j&&e>i?(d.scrollTop(0),c.removeClass("is-fully-scrolled"),g()):c.removeClass("is-fully-scrolled")):void 0}),a(this)):a(this)},A=function(b){return y.deleteOnUnhover&&y.activateOnHover?setTimeout(function(){var c;return c=a(b.target).closest(".bigfoot-footnote, .bigfoot-footnote__button"),a(".bigfoot-footnote__button:hover, .bigfoot-footnote:hover").length<1?u():void 0},y.hoverDelay):void 0},m=function(a){return 27===a.keyCode?u():void 0},u=function(b,c){var d,e,f,g;return null==b&&(b=".bigfoot-footnote"),null==c&&(c=y.popoverDeleteDelay),d=a(),g=void 0,e=void 0,f=void 0,a(b).each(function(){return f=a(this),g=f.attr("data-footnote-identifier"),e=a('.bigfoot-footnote__button[data-footnote-identifier="'+g+'"]'),e.hasClass("changing")?void 0:(d=d.add(e),e.removeClass("is-active is-hover-instantiated is-click-instantiated").addClass("changing"),f.removeClass("is-active").addClass("disapearing"),setTimeout(function(){return f.remove(),delete q[g],e.removeClass("changing")},c))}),d},w=function(b){var c;y.positionContent&&(c=b?b.type:"resize",a(".bigfoot-footnote").each(function(){var b,d,e,f,g,h,i,j,k,l,m,n,o,p,s,t;return f=a(this),h=f.attr("data-footnote-identifier"),g='data-footnote-identifier="'+h+'"',d=f.find(".bigfoot-footnote__content"),b=f.siblings(".bigfoot-footnote__button"),s=x(b),j=parseFloat(f.css("margin-top")),k=+f.attr("data-bigfoot-max-height"),t=2*j+f.outerHeight(),l=1e4,o=s.bottomRoom<t&&s.topRoom>s.bottomRoom,i=q[h],o?("top"!==i&&(q[h]="top",f.addClass("is-positioned-top").removeClass("is-positioned-bottom"),f.css("transform-origin",100*s.leftRelative+"% 100%")),l=s.topRoom-j-15):(("bottom"!==i||"init"===i)&&(q[h]="bottom",f.removeClass("is-positioned-top").addClass("is-positioned-bottom"),f.css("transform-origin",100*s.leftRelative+"% 0%")),l=s.bottomRoom-j-15),f.find(".bigfoot-footnote__content").css({"max-height":Math.min(l,k)+"px"}),"resize"===c&&(n=parseFloat(f.attr("bigfoot-max-width")),e=f.find(".bigfoot-footnote__wrapper"),m=n,1>=n&&(p=function(){var b,c;return c=1e4,y.maxWidthRelativeTo&&(b=a(y.maxWidthRelativeTo),b.length>0&&(c=b.outerWidth())),Math.min(window.innerWidth,c)}(),m=p*n),m=Math.min(m,f.find(".bigfoot-footnote__content").outerWidth()+1),e.css("max-width",m+"px"),f.css({left:-s.leftRelative*m+parseFloat(b.css("margin-left"))+b.outerWidth()/2+"px"}),r(f,s.leftRelative)),parseInt(f.outerHeight())<f.find(".bigfoot-footnote__content")[0].scrollHeight?f.addClass("is-scrollable"):void 0}))},r=function(a,b){var c;null==b&&(b=.5),c=a.find(".bigfoot-footnote__tooltip"),c.length>0&&c.css("left",""+100*b+"%")},x=function(a){var b,c,d,e,f,g;return c=parseFloat(a.css("margin-left")),d=parseFloat(a.outerWidth())-c,b=parseFloat(a.outerHeight()),g=C(),f=a.offset().top-g.scrollY+b/2,e=a.offset().left-g.scrollX+d/2,{topRoom:f,bottomRoom:g.height-f,leftRoom:e,rightRoom:g.width-e,leftRelative:e/g.width,topRelative:f/g.height}},C=function(){return{width:window.innerWidth,height:window.innerHeight,scrollX:window.scrollX,scrollY:window.scrollY}},c=function(a,b,c,d,f){var g,h,i,j,k,l,m;return null==d&&(d=y.popoverDeleteDelay),null==f&&(f=!0),j=void 0,h=void 0,l=void 0,"string"==typeof a?(l="iphone"===a.toLowerCase()?"<320px":"ipad"===a.toLowerCase()?"<768px":a,h=">"===l.charAt(0)?"min":"<"===l.charAt(0)?"max":null,k=h?"("+h+"-width: "+l.substring(1)+")":l,j=window.matchMedia(k)):j=a,j.media&&"invalid"===j.media?{added:!1,mq:j,listener:null}:(m="min"===h,g="max"===h,b=b||p(f,d,m,function(a){return a.addClass("is-bottom-fixed")}),c=c||p(f,d,g,function(){}),i=function(a){a.matches?b(f,e):c(f,e)},j.addListener(i),i(j),y.breakpoints[a]={added:!0,mq:j,listener:i},y.breakpoints[a])},p=function(a,b,c,d){return function(a,e){var f;return f=void 0,a&&(f=e.close(),e.updateSetting("activateCallback",d)),setTimeout(function(){return e.updateSetting("positionContent",c),a?e.activate(f):void 0},b)}},t=function(a,b){var c,d,e,f;if(e=null,c=void 0,f=!1,"string"==typeof a)f=void 0!==y.breakpoints[a];else for(c in y.breakpoints)y.breakpoints.hasOwnProperty(c)&&y.breakpoints[c].mq===a&&(f=!0);return f&&(d=y.breakpoints[c||a],b?b({matches:!1}):d.listener({matches:!1}),d.mq.removeListener(d.listener),delete y.breakpoints[c||a]),f},B=function(a,b){var c,d;if(c=void 0,"string"==typeof a)c=y[a],y[a]=b;else{c={};for(d in a)a.hasOwnProperty(d)&&(c[d]=y[d],y[d]=a[d])}return c},o=function(a){return y[a]},a(document).ready(function(){return n(),a(document).on("mouseenter",".bigfoot-footnote__button",f),a(document).on("touchend click",z),a(document).on("mouseout",".is-hover-instantiated",A),a(document).on("keyup",m),a(window).on("scroll resize",w),a(document).on("gestureend",function(){return w()})}),e={removePopovers:u,close:u,createPopover:j,activate:j,repositionFeet:w,reposition:w,addBreakpoint:c,removeBreakpoint:t,getSetting:o,updateSetting:B}}}(jQuery)}).call(this);
/* End Bigfoot */
