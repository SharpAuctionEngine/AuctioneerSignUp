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
    $('select[name=stripe_plan]').val(plan.id);

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
        id = id || $('select[name=stripe_plan]').val();
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
$("body").on("focus", "#house_name", function() {

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

$("body").on("keyup", "#house_name", function() {

    if (oldHouseName == $('#house_url').val()) {
        oldHouseName = slug($(this).val());
        // console.log("keyup:house_name:" + oldHouseName);
        changeHouseUrlText(oldHouseName);
    }
});

$("body").on("keyup blur", "#house_url", function() {
    changeHouseUrlText($(this).val());
});


var isDomainTakenAjax = $.debounce(350,function($input,$fg,domain)
{
    $.ajax({
        url:"/auctioneer-signup/v1/typeahead/is/domain/available",
        data:{domain:domain},
        complete:function(xhr,textStatus){
            var json = xhr.responseJSON||{};
            //xhr.responseText
            //xhr.responseJSON
            console.log([json,$input,$fg,domain]);
        },
    });
});

$("body").on("input", "[name=auction_house_name_url]", function() {
    var $input = $(this);

    isDomainTakenAjax($input,$input.parents('.form-group').first(),$input.val());

});

var changeHouseUrlText = function (UrlText) {
    UrlTextSlugged = slug($.trim(UrlText));

    if (UrlTextSlugged) {
        $('#house_url').css({
            // width: '58%',
        });
        $('#ghost_text').css({
            display: '',
            width: '30%',
            'font-weight': 'bolder',
        });

        $('#house_url').val(UrlTextSlugged);
        $('.hint_house_url').text(UrlTextSlugged);
    } else {
        // $('#house_url').css('width', '90%');
        $('#ghost_text').css('display', 'none');
        $('.hint_house_url').text('example');
    }
};

$('#house_url').on('shown.bs.popover', function() {
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
        console.log(this);
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
            url: "/auctioneer-signup/submit",
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


                // console.log(json);
                // $form.attr('data-is-ready',1); //ch

                // $('#paymentMethodForm').submit(); //ch
                $("#congrats").modal('show');
            },
            error: function(xhr, textStatus, errorThrown) {
                console.error({
                    textStatus: textStatus,
                    'xhr.response': xhr.responseJSON || xhr.responseText
                });
                //xhr.responseText
                //xhr.responseJSON

                bootbox.alert('There was an error! Please try again then contact support.');

                //typeof ReportError == 'function' && ReportError((xhr.responseText || "register failure"), (xhr.responseJSON || {}));
            }
        });
    }
}
