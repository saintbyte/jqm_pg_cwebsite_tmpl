	var HOST = 'http://stalker-gis.ru';
	function makeview()
	{
	  $('#content').height($(window).height()-($('#header').height() + $('#footer').height() + (parseInt($('#content').css('padding'))  * 2) + 4));
	}
	$( document ).bind( "mobileinit", function() {
            $.support.cors = true;
	    $.mobile.allowCrossDomainPages = true;
	    $.mobile.defaultPageTransition = 'slide';
	});
	var TOKEN;
	var HOST = 'http://stalker-gis.ru';
	var CURWIKIURL  = '';
	function makeview()
	{
	  TOKEN = window.localStorage.getItem("curtoken");
	  $('#content').height($(window).height()-($('#header').height() + $('#footer').height() + (parseInt($('#content').css('padding'))  * 2) + 4));
	  loadwiki('');
	}

	function loadwiki(url)
	{
	//http://stalker-gis.ru/wikijson/?token=1_89655ac017fdd50065f2141c855bafba&urlToParse=
		if (url.substr(url.length-1) == '/') {
		 url = url.substr(0,url.length-1);
		}
		if (CURWIKIURL != '') 
		{
		  url = CURWIKIURL+'/'+url;
		}
		$.mobile.showPageLoadingMsg();
		var ajaxurl = HOST+'/wikijson/?token='+TOKEN+'&urlToParse='+url+'&callback=?';
		alert(ajaxurl);
		$.ajax(
		    { url: ajaxurl,
		     dataType: "jsonp",
		     success: function(data, textStatus, jqXHR) {
			    console.log(data);
			    $.mobile.hidePageLoadingMsg(); 
			    if (data.wiki) {
			      $('#heading').html(data.wiki.title);
			      $('#content').html('<h1>'+data.wiki.title+'</h1>'+data.wiki.text);
			      CURURL = url;
			      $('#content a').unbind().click(function(event) {
			       var url = $(this).attr('href');
			       loadwiki(url);
			       event.preventDefault();
			       event.stopPropagation();
			      });
		            } else {
				alert('Error:'+data.result);					
			    }
			  }
                });
	}
	
	function login()
	{
			  str = $(window).height();
			  header_height = $('#header').height();
			  footer_height = $('#footer').height();
			  str += ' '+header_height +' '+footer_height;
			  $('#content').height($(window).height()-($('#header').height() + $('#footer').height() + (parseInt($('#content').css('padding'))  * 2) + 4));
			  //alert(str)
			  $.mobile.showPageLoadingMsg();
			  $.ajax(
			  { url: HOST+'/auth/jsonlogin?login='+$('#login').val()+'&password='+$('#password').val()+'&callback=?',
			  dataType: "jsonp",
			  success: function(data, textStatus, jqXHR) {
			    $.mobile.hidePageLoadingMsg(); 
			    if (data.result == 'OK') {
				if ($('#save').val() == 'on') {
					window.localStorage.setItem("autologin", "1");
					window.localStorage.setItem("login",    $('#login').val());
					window.localStorage.setItem("password", $('#password').val());
				} else {
					window.localStorage.setItem("autologin", "0");
				}
				window.localStorage.setItem("curtoken", data.token);
				$.mobile.changePage('first.html');	
		            } else {
				alert('Error:'+data.result);					
			    }
			  }
			  });
	}
	
	$(document).ready(function(){
			/*
			if (navigator.connection.type) {
			var networkState = navigator.connection.type;
			} else {
			var networkState = undefined;  
			} */
			if (true) {
			  $('#online').show();
			  $('#offline').hide();
			  makeview(); 
			  var autologin = window.localStorage.getItem("autologin");
			  if (autologin == '1')
			  {
				$('#save').attr("checked",true).checkboxradio("refresh");
				$('#login').val(window.localStorage.getItem("login"));
				$('#password').val(window.localStorage.getItem("password"));
				login();
			  }	
			  $('#login_butt').click(function() {
				  login();
			  });
			} else {
			  $('#offline').show();
			  $('#online').hide();
			  
			}
			//http://stalker-gis.ru/auth/jsonlogin?login=123123&password=123123
	});
	$(document).load(function() {
		      makeview(); 
	});
	$(document).resize(function() { 
		      makeview(); 
	});