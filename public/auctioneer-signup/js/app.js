
var updateStripePlan = function(plan)
{
    if ('basic' === plan.id.toLowerCase().slice(0,5))
    {
        $('input[name=plan]').val('basic');
        $('#pro').hide();
        $('#basic').show();
        // $('#proplan_enabler').hide();
    }
    else
    {
        $('input[name=plan]').val('pro');
        $('#pro').show();
        $('#basic').hide();
        // $('#proplan_enabler').show();
    }
    $('input[name=PlanAmount]').val(plan.amountDecimal);

    console.log({
        updateStripePlan:plan,
    });

};
    // $('#Pro_plan').prop('disabled', true); // disabled pro plan for 2.0 release

var updateStripePlanSelect = function(plan)
{
    $('[name=stripe_plan]').val(plan.id);

    console.log({
        updateStripePlanSelect:plan,
    });
    updateStripePlan(plan);
};

/* global var planOptions = [] */
var getStripePlan = function(id)
{
    if (typeof id === 'object')
    {
        var o = id;
        var planCandidates = planOptions.filter(function(plan)
        {
            if (o.bidders && plan.bidders != o.bidders)
            {
                return false;
            }
            if (o.amount && plan.amountDecimal != o.amount)
            {
                return false;
            }
            if (o.basic===1 && 'basic' !== plan.id.toLowerCase().slice(0,5))
            {
                return false;
            }
            else if (o.basic===0 && 'basic' === plan.id.toLowerCase().slice(0,5))
            {
                return false;
            }
            return true;
        });
        if (planCandidates.length === 1)
        {
            return planCandidates[0];
        }
    }
    else
    {
        id = id || $('[name=stripe_plan]').val();
        for (var i=0;i<planOptions.length;i++)
        {
            if (id.toLowerCase() === planOptions[i].id.toLowerCase())
            {
                return planOptions[i];
            }
        }
    }
};
// var addressJson=require('json/addressField.json');

require.config({
    paths: {
        'addressJson': 'json/addressField.json'
    }
});
require(['addressJson'], function (addressJson) {
    console.log({addressJson:addressJson});
    //foo is now loaded.
//     $('[name="form-country"]').select({
//     placeholder: 'Select an Country',
//     allowClear:false,
//     selectOnClose: true,
//     data:addressJson.options.map(function(data){ return {id:data.iso, text:data.label}; })
// }).val('US');

});
// var json = require('./data.json');


 $('#secondFieldset').addressfield({
  json: 'json/addressField.json',
  fields: {
    country: '.form-country',
    administrativearea: '.bfh-states',
    postalcode: '.form-zip',
    localityname:'.form-city',
    thoroughfare:'.form-address',
  },
});
 
$(document).ready(function() {
    var selectors = "#slider1,#slider2";


    // Slider function
    $(selectors).slider({
        value: 50,
        min: 50,
        max: 500,
        range: "min",
        step: 25,
        disabled: true, // Disabled for 2.0 release

        // animate:true,
        slide: function(event, ui) {
            $("#bidders").val(ui.value);
            var bidders = $("#bidders").val();
            var plan = getStripePlan({
                bidders:bidders,
                basic:0,
            });

            $('.slideramount').text(plan.amountDecimal);
            $('.bidders').text('\t' + bidders);

            $(selectors).each(function() {
                if ($('#slider1').val(ui.value) != $('#slider2').val(ui.value))
                {
                    $('#slider2').slider("option", "value", bidders);
                }
            });
            $('input[name=bidders]').val($("#bidders").val());
            // console.log({slideramount:plan.amountDecimal,plan:plan});
            $('input[name=PlanAmount]').val(plan.amountDecimal);
            updateStripePlanSelect(plan);
        }
    });

});

    // Removes repeated validation message 

    $(".removeMessagebag").click(function() {
    
        $(' #messagebag ').remove();

    });
 

$('body').on('input','select[name=stripe_plan]',function()
{
    var plan = getStripePlan()||getStripePlan({basic:1});

     updateStripePlan(plan);
});


$("#loadingModal").modal({
        keyboard: false,
        backdrop: 'static',
        show: false
    });

