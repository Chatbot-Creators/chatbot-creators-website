const btnOrder = document.getElementById('send-btn')
// Sending form to server
btnOrder.onclick = async function () {
    const form = document.getElementById('order-form')
    const firstName = form.firstName.value
    const lastName = form.lastName.value
    const phone = form.phone.value
    const email = form.email.value
    const message = form.message.value
    const orderInfo = {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email,
        message: message
    }
    const orderInfoJSON = JSON.stringify(orderInfo)
    console.log(orderInfoJSON)
    const response = await fetch('/api/joborder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: orderInfoJSON
    })
    if (response.ok) {
        console.log(await response.json())
    }
}

//Smooth scrolling and header changing
 $(document).ready(function () {
    $(document).on("scroll", onScroll);

    //smoothscroll
    $('a[href^="#"]').on('click', function (e) {
        e.preventDefault();
        $(document).off("scroll");

        $('a').each(function () {
            $(this).removeClass('active');
        })
        $(this).addClass('active');

        var target = this.hash,
            menu = target;
        $target = $(target);
        $('html, body').stop().animate({
            'scrollTop': $target.offset().top+2
        }, 650, 'swing', function () {
            window.location.hash = target;
            $(document).on("scroll", onScroll);
        });
    });
});

function onScroll(event){
    var scrollPos = $(document).scrollTop();
    $('#top-menu a').each(function () {
        var currLink = $(this);
        var refElement = $(currLink.attr("href"));
        if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
            $('top-menu ul li a').removeClass("active");
            currLink.addClass("active");
        }
        else{
            currLink.removeClass("active");
        }
    });
}
