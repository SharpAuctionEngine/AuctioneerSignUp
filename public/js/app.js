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

$(document).ready(function() {
    var selectors = "#slider1,#slider2";


    // Slider function
    $(selectors).slider({
        value: 50,
        min: 50,
        max: 500,
        range: "min",
        step: 25,
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


    $(".removeMessagebag").click(function() {
    
        $(' #messagebag ').remove();

    });
 

$('body').on('input','select[name=stripe_plan]',function()
{
    var plan = getStripePlan()||getStripePlan({basic:1});

     updateStripePlan(plan);
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
    $fg[is_available?'addClass':'removeClass']('has-success');
    $fg[is_available?'removeClass':'addClass']('has-error');
    $('.when-instance-domain-is-available')[is_available?'show':'hide']();
    $('.when-instance-domain-is-not-available')[is_available?'hide':'show']();
};

var isDomainTakenAjax = $.debounce(350,function($input,$fg,domain)
{
    if (minimumDomainLength >= firstDomainLevel(domain).length)
    {
        console.log('isDomainAvailable('+domain+'): "too short"');
        var is_available = false;
        updateHouseAvailableDOM($input,$fg,domain,is_available);
    }
    else
    {
        $.ajax({
            url:"/auctioneer-signup/v1/typeahead/is/domain/available",
            data:{domain:domain},
            complete:function(xhr,textStatus)
            {
                var json = xhr.responseJSON||{};
                //xhr.responseText
                //xhr.responseJSON
                // console.log([json,$input,$fg,domain]);
                var is_available = json.is_available||false;

                console.log('isDomainAvailable('+json.domain+'):'+(is_available?1:0));
                updateHouseAvailableDOM($input,$fg,json.domain,is_available);
            },
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

$("body").on("input", "[name=first_domain_level]", function() {
    var $input = $(this);
    var domain = parseInstanceSubDomain($input.val()||'');

    $('[name=main_domain]').val(domain);

    isDomainTakenAjax($input,$input.parents('.form-group').first(),domain);

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
        // $form.append($('<input type="hidden" name="stripeToken" />').val(token));
        // and submit
        // $form.get(0).submit();
        $.ajax({
            url: "/auctioneer-signup/v1/submit",
            method: 'POST',
            data: $form.serialize(),
            // _token: $form.find('[name=_token]').val(),
            //          gateway:'stripe',
            //          stripe:response

            // ,
            // data:{
            //     _token: $form.find('[name=_token]').val(),
            //     gateway:'stripe',
            //     stripe:response
            // },
            beforeSend: function(json) {
                $("#loadingModal").modal('show');
                
            },
            complete: function(xhr, textStatus) {
                $("#loadingModal").modal('hide');
                
                //xhr.responseText
                //xhr.responseJson
            },
            success: function(json, textStatus, xhr) {
                    console.log('success ajax');
                     var parent_fieldset = $('.registration-form .finalfieldset');
                     var next_step = true;
        
        
                      if( next_step ) {

                         parent_fieldset.fadeOut(400, function() {
                               
                     $(this).next().fadeIn();
                  });
                    }
                 },
                 // console.log(json);
                // $form.attr('data-is-ready',1); //ch

                // $('#paymentMethodForm').submit(); //ch
                // $("#congrats").modal('show');
                
                
            
            error: function(xhr, textStatus, errorThrown) {
                var validationText ='';
                var alerts =new MessageBag();
                console.error({
                    textStatus: textStatus,
                    'xhr.response': xhr.responseJSON || xhr.responseText,
                    errorThrown:errorThrown,
                });
                //xhr.responseText
                //xhr.responseJSON
                
                if(xhr.status==400)
                {   
                    $form.find('button,input[type=button]').prop('disabled', false);

                    if(xhr.responseText === 'Duplicate_Email')
                    {

                        bootbox.alert('Your email address already in use! Please try again then contact support.');
                        return;
                    }

                    if(xhr.responseJSON.errors)
                    {
                    jQuery.each(xhr.responseJSON.errors, function(key, value) {
                     
                     validationText += value.message;

                     alerts.add(value.field,value.message);

                    });
                    alerts.sprinkle('form:first');

                    

                    bootbox.alert('There are validation errors.Please click on previous button to review errors');

                    return ;
                    }

                }
                bootbox.alert('There was an error! Please try again then contact support.');
                
                //typeof ReportError == 'function' && ReportError((xhr.responseText || "register failure"), (xhr.responseJSON || {}));
            }
        });
    }
}