//  Plan decider
$("#Basic_plan").click(function() {
    var plan = getStripePlan({basic:1});
    updateStripePlanSelect(plan);
    
});
$("#Pro_plan").click(function() {
    var plan = getStripePlan({
        basic:0,
        bidders:$('input[name=bidders]').val()||50,
    });
    updateStripePlanSelect(plan);
    

});

// Validation

var oldHouseName = "";
$("body").on("focus", "[name=auction_house_name]", function() {

    oldHouseName = slug($(this).val());
    // console.log("focus:house_name:" + oldHouseName);

});

// @todo https://www.npmjs.com/package/slug
var slug = function(str)
{
    return (str||'')
        .replace(/[^a-z0-9\s]/gi, '')
        .replace(/[_\s]/g, '')
        .toLowerCase()
        ;
};

$("body").on("keyup", "[name=auction_house_name]", function() {

    if (oldHouseName == $('[name=first_domain_level]').val())
    {
        oldHouseName = slug($(this).val());
        // console.log("keyup:house_name:" + oldHouseName);
        changeHouseUrlText(oldHouseName);
    }
});

$("body").on("keyup blur", "[name=first_domain_level]", function() {
    changeHouseUrlText($(this).val());
});


var firstDomainLevel = function(domain)
{
    var indexOfDot = domain.indexOf('.');
    if (indexOfDot > 0)
    {
        return domain.slice(0,indexOfDot);
    }
    return '';
};

var updateHouseAvailableDOM = function($input,$fg,domain,is_available)
{
    $fg[is_available ?'addClass':'removeClass']('has-success');
    $fg[is_available?'removeClass':'addClass']('has-error');
    $fg[is_available==='Ap_not_available'?'addClass':'removeClass']('has-warning');

    $('.when-instance-domain-is-available')[is_available && is_available !='Ap_not_available'?'show':'hide']();
    $('.when-instance-domain-is-not-available')[is_available ?'hide':'show']();
    $('.when-Ap-is-not-available')[is_available==='Ap_not_available'?'show':'hide']();

};

var alertTriggersOnDuplicates = $.debounce(350,function()
{

    !email_trigger?'':bootbox.alert('The email you are using is already in use by another auction house. If you would like to create an additional house, please email support at <a href="mailto:help@sharpauctionengine.com" target="_top">help@sharpauctionengine.com </a>.');
    // is_available?'':bootbox.alert('Have you already created an auction house? Our software indicates that your <a href=http://'+domain+' target="_blank">'+domain+'</a> is similar to <a href=http://'+domain+' target="_blank">'+domain+'</a> on file. If this is your first auction house, please ignore this alert and continue. If you have any questions or need assistance, email us at <a href="mailto:help@sharpauctionengine.com" target="_top">help@sharpauctionengine.com </a> or give us a call at (246)653-5273');
 
     !domain_trigger?'':bootbox.alert('The sub-domain you are requesting is already in use. Please select a new domain or email support at <a href="mailto:help@sharpauctionengine.com" target="_top"> help@sharpauctionengine.com </a> for additional assistance.');
      
});

var checkStatus=0;

$("#checkStatus").click(function() {
   checkStatus=1;
   $("#checkStatus").hide();
   $( ".alert" ).append( "<div class='alert alert-danger alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Heads up!</strong> This page will automatically check the status of your new auction house every 15 seconds. We estimate this to take approximately 30 minutes. When your house has finished being created, this page will automatically redirect to your new site.</div>" );
   $(".statusButton").append("<button class='btn btn-xs btn-primary' id='statusCheck'>Check Status</button>");
 setInterval(function(){ 
    var domain = parseInstanceSubDomain($('[name=first_domain_level]').val()||'');
    var email = $('[name=email]').val();
    isDomainTakenAjax('','','',domain,email); 
}, 15000);  
    
});


