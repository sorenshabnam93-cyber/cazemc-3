async function loadSettings(){
  const r = await fetch('settings.json');
  const s = await r.json();
  document.getElementById('serverName').textContent = s.serverName;
  document.getElementById('serverIP').textContent = s.serverIP;
  document.getElementById('logo').src = s.logo;
  document.getElementById('discordLink').href = s.social.discord;
}

let products = [];
let cart = JSON.parse(localStorage.getItem('caze_cart')||'[]');

async function loadProducts(){
  try{
    const res = await fetch('products.json');
    products = await res.json();
  }catch(e){
    products = [];
  }
  renderProducts();
  renderCart();
}

function renderProducts(filter='', category='all'){
  const container = document.getElementById('products');
  container.innerHTML = '';
  const list = products.filter(p=>
    (category==='all' || p.category===category) &&
    (p.title.toLowerCase().includes(filter.toLowerCase()) || p.description.toLowerCase().includes(filter.toLowerCase()))
  );
  list.forEach(p=>{
    const el = document.createElement('div'); el.className='product';
    el.innerHTML = `
      <img src="${p.image}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <div class="row">
        <div class="price">₹${p.price}</div>
        <div><button class="btn add" data-id="${p.id}">Add</button></div>
      </div>
    `;
    container.appendChild(el);
  });
  document.querySelectorAll('.btn.add').forEach(b=>b.addEventListener('click', e=>addToCart(e.currentTarget.dataset.id)));
}

function addToCart(id){
  const p = products.find(x=>x.id===id);
  if(!p) return;
  const ex = cart.find(c=>c.id===id);
  if(ex) ex.qty++;
  else cart.push({id:p.id,title:p.title,price:p.price,qty:1});
  localStorage.setItem('caze_cart', JSON.stringify(cart));
  renderCart();
  openModal();
}

function renderCart(){
  let total=0,count=0;
  cart.forEach(i=>{ total += i.price * i.qty; count += i.qty; });
  document.getElementById('modal-total').innerText = total.toFixed(2);
  const mi = document.getElementById('modal-items');
  if(mi){
    mi.innerHTML = '';
    cart.forEach(it=>{
      const div = document.createElement('div');
      div.style.display = 'flex';
      div.style.justifyContent = 'space-between';
      div.style.padding = '6px 0';
      div.innerHTML = `<div>${it.title} x${it.qty}</div><div>₹${(it.price*it.qty).toFixed(2)}</div>`;
      mi.appendChild(div);
    });
  }
}

function openModal(){ document.getElementById('modal').classList.remove('hidden'); renderCart(); }
function closeModal(){ document.getElementById('modal').classList.add('hidden'); }

document.getElementById('closeModal')?.addEventListener('click', closeModal);
document.getElementById('modal-pay')?.addEventListener('click', ()=>{ alert('Demo payment — integrate Stripe/UPI using Netlify Functions'); closeModal(); });
document.getElementById('search')?.addEventListener('input', (e)=>{ renderProducts(e.target.value, document.querySelector('.sidebar li.active')?.dataset?.cat || 'all'); });
document.getElementById('open-store')?.addEventListener('click', ()=>{ window.scrollTo({top:600,behavior:'smooth'}); });
document.querySelectorAll('.sidebar li').forEach(li=>li.addEventListener('click', e=>{
  document.querySelectorAll('.sidebar li').forEach(x=>x.classList.remove('active'));
  e.currentTarget.classList.add('active');
  renderProducts(document.getElementById('search').value || '', e.currentTarget.dataset.cat || 'all');
}));

loadSettings();
loadProducts();
