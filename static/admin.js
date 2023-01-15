const root = document.getElementById('root')
const domain = ''

const loginPage = /* html */`
<form class="login-form" onsubmit="loginSubmit(event)">
  <div>
    <label for="login" class="form-label">Имя</label>
    <input type="text" class="form-control" id="login" aria-describedby="loginHelp" name="login">
  </div>
  <div>
    <label for="password" class="form-label">Пароль</label>
    <input type="password" class="form-control" id="password" name="password">
  </div>
  <button type="submit" class="btn btn-primary btn-login">Войти в панель управления</button>
</form>`

function ordersPage(orders = []) {
  return /* html */`
    <table class="table">
    <thead>
      <tr>
        <th scope="col">ID</th>
        <th scope="col">Имя</th>
        <th scope="col">Фамилия</th>
        <th scope="col">Телефон</th>
        <th scope="col">Email</th>
        <th scope="col">Сообщение</th>
      </tr>
    </thead>
    <tbody>
      ${orders.map((order) => {
        return /* html */`
        <tr>
          <th scope="row">${order.id}</th>
          <td>${order.firstName}</td>
          <td>${order.lastName}</td>
          <td>${order.phone}</td>
          <td>${order.email}</td>
          <td>${order.message}</td>
        </tr>
        `
      }).join('')}
    </tbody>
    </table>
  `
} 

// root.innerHTML = loginPage

async function loginSubmit(event) {
  event.preventDefault()
  const form = event.target
  const loginValue = form.login.value;
  const passwordValue = form.password.value;
  const response = await fetch(`${domain}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: loginValue,
      password: passwordValue
    })
  })
  if (response.ok) {
    const tokenInfo = await response.json()
    localStorage.setItem('Token', tokenInfo.token)
    renderOrders()
  }
}

async function renderOrders() {
  const token = localStorage.getItem('Token')
  if (token) {
    const response = await fetch(`${domain}/api/joborder`, {
      headers: {
        'Authorization': token
      }
    })
    if (response.ok) {
      const orders = await response.json()
      const ordersHtml = ordersPage(orders)
      root.innerHTML = ordersHtml
    } else {
      root.innerHTML = loginPage
    }
  } else {
    root.innerHTML = loginPage
  }
}

renderOrders()