var checkHouseStatus=function(status,domain)
{
if(status==='up_running')
{
    $('#statusCheck').removeClass();
    $('#statusCheck').addClass('btn-success');

    window.location='http://'+domain;

}
if(status==='up_failed')
{
  $('#statusCheck').removeClass();  
  $('#statusCheck').addClass('btn-danger');

}
if(status==='up_working')
{
   $('#statusCheck').removeClass();  
   $('#statusCheck').addClass('btn-warning');  
}
if(status==='down_working')
{

}
};
var isDomainTakenAjax = $.debounce(350,function(is_email,$input,$fg,domain,email)
{     
    if (minimumDomainLength >= firstDomainLevel(domain).length )
    {
        console.log('isDomainAvailable('+domain+'): "too short"');
        var is_available = false;
        is_email?'':updateHouseAvailableDOM($input,$fg,domain,is_available);
        

    }
    else
    {
        $.ajax({
            url:"/auctioneer-signup/v1/typeahead/is/domain/available",
            data:{domain:domain, email:email},
            
            complete:function(xhr,textStatus)
            {
                var json = xhr.responseJSON||{};
                var alerts =new MessageBag();
                
                 //xhr.responseText
                //xhr.responseJson
               
                //Main Domain response from node
                if(!checkStatus)
                {
               
                var is_available = xhr.status===200? json.is_available.domain || false:'Ap_not_available';
                updateHouseAvailableDOM($input,$fg,json.domain,is_available);
                
                // Email response from node 
                if(xhr.status===200 )
                {   
                   
                    var fg= $('input[name=email]').parents('.form-group').first();
                    $(' #messagebag ').remove();
                    if(json.is_available.email)
                    {
                          fg.removeClass('has-error');
                          fg.addClass('has-success');
                          email_trigger=0;
                        
                    }
                    else
                    {
                        email_trigger=1;
                        // alertTriggersOnDuplicates(is_available,json.domain,json.is_available.email);
                        fg.removeClass('has-success');
                        alerts.add('email','Email is already in use');
                        alerts.sprinkle('form:first');
                      


                        
                    }
                    
                }
                // 
               
               domain_trigger=is_available?0:1
           }
                checkStatus?checkHouseStatus(json.auc_bal_params.status,json.domain):'';
               console.log('isDomainAvailable('+json.domain+'):'+(is_available?1:0));
               console.log('isEmailAvailable('+json.email+'):'+(is_available?1:0));
               
               
               
            }
            
        });
    }
});
var stripWWW = function(domain)
{
    if (domain.slice(0,4)==='www.')
    {
        return stripWWW(domain.slice(4));
    }
    return domain;
};
var parseInstanceSubDomain = function(domain)
{
    return stripWWW(domain) + '.' + instanceParentDomain;
};

$("body").on("input", "[name=first_domain_level],[name=email]", function() {
    var $input = $(this);
    var domain = parseInstanceSubDomain($('[name=first_domain_level]').val()||'');
    var email = $('[name=email]').val();
    var is_email= email?1:0;
    $('[name=main_domain]').val(domain);
    isDomainTakenAjax(is_email,$input,$input.parents('.form-group').first(),domain,email);
});

var changeHouseUrlText = function (UrlText) {
    UrlTextSlugged = slug($.trim(UrlText));
    var $firstLevelDomain = $('[name=first_domain_level]');
    if (UrlTextSlugged)
    {
        $firstLevelDomain.css({
            // width: '58%',
        });
        $('#ghost_text').css({
            display: '',
            width: '30%',
            'font-weight': 'bolder',
        });

        $firstLevelDomain.val(UrlTextSlugged);
        $('.hint_house_url').text(UrlTextSlugged);
    } else {
        // $firstLevelDomain.css('width', '90%');
        $('#ghost_text').css('display', 'none');
        $('.hint_house_url').text('example');
    }
    $firstLevelDomain.trigger('input');
};

$('[name=first_domain_level]').on('shown.bs.popover', function() {
    if ($.trim($(this).val()))
    {
        $('.hint_house_url').text($(this).val());
    }
});


$('.form-group input').popover({
    trigger: "focus",
    delay: {
        show: 600,
        hide: 400
    },
    placement: 'top',
    html: true,
});

var denormalizeCardExp = function (event) {
    // console.log("true");
    var $year = $('[data-stripe="exp-year"]');
    var $month = $('[data-stripe="exp-month"]');

    $year.val('');
    $month.val('');

    var value = $(this).val().replace(/\D/g, '');

    console.log($(this).val());

    if (!{
            4: 1,
            6: 1
        }[value.length]) {
        console.log('invalid!');
         // bootbox.alert("Your card's expiration year is invalid");
        return;
    }

    $month.val(value.substr(0, 2));

    value = value.substr(2);

    if (value.length == 2) {
        value = '20' + value;
    }

    $year.val(value);
    console.log({
        month: $month.val(),
        year: $year.val(),
    });

    console.log(value);
};
$('body').on('keyup', 'form [data-is-sae-card-exp=1]', denormalizeCardExp);
// Stripe.setPublishableKey('pk_test_Gs3mml7J0sPmODW6ZS8o8R3h');
function pfWarnNoStripe() {
    Alert.warning('It looks like you are running an outdated browser or blocking scripts. ' +
      'Please update your browser or add "stripe" to your browser\'s whitelist.');
}

