const btnOrder = document.getElementById('send-btn')

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