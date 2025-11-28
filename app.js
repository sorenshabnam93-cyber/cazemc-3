// Basic store logic: load settings + products, render products, cart + IGN login

// state
let PRODUCTS = [];
let CART = JSON.parse(localStorage.getItem('cazemc_cart')||'[]');
let IGN = localStorage.getItem('cazemc_ign') || null;

// utility
function $(s){return document.querySelector(s)}
function $all(s){return Array.from(document.querySelectorAll(s))}

// settings (optional)
async function loadSettings(){
  try{
    const r = await fetch('settings.json'); if(!r.ok) return;
    const s = await r.json();
    if(s.logo) $all('.brand img').forEach(i=>{ if(i) i.src = s.logo});
    document.title = (s.serverName? s.serverName + ' Store': document.title);
  }catch(e){ /* ignore */ }
}

// products
async function loadProducts(){
  try{
    const r = await fetch('products.json');
    PRODUCTS = await r.json();
  }catch(e){
    PRODUCTS = [];
  }
  renderProducts();
  updateCartBadge();
}

// render
function renderProducts(filter='', category='all'){
  const container = $('#products');
  if(!container) return;
  container.innerHTML = '';
  const list = PRODUCTS.filter(p=>{
    const okCat = (category==='all' || p.category===category);
    const okFilter = (p.title.toLowerCase().includes(filter.toLowerCase()) || p.description.toLowerCase().includes(filter.toLowerCase()));
    return okCat && okFilter;
  });
  for(const p of list){
    const el = document.createElement('div'); el.className = 'product';
    el.innerHTML = `
      <img src="${p.image}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p class="muted">${p.description}</p>
      <div class="row"><div class="price">₹${p.price}</div><div><button class="buy" data-id="${p.id}">Buy</button></div></div>
    `;
    container.appendChild(el);
  }
  // attach buy handlers
  $all('.buy').forEach(b=>{
    b.addEventListener('click', e=>{
      const id = e.currentTarget.dataset.id;
      const product = PRODUCTS.find(x=>x.id===id);
      if(product) addToCart(product);
    })
  })
}

// categories
$all('#catList li').forEach(li=>{
  li.addEventListener('click', (e)=>{
    $all('#catList li').forEach(x=>x.classList.remove('active'));
    e.currentTarget.classList.add('active');
    const cat = e.currentTarget.dataset.cat || 'all';
    renderProducts($('#search')? $('#search').value: '', cat);
  })
})

// search
document.addEventListener('input', (e)=>{
  if(e.target && e.target.id==='search'){
    const cat = document.querySelector('#catList li.active')?.dataset?.cat || 'all';
    renderProducts(e.target.value, cat);
  }
})

// cart functions
function updateCartBadge(){
  const badge = $('#cart-count');
  if(badge) badge.textContent = CART.length;
}

function addToCart(product){
  if(!IGN){ openLogin(); return; } // require login
  CART.push({id:product.id,title:product.title,price:product.price,qty:1});
  localStorage.setItem('cazemc_cart', JSON.stringify(CART));
  updateCartBadge();
  alert(`${product.title} added to cart`);
}

function openCart(){
  $('#cartModal').classList.remove('hidden');
  renderCartItems();
}
function closeCart(){ $('#cartModal').classList.add('hidden'); }
function goCart(){ window.location.href = 'cart.html'; }

function renderCartItems(){
  const container = $('#cartItems');
  if(!container) return;
  container.innerHTML = '';
  let total = 0;
  CART.forEach((it, idx)=>{
    total += it.price * (it.qty||1);
    const row = document.createElement('div');
    row.style.display = 'flex'; row.style.justifyContent='space-between'; row.style.padding='8px 0';
    row.innerHTML = `<div>${it.title} x${it.qty||1}</div><div>₹${it.price}</div>`;
    container.appendChild(row);
  });
  $('#cartTotal').textContent = total;
}

// cart page load
function loadCartPage(){
  const cList = $('#cartList');
  if(!cList) return;
  cList.innerHTML = '';
  let total = 0;
  CART.forEach((it, idx)=>{
    total += it.price*(it.qty||1);
    const div = document.createElement('div');
    div.style = 'padding:10px;background:rgba(255,255,255,0.02);border-radius:8px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center';
    div.innerHTML = `<div><strong>${it.title}</strong><div class="muted">₹${it.price}</div></div><div><button onclick="removeCart(${idx})" class="btn">Remove</button></div>`;
    cList.appendChild(div);
  });
  $('#cartTotalPage') && ($('#cartTotalPage').textContent = total);
}

// remove
function removeCart(i){
  CART.splice(i,1);
  localStorage.setItem('cazemc_cart', JSON.stringify(CART));
  loadCartPage();
  updateCartBadge();
}

// checkout
function goCheckout(){ window.location.href='checkout.html'; }
function loadCheckoutPage(){
  const box = $('#checkoutItems');
  if(!box) return;
  box.innerHTML = '';
  let total = 0;
  CART.forEach(it => {
    total += it.price*(it.qty||1);
    const p = document.createElement('p'); p.textContent = `${it.title} - ₹${it.price}`;
    box.appendChild(p);
  });
  $('#checkoutTotal') && ($('#checkoutTotal').textContent = total);
  $('#checkoutIGN') && ($('#checkoutIGN').textContent = IGN || 'Not logged');
}

// complete purchase (demo)
function completePurchase(){
  alert('Demo: purchase completed. You will receive items in-game (manual setup required).');
  CART = [];
  localStorage.setItem('cazemc_cart', JSON.stringify(CART));
  updateCartBadge();
  window.location.href='index.html';
}

// Login modal
function openLogin(){ $('#loginModal').classList.remove('hidden'); }
function closeLogin(){ $('#loginModal').classList.add('hidden'); }
function submitLogin(){
  const val = $('#ignInput').value.trim();
  if(!val){ alert('Enter a valid IGN'); return; }
  IGN = val;
  localStorage.setItem('cazemc_ign', IGN);
  closeLogin();
  alert('Logged in as ' + IGN);
}

// Init on load
window.addEventListener('load', async ()=>{
  await loadSettings();
  await loadProducts();
  // wire topbar buttons
  $('#cart-count') && $('#cart-count').addEventListener('click', openCart);
  $('#open-store') && $('#open-store').addEventListener('click', ()=> window.scrollTo({top:600,behavior:'smooth'}));
  // if on cart page
  if(window.location.pathname.endsWith('cart.html')) loadCartPage();
  if(window.location.pathname.endsWith('checkout.html')) loadCheckoutPage();
  // load saved IGN
  IGN = localStorage.getItem('cazemc_ign') || null;
  // update cart badge
  updateCartBadge();
  // wire modal close if present
  $('#loginModal') && $('#loginModal').addEventListener('click', (e)=>{ if(e.target===$('#loginModal')) closeLogin(); })
  $('#cartModal') && $('#cartModal').addEventListener('click', (e)=>{ if(e.target===$('#cartModal')) closeCart(); })
});