if (typeof Stripe == 'undefined') {
    pfWarnNoStripe();
} else {
    // https://stripe.com/docs/stripe.js
    Stripe.setPublishableKey(stripePublishableKey);
}
jQuery(function($) {
    // $('#paymentMethodForm').click(function (event) { //ch
    $('.registration-form .btn-stripe').on('click', function(event) {
        // console.log(this);
        if ($.trim($('input[data-stripe="number"]').val())) {
            var vResult = $('input[data-stripe="number"]').validateCreditCard();
            console.log(vResult);
            if (!vResult.valid) {
                // bootbox.alert('Please verify your card information.');
                bootbox.alert('Please verify your card information.');
                return false;
            }
        }

        var $form = $(this).parents('form').first();

        var cc = 0;
        $form.find('[data-stripe]').each(function(i, e) {
            if ($(e).val() !== '') cc++;
        });

        $("#loadingModal").modal('show');

        // if (cc==0 || $form.attr('data-is-ready')=='1') return true;

        // Disable the submit button to prevent repeated clicks
        $form.find('button,input[type=button]').prop('disabled', true);

        Stripe.card.createToken($form, stripeResponseHandler);

        // Prevent the form from submitting with the default action
        return false;
    });
});

function stripeResponseHandler(status, response) {

    var $form = $('#paymentMethodForm');

    $("#loadingModal").modal('hide');

    if (response.error) {

        // Show the errors on the form
        bootbox.alert(response.error.message);
        // $form.find('.payment-errors').text(response.error.message);
        $form.find('button,input[type=button]').prop('disabled', false);
    } else {
        console.log('time to submit!');


        // response contains id and card, which contains additional card details
        var token = response.id;

        // Insert the token into the form so it gets submitted to the server
        $('input[name=stripeToken]').val(token);
         console.log($form.serialize());
        var validate_field='lastpage';
        ajaxCallToAp($form.serialize(),validate_field);
        // $form.append($('<input type="hidden" name="stripeToken" />').val(token));
        // and submit
        // $form.get(0).submit();
        // $.ajax({
        //     url: "/auctioneer-signup/v1/submit",
        //     method: 'POST',
        //     data: $form.serialize(),
        //     // _token: $form.find('[name=_token]').val(),
        //     //          gateway:'stripe',
        //     //          stripe:response

        //     // ,
        //     // data:{
        //     //     _token: $form.find('[name=_token]').val(),
        //     //     gateway:'stripe',
        //     //     stripe:response
        //     // },
        //     beforeSend: function(json) {
        //         $("#loadingModal").modal('show');
                
        //     },
        //     complete: function(xhr, textStatus) {
        //         $("#loadingModal").modal('hide');
                
        //         //xhr.responseText
        //         //xhr.responseJson
        //     },
        //     success: function(json, textStatus, xhr) {
        //              var parent_fieldset = $('.registration-form .finalfieldset');
        //              var next_step = true;
        
        
        //               if( next_step ) {

        //                  parent_fieldset.fadeOut(400, function() {
                               
        //              $(this).next().fadeIn();
        //           });
        //             }
        //          },
        //          // console.log(json);
        //         // $form.attr('data-is-ready',1); //ch

        //         // $('#paymentMethodForm').submit(); //ch
        //         // $("#congrats").modal('show');
                
                
            
        //     error: function(xhr, textStatus, errorThrown) {
        //         var validationText ='';
        //         var alerts =new MessageBag();
        //         console.error({
        //             textStatus: textStatus,
        //             'xhr.response': xhr.responseJSON || xhr.responseText,
        //             errorThrown:errorThrown,
        //         });
        //         //xhr.responseText
        //         //xhr.responseJSON
                
        //         if(xhr.status==400)
        //         {   
        //             $form.find('button,input[type=button]').prop('disabled', false);

        //             if(xhr.responseText === 'Duplicate_Email')
        //             {

        //                 bootbox.alert('Your email address already in use! Please try again then contact support.');
        //                 $('#email').removeClass('input-success');
        //                 $('#email').addClass('has-error');
        //                 return;
        //             }

        //             if(xhr.responseJSON.errors)
        //             {
        //             jQuery.each(xhr.responseJSON.errors, function(key, value) {
                     
        //              validationText += value.message;

        //              alerts.add(value.field,value.message);

        //             });
        //              alerts.sprinkle('form:first');

                    

        //             bootbox.alert('There are validation errors.Please click on previous button to review errors');

        //             return ;
        //             }

        //         }
        //         bootbox.alert('There was an ISE error! Please try again then contact support.');
                
        //         //typeof ReportError == 'function' && ReportError((xhr.responseText || "register failure"), (xhr.responseJSON || {}));
        //     }
        // });
    }
}
var email_trigger=0;
var domain_trigger=0;
$("#firstFieldsetValidation").click(function() {
    
var $firstFieldsetInput =$("#firstFieldset");
           email_trigger?'': $(' #messagebag ').remove();
            email_trigger?'':$('.form-group').removeClass('has-error');
            var validate_field='profile';
            console.log($firstFieldsetInput.serialize());
            (email_trigger===1 || domain_trigger===1)? alertTriggersOnDuplicates():ajaxCallToAp($firstFieldsetInput.serialize(),validate_field);
           
    
});
$("#secondFieldsetValidation").click(function() {
    
   var $secondFieldsetInput =$("#secondFieldset");
            var validate_field='Additional_Info';
            $(' #messagebag ').remove();
            $('.form-group').removeClass('has-error');
            console.log($secondFieldsetInput.serialize());
            ajaxCallToAp($secondFieldsetInput.serialize(),validate_field);
    
});
 var ajaxCallToAp = $.debounce(450,function($data,validate_field)
{   
    var $form = $('#paymentMethodForm');
    
  $.ajax({
            url: "/auctioneer-signup/v1/submit",
            method: 'POST',
            data: $data+"&validate_field="+validate_field,
            beforeSend: function(json) {
                $("#loadingModal").modal('show');
                
            },
            complete: function(xhr, textStatus) {
                $("#loadingModal").modal('hide');
                
                //xhr.responseText
                //xhr.responseJson
            },
            success: function(json, textStatus, xhr) {
                    var button_next='';
                    if(validate_field==='profile')
                        { 
                            button_next='firstFieldset';
                        }
                    if(validate_field==='Additional_Info')
                        { 
                            button_next='secondFieldset';
                        }
                    if(validate_field==='lastpage')
                        { 
                            button_next='finalfieldset';
                            $form.find('button,input[type=button]').prop('disabled', false);
                        }
    
                     var parent_fieldset = $('.registration-form .'+button_next);
                     var next_step = true;
        
        
                      if( next_step ) {

                         parent_fieldset.fadeOut(400, function() {
                               
                     $(this).next().fadeIn();
                  });
                    }
                 },
                          
            
            error: function(xhr, textStatus, errorThrown) {
                var validationText ='';
                var alerts =new MessageBag();
                console.error({
                    textStatus: textStatus,
                    'xhr.response': xhr.responseJSON || xhr.responseText,
                    errorThrown:errorThrown,
                });
                var json= xhr.responseJSON || xhr.responseText ||{};
                //xhr.responseText
                //xhr.responseJSON
                
                if(xhr.status==400)
                {   
                    $form.find('button,input[type=button]').prop('disabled', false);

                    if(xhr.responseText === 'Duplicate_Email')
                    {

                        bootbox.alert('Your email address already in use! Please try again then contact support.');
                        $('#email').removeClass('input-success');
                        $('#email').addClass('has-error');
                        return;
                    }

                    if(xhr.responseJSON.errors)
                    {

                    jQuery.each(xhr.responseJSON.errors, function(key, value) {
                     alerts.add(value.field,value.message);

                    });
                     alerts.sprinkle('form:first');

                    

                    bootbox.alert('There are validation errors. Please click on previous button to review errors');

                    return ;
                    }

                }
                bootbox.alert('There was an ISE error! Please try again then contact support.');
                
            }
        });
});