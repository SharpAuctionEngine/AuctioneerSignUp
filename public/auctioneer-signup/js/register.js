//	note: 'change' triggers when the user is done, 'input' triggers on each keystroke
//	on 'change' we would want to AJAX a username to see if it is taken,
//	on 'input' we would want to check that the username doesnt have illegal symbols
var registerParseVal = {
  username : function(event) // on 'input'
  {
      var $i = $(this);
      var c_p = $i.getCursorPosition();
      var max_length = $i.attr('data-max-length')||32;
      //	no illegal characters
      var valid = parseUserNameInput(this.value);
      if (this.value !== valid)
      {
          $(this).parent().find('.help-block').find('.character-rules').show();
      }
      if (this.value.length > (0.85*max_length))
      {

          $(this)
              .parent().find('.help-block').find('.max-length').show()
              .html("("+this.value.length+"/"+max_length+" characters)");
          if (this.value.length > max_length)
          {
              $(this).parent().find('.help-block').find('.max-length').addClass('text-danger');
          }
          else
          {
              $(this).parent().find('.help-block').find('.max-length').removeClass('text-danger');
          }
      }
      else
      {
          $(this)
              .parent().find('.help-block').find('.max-length').hide();
      }
      this.value = valid;

      var $p = $("form input[name=username]").parent();
      if (this.value.length < 4){$p.find('.is-ok').hide();return false;}
      //	AJAX, username is available or not

      username = this.value;
      
      $(this).setCursorPosition(c_p);
  },
  usernameTaken : function(event) // on 'input'
  {
      var $i = $(this);
      var $p = $i.parents('.form-group');
      var username = $(this).val();
      
      if (username.length < 4) return;

      $.ajax({
          url:"/api/auth/is/username/available",
          data:{username:username},
          success:function (json) {
            registerParseVal.onUsernameTakenAjaxSuccess(json,$i,$p);
          },
          error:function () {
              return false;
          }
      });
  },
  onUsernameTakenAjaxSuccess:function(json,$i,$fg)
  {
      if (json.username !== $i.val())
      {
          //console.log("data already changed");
          return false;
      }
      if (json.is_available)
      {
          //console.log('Username '+username+' is available.');
          $fg.find('.is-ok').show();
          $fg.find('.is-not-ok').hide();
      }
      else
      {
          //console.log('Username '+username+' is not available.');
          $fg.find('.is-ok').hide();
          $fg.find('.is-not-ok').show();
      }
  },
  password : function (event) { // on 'input'
      // TODO	calculate password strength and illegal characters
  },
  email: function (event) { // on 'input'
      var c_p = $(this).getCursorPosition();
      //	check format
      var valid = parseEmailInput(this.value);
      this.value = valid;
      $(this).setCursorPosition(c_p);
  },
  ignoreEnter : function (event) { // on 'keydown'
      event.which == 13 && event.preventDefault();
  },
  addErrorMsg:function(){
    
  }
};


