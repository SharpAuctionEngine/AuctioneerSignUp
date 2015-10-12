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
            slideramount = Number(bidders) + Number(90);
            // $("#slideramount").val(slideramount);
            $('.slideramount').text(slideramount);
            $('.bidders').text('\t' + bidders);
            //  console.log(bidders);
            // console.log(this);
            // $slider = $(this);
            // $slider.attr('id');
            // $('#slider1').data().uiSlider.options.value
            $(selectors).each(function() {
                if ($('#slider1').val(ui.value) != $('#slider2').val(ui.value)) {
                    $('#slider2').slider("option", "value", bidders);
                }
            });
            $('input[name=bidders]').val($("#bidders").val());
            console.log(slideramount);
            $('input[name=PlanAmount]').val(slideramount);
        }
    });

});


//  Plan decider
$("#Basic_plan").click(function() {
    $('#pro').hide();
    $('#basic').show();
    $('input[name=plan]').val('basic');
    $('input[name=PlanAmount]').val(99);

});
$("#Pro_plan").click(function() {
    $('input[name=plan]').val('pro');
    $('input[name=bidders]').val(50);
    $('input[name=PlanAmount]').val(140);
});
// Validation

var oldHouseName = "";
$("body").on("focus", "#house_name", function() {

    oldHouseName = $(this).val().replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '').toLowerCase();
    // console.log("focus:house_name:" + oldHouseName);

});

$("body").on("keyup", "#house_name", function() {

    if (oldHouseName == $('#house_url').val()) {
        oldHouseName = $(this).val().replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '').toLowerCase();
        // console.log("keyup:house_name:" + oldHouseName);
        changeHouseUrlText(oldHouseName);
    }
});
/*
 $("body").on("blur", "#house_name", function () {
    if (oldHouseName  == $('#house_url').val()) {g
     changeHouseUrlText($(this));
   }

 });*/

$("body").on("keyup", "#house_url", function() {
    changeHouseUrlText($(this).val().replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '').toLowerCase());
    // console.log("keyUp:house_url:"+$(this).val() );
});
$("body").on("blur", "#house_url", function() {
    if (!$.trim($(this).val())) {
        changeHouseUrlText($("#house_name").val().replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '').toLowerCase());
        // console.log("blur:house_url:"+$("#house_name").val() );
    }
});

function changeHouseUrlText(UrlText) {
    if ($.trim(UrlText)) {
        $('#house_url').css({
            // width: '58%',

        });
        $('#ghost_text').css({
            display: '',
            width: '30%',
            'font-weight': 'bolder',
        });

        $('#house_url').val(UrlText);
        $('.hint_house_url').text(UrlText);
    } else {
        $('#house_url').css('width', '90%');
        $('#ghost_text').css('display', 'none');
        $('.hint_house_url').text('example');
    }
}

$('#house_url').on('shown.bs.popover', function() {
    if ($.trim($(this).val())) {
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

function denormalizeCardExp(event) {
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
}
$('body').on('keyup', 'form [data-is-sae-card-exp=1]', denormalizeCardExp);
// Stripe.setPublishableKey('pk_test_Gs3mml7J0sPmODW6ZS8o8R3h');
function pfWarnNoStripe() {
    Alert.warning('It looks like you are running an outdated browser or blocking scripts. \
   Please update your browser or add "stripe" to your browser\'s whitelist.');
}

if (typeof Stripe == 'undefined') {
    pfWarnNoStripe();
} else {
    // https://stripe.com/docs/stripe.js
    Stripe.setPublishableKey('pk_test_Gs3mml7J0sPmODW6ZS8o8R3h');
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
                alert('Please verify your card information.');
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

        $form.find('.payment-errors').text(response.error.message);
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

                alert('There was an error! Please try again then contact support.');

                typeof ReportError == 'function' && ReportError((xhr.responseText || "register failure"), (xhr.responseJSON || {}));
            }
        });
    }
}
