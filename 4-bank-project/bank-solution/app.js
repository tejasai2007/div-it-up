const routes = {
    '/login': { templateId: 'login' },
    '/dashboard': { templateId: 'dashboard' , init:refresh},
    '/credits':{templateId:'credits'}
  };
  let state = Object.freeze({
    account: null
  });
 
  const storageKey = 'savedAccount';

  function updateRoute() {
    
    const path = window.location.pathname;
    console.log(path);
    const route = routes[path];

    document.title=route.templateId;

    
  
    const template = document.getElementById(route.templateId);
    if(template.content){
    const view = template.content.cloneNode(true);
    const app = document.getElementById('app');
    app.innerHTML = '';
    app.appendChild(view);
    }
    if(path==='/dashboard') {
        console.log('Dashboard is Shown')
        if(!state.account){
          return logout();
          
      }
      updateDashboard();

  }
    if (!route) {
        return navigate('/dashboard');
    }
    if (typeof route.init === 'function') {
      route.init();
    }
  }
  function navigate(path) {
    window.history.pushState({}, path, path);
    console.log('navigate');
    updateRoute();
  } 
  function onLinkClick(event) {
    event.preventDefault();
    navigate(event.target.href);
  }
  window.onpopstate = () => {console.log('popstate');updateRoute();}


  
  async function register() {
    const registerForm = document.getElementById('registerForm');
    const formData = new FormData(registerForm);
    const jsonData = JSON.stringify(Object.fromEntries(formData));
    const result = await createAccount(jsonData);
    

    if (result.error) {
      alert(result.error);
      console.log(result.erroe)
      
    }
    updateState('account', result);

    console.log('Account created!', result);
    navigate('/dashboard');
  }

  
  

  async function createAccount(account) {
    try {
      const response = await fetch('//localhost:5000/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: account
      });
      return await response.json();
    } catch (error) {
      return { error: error.message || 'Unknown error' };
    }
  }


  async function login() {
    const loginForm = document.getElementById('loginForm')
    const user = loginForm.user.value;
    const data = await getAccount(user);
  
    if (data.error) {
      return updateElement('loginError', data.error);
    }
  
    updateState('account', data);
    navigate('/dashboard');
  }
  async function getAccount(user) {
    try {
      const response = await fetch('//localhost:5000/api/accounts/' + encodeURIComponent(user));
      return await response.json();
    } catch (error) {
      return { error: error.message || 'Unknown error' };
    }
  }

  function updateElement(id, textOrNode) {
    const element = document.getElementById(id);
    element.textContent = '';
    element.append(textOrNode);
  }

  function updateDashboard() {
    const account = state.account;
    if (!account) {
      console.log('updatedashboard no account');
    }
    console.log('updated')
    updateElement('description', account.description);
    updateElement('balance', account.balance.toFixed(2));
    updateElement('currency', account.currency);

    const transactionsRows = document.createDocumentFragment();
    for (const transaction of account.transactions) {
      const transactionRow = createTransactionRow(transaction);
      transactionsRows.appendChild(transactionRow);
}
    updateElement('transactions', transactionsRows);

  }

  function createTransactionRow(transaction) {
    const template = document.getElementById('transaction');
    const transactionRow = template.content.cloneNode(true);
    const tr = transactionRow.querySelector('tr');
    console.log(transaction.date)
    tr.children[0].textContent = transaction.date;
    tr.children[1].textContent = transaction.object;
    tr.children[2].textContent = transaction.amount;
    console.log(transactionRow)
    return transactionRow;
  }

function updateState(property, newData) {
  console.log("called",newData)
  state = Object.freeze({
    ...state,
    [property]: newData
  });
  localStorage.setItem(storageKey, JSON.stringify(state.account));
}


async function addTransaction(){
  const account = state.account;
  const form=document.getElementById('transactionForm'); 
  const formData = new FormData(form);
  const jsonData = JSON.stringify(Object.fromEntries(formData));
  

  try {
    
    const response = await fetch('//localhost:5000/api/accounts/'+encodeURIComponent(account.user)+'/transactions', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: jsonData
    });
    console.log('out');
    //updateDashboard();
    refresh()
    return await response.json();
  } catch (error) {
    return { error: error.message || 'Unknown error' };
  }

}

function logout() {

  updateState('account', null);
  navigate('/login');
  console.log('logged out')
}

function init() {
  // Restore state
  const savedState = localStorage.getItem(storageKey);
  if (savedState) {
    updateState('account', JSON.parse(savedState));
  }

  // Update route for browser back/next buttons
  window.onpopstate = () => updateRoute();
  updateRoute();
}

init();

async function updateAccountData() {
  const account = state.account;
  if (!account) {
    console.log('updateAppData no account');
    return logout();
  }

  const data = await getAccount(account.user);
  if (data.error) {
    console.log('updateAppData data error');

    return logout();
  }

  updateState('account', data);
}

async function refresh() {
  await updateAccountData();
  updateDashboard();
}

function pop(){
  const pop=document.getElementById("popup");
  pop.style.display='flex';
  console.log('yes');
}

function popc(){
  const pop=document.getElementById("popup");
  const form=document.getElementById('transactionForm'); 
  form.reset();
  pop.style.display='none';
  console.log('no');
}







