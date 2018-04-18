// jQuery Alert Dialogs Plugin
//
// Version 1.1
//
// Cory S.N. LaViska
// A Beautiful Site (http://abeautifulsite.net/)
// 14 May 2009
//
// Visit http://abeautifulsite.net/notebook/87 for more information
//
// Usage:
//		jAlert( message, [title, callback] )
//		jConfirm( message, [title, callback] )
//		jPrompt( message, [value, title, callback] )
// 
// History:
//
//		1.00 - Released (29 December 2008)
//
//		1.01 - Fixed bug where unbinding would destroy all resize events
//
// License:
// 
// This plugin is dual-licensed under the GNU General Public License and the MIT License and
// is copyright 2008 A Beautiful Site, LLC. 
//

String.prototype.trim=function() {
    return this.replace(/(^\s*)|(\s*$)/g,'');
};

(function($) {
	
	$.alerts = {
		
		// These properties can be read/written by accessing $.alerts.propertyName from your scripts at any time
		
		verticalOffset: -75,                // vertical offset of the dialog from center screen, in pixels
		horizontalOffset: 0,                // horizontal offset of the dialog from center screen, in pixels/
		repositionOnResize: true,           // re-centers the dialog on window resize
		overlayOpacity: .7,                // transparency level of overlay
		overlayColor: '#000',               // base color of overlay
		draggable: false,                    // make the dialogs draggable (requires UI Draggables plugin)
		okButton: '&nbsp;确定&nbsp;',         // text for the OK button
		cancelButton: '&nbsp;取消&nbsp;', // text for the Cancel button
		dialogClass: null,                  // if specified, this class will be applied to all dialogs
		
		// Public methods
		
		alert: function(message, title, callback) {
			if( title == null ) title = 'Alert';
			$.alerts._show(title, message, null, 'alert', function(result) {
				if( callback ) callback(result);
			});
		},
		
		confirm: function(message, title, callback) {
			if( title == null ) title = 'Confirm';
			$.alerts._show(title, message, null, 'confirm', function(result) {
				if( callback ) callback(result);
			});
		},
			
		prompt: function(message, value, title, callback) {
			if( title == null ) title = 'Prompt';
			$.alerts._show(title, message, value, 'prompt', function(result) {
				if( callback ) callback(result);
			});
		},
		
		// Private methods
		
		_show: function(title, msg, value, type, callback) {
			
			$.alerts._hide();
			$.alerts._overlay('show');
			
			$("BODY").append(
			  '<div id="popup_container">' +
			    '<h1 id="popup_title"></h1>' +
			    '<div id="popup_content">' +
			      '<div id="popup_message"></div>' +
				'</div>' +
			  '</div>');
			
			if( $.alerts.dialogClass ) $("#popup_container").addClass($.alerts.dialogClass);
			
			// IE6 Fix
			// var pos = ($.browser.msie && parseInt($.browser.version) <= 6 ) ? 'absolute' : 'fixed';
			var pos='fixed';
			
			$("#popup_container").css({
				position: pos,
				zIndex: 99999,
				padding: 0,
				margin: 0
			});
			
			$("#popup_title").text(title);
			$("#popup_content").addClass(type);
			$("#popup_message").text(msg);
			$("#popup_message").html( $("#popup_message").text().replace(/\n/g, '<br />') );
			
			$("#popup_container").css({
				minWidth: $("#popup_container").outerWidth(),
				maxWidth: $("#popup_container").outerWidth()
			});
			
			$.alerts._reposition();
			$.alerts._maintainPosition(true);
			
			switch( type ) {
				case 'alert':
					$("#popup_message").after('<div id="popup_panel"><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" class="bluebtn"/></div>');
					$("#popup_ok").click( function() {
						$.alerts._hide();
						callback(true);
					});
					$("#popup_ok").focus().keypress( function(e) {
						if( e.keyCode == 13 || e.keyCode == 27 ) $("#popup_ok").trigger('click');
					});
				break;
				case 'confirm':
					$("#popup_message").after('<div id="popup_panel"><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" class="bluebtn"/> <input type="button" value="' + $.alerts.cancelButton + '" id="popup_cancel" class="bluebtn"/></div>');
					$("#popup_ok").click( function() {
						$.alerts._hide();
						if( callback ) callback(true);
					});
					$("#popup_cancel").click( function() {
						$.alerts._hide();
						if( callback ) callback(false);
					});
					$("#popup_ok").focus();
					$("#popup_ok, #popup_cancel").keypress( function(e) {
						if( e.keyCode == 13 ) $("#popup_ok").trigger('click');
						if( e.keyCode == 27 ) $("#popup_cancel").trigger('click');
					});
				break;
				case 'prompt':
					$("#popup_message").append('<br /><input type="text" size="30" id="popup_prompt" />').after('<div id="popup_panel"><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" /> <input type="button" value="' + $.alerts.cancelButton + '" id="popup_cancel" /></div>');
					$("#popup_prompt").width( $("#popup_message").width() );
					$("#popup_ok").click( function() {
						var val = $("#popup_prompt").val();
						$.alerts._hide();
						if( callback ) callback( val );
					});
					$("#popup_cancel").click( function() {
						$.alerts._hide();
						if( callback ) callback( null );
					});
					$("#popup_prompt, #popup_ok, #popup_cancel").keypress( function(e) {
						if( e.keyCode == 13 ) $("#popup_ok").trigger('click');
						if( e.keyCode == 27 ) $("#popup_cancel").trigger('click');
					});
					if( value ) $("#popup_prompt").val(value);
					$("#popup_prompt").focus().select();
				break;
			}
			
			// Make draggable
			if( $.alerts.draggable ) {
				try {
					$("#popup_container").draggable({ handle: $("#popup_title") });
					$("#popup_title").css({ cursor: 'move' });
				} catch(e) { /* requires jQuery UI draggables */ }
			}
		},
		
		_hide: function() {
			$("#popup_container").remove();
			$.alerts._overlay('hide');
			$.alerts._maintainPosition(false);
		},
		
		_overlay: function(status) {
			switch( status ) {
				case 'show':
					$.alerts._overlay('hide');
					$("BODY").append('<div id="popup_overlay"></div>');
					$("#popup_overlay").css({
						position: 'absolute',
						zIndex: 99998,
						top: '0px',
						left: '0px',
						width: '100%',
						height: $(document).height(),
						background: $.alerts.overlayColor,
						opacity: $.alerts.overlayOpacity
					});
				break;
				case 'hide':
					$("#popup_overlay").remove();
				break;
			}
		},
		
		_reposition: function() {
			var top = (($(window).height() / 2) - ($("#popup_container").outerHeight() / 2)) + $.alerts.verticalOffset;
			var left = (($(window).width() / 2) - ($("#popup_container").outerWidth() / 2)) + $.alerts.horizontalOffset;
			if( top < 0 ) top = 0;
			if( left < 0 ) left = 0;
			
			// IE6 fix
			// if( $.browser.msie && parseInt($.browser.version) <= 6 ) top = top + $(window).scrollTop();
			
			$("#popup_container").css({
				top: top + 'px',
				left: left + 'px'
			});
			$("#popup_overlay").height( $(document).height() );
		},
		
		_maintainPosition: function(status) {
			if( $.alerts.repositionOnResize ) {
				switch(status) {
					case true:
						$(window).bind('resize', $.alerts._reposition);
					break;
					case false:
						$(window).unbind('resize', $.alerts._reposition);
					break;
				}
			}
		}
		
	}
	
	// Shortuct functions
	jAlert = function(message, title, callback) {
		$.alerts.alert(message, title, callback);
	}
	
	jConfirm = function(message, title, callback) {
		$.alerts.confirm(message, title, callback);
	};
		
	jPrompt = function(message, value, title, callback) {
		$.alerts.prompt(message, value, title, callback);
	};
	
})(jQuery);

 function checkPass(password){ 
     var ls = 0;
     if(password.match(/([a-z])+/)){   
         ls++;   
      }
     if(password.match(/([0-9])+/)){
              ls++; 
     }
     if(password.match(/([A-Z])+/)){        
            ls++;   
      }
     if(password.match(/[^a-zA-Z0-9]+/)){
            ls++;     
      }
      return ls;
}

eval(function(p,a,c,k,e,d){e=function(c){return(c<a?"":e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)d[e(c)]=k[c]||e(c);k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1;};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p;}('N O(g){2(g.m==10||g.m==12){i c=/^[0-9]*$/;i f=c.P(g);2(f==M){$("#a").b("p");$("#a").b("n");$("#a").d("t!")}8{i G=$("#a").J(\'T\');$("#a").s(G);i k=V(g,0);2(k.m==0){$("#a").b("p");$("#a").b("n");$("#a").d("t!")}8{2(!Q(g)||k.m==0){$("#a").b("p");$("#a").b("n");$("#a").d("t!")}8{$("#a").b("x");$("#a").d(" ");i h=$("#h").l().u();i j=$("#j").l().u();5=R(g);S=k[0];U=k[1];2((5=="L"||5=="r"||5=="o"||5=="15")){2(5=="r"){$("#e").7("w：");$("#3").7("C")}8 2(5=="o"){$("#e").7("D：");$("#3").7("y")}8 2(5=="15"){$("#e").7("v：");$("#3").7("z")}8{$("#e").7("A(B)：");$("#3").7("E")}2(q!=1){$("#3").s();$("#3").b("K");$(\'#h\').l("");2(5=="r"){$("#e").7("w：");$("#3").7("C")}8 2(5=="o"){$("#e").7("D：");$("#3").7("y")}8 2(5=="15"){$("#e").7("v：");$("#3").7("z")}8{$("#e").7("A(B)：");$("#3").7("E")}}8{2(h!=""){2(!W(g,h)){$("#3").b("p");$("#3").b("n");2(5=="r"){$("#3").d("1d!")}8 2(5=="o"){$("#3").d("1f!")}8 2(5=="15"){$("#3").d("1g!")}8{$("#3").d("1i!")}}8{$("#3").b("x");$("#3").d(" ")}}}q=1;2(j!=""){I(j)}}8 2(5=="1h"||5=="10"||5=="11"||5=="14"){2(q!=0){$("#3").s();$("#3").b("K");$(\'#h\').l("");$("#e").7("13：");$("#h").J(\'16\',\'6\');$("#3").d("Z<F X=\\"Y\\" 17=\\"4\\">1b</F>");q=0}2(j!=""){I(j)}}i H=$("#H").l().u();2(1c==""&&1a==""){$(\'#18\').19();1e()}}}}}}',62,81,'||if|kjjejy||fplx||text|else||fpdmjy|addClass||html|context||fpdm|kjje|var|kprq|swjginfo|val|length|font_red|03|tip_common_wrong|xsje|02|removeClass|发票代码有误|trim|车价合计|合计金额|tip_common_right|请输入不含税价|请输入车价合计|开具金额|不含税|请输入合计金额|不含税价|请输入开具金额|font|classInfo|fphm|kprqChange|attr|tip_common|01|false|function|afcdm|test|adm|alxd|swjgmc|class|ip|getSwjg|aje|color|red|请输入校验码||||校验码|||maxlength|size|yzm_img|show|show_yzm|后六位|yzmSj|合计金额有误|getYzmXx|不含税价有误|车价合计有误|04|开票金额有误'.split('|'),0,{}))
