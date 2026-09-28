// 页面交互逻辑 — 从 Cloudflare D1 API 动态获取数据

let activeCategory = 'all';
let allServices = [];
let allCategories = [];
let contactInfo = { wechat: '', qq: '', qr_image: '' };

const tabsEl = document.getElementById('tabs');
const gridEl = document.getElementById('grid');
const modal = document.getElementById('consultModal');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalCloseBtn = document.getElementById('modalClose');
const modalWechat = document.getElementById('modalWechat');
const modalQQ = document.getElementById('modalQQ');
const modalQR = document.getElementById('modalQR');

// 订单表单（在弹窗底部）
const orderForm = document.getElementById('orderForm');
const orderContactInput = document.getElementById('orderContact');
const orderRemarkInput = document.getElementById('orderRemark');
const orderSubmitBtn = document.getElementById('orderSubmit');
const orderStatusEl = document.getElementById('orderStatus');

document.addEventListener('DOMContentLoaded', () => {
  initData();
});

async function initData() {
  try {
    const [svcRes, contactRes] = await Promise.all([
      fetch('/api/services'),
      fetch('/api/contact')
    ]);
    
    if (!svcRes.ok) throw new Error('获取服务数据失败');
    if (!contactRes.ok) throw new Error('获取联系方式失败');
    
    const svcData = await svcRes.json();
    contactInfo = await contactRes.json();
    
    allCategories = svcData.categories || [];
    allServices = svcData.services || [];
    
    renderTabs();
    renderGrid();
    bindEvents();
  } catch (e) {
    gridEl.innerHTML = `<div class="empty" style="grid-column:1/-1;text-align:center;padding:40px;color:var(--accent);">数据加载失败，请刷新重试<br><small>${e.message}</small></div>`;
  }
}

// 渲染分类 Tab
function renderTabs() {
  if (!tabsEl || !allCategories.length) return;
  tabsEl.innerHTML = allCategories.map(cat => `
    <button class="tab ${cat.id === activeCategory ? 'on' : ''}" data-cat="${cat.id}">
      ${cat.name}${cat.tag ? ` <span class="cat-tag">${cat.tag}</span>` : ''}
    </button>
  `).join('');
}

// 渲染服务卡片
function renderGrid() {
  if (!gridEl) return;
  const filtered = activeCategory === 'all'
    ? allServices
    : allServices.filter(s => s.category_id === activeCategory);

  if (filtered.length === 0) {
    gridEl.innerHTML = `<div class="empty" style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-dim);">暂无该分类下的服务</div>`;
    return;
  }

  gridEl.innerHTML = filtered.map((s, i) => `
    <article class="card" style="animation-delay:${i * 40}ms">
      <div class="card-top">
        <h3 class="card-name">${s.name}</h3>
        <div class="badges">
          ${(s.badges || []).map(b => `<span class="badge ${b === '热销' || b === '爆款主推' ? 'hot' : ''}">${b}</span>`).join('')}
        </div>
      </div>
      ${s.description ? `<p class="card-desc">${s.description}</p>` : ''}
      ${s.note ? `<p class="card-note">${s.note}</p>` : ''}
      <div class="card-foot">
        <div class="price">¥${s.price}<small>${s.price !== 0 ? s.unit || '' : ''}</small></div>
        <button class="btn-consult" data-id="${s.id}">咨询</button>
      </div>
    </article>
  `).join('');
}

// 绑定事件
function bindEvents() {
  tabsEl?.addEventListener('click', e => {
    const btn = e.target.closest('.tab');
    if (!btn) return;
    activeCategory = btn.dataset.cat;
    renderTabs();
    renderGrid();
    window.scrollTo({ top: tabsEl.offsetTop - 70, behavior: 'smooth' });
  });

  gridEl?.addEventListener('click', e => {
    const btn = e.target.closest('.btn-consult');
    if (!btn) return;
    openConsultModal(Number(btn.dataset.id));
  });

  modalCloseBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // 订单提交
  orderSubmitBtn?.addEventListener('click', submitOrder);
}

// 打开咨询弹窗
function openConsultModal(serviceId) {
  const s = allServices.find(x => x.id === serviceId);
  if (!s) return;
  modalTitle.textContent = s.name;
  modalTitle.dataset.serviceId = s.id;
  modalDesc.textContent = s.description || '无详细描述';

  // 联系方式
  modalWechat.textContent = contactInfo.wechat || '未配置';
  modalWechat.href = contactInfo.wechat ? `weixin://addfriend?${contactInfo.wechat}` : '#';
  
  modalQQ.textContent = contactInfo.qq || '未配置';
  modalQQ.href = contactInfo.qq ? `tencent://message/?uin=${contactInfo.qq}&Site=&Menu=yes` : '#';

  // 二维码
  if (contactInfo.qr_image) {
    modalQR.innerHTML = `<img src="${contactInfo.qr_image}" alt="二维码" style="width:160px;height:160px;border-radius:8px;">`;
    modalQR.style.display = 'block';
  } else {
    modalQR.innerHTML = '';
    modalQR.style.display = 'none';
  }

  // 订单表单
  orderContactInput.value = '';
  orderRemarkInput.value = '';
  orderStatusEl.textContent = '';
  orderStatusEl.style.color = '';
  orderForm.style.display = 'block';
  orderSubmitBtn.disabled = false;

  modal.classList.add('on');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal?.classList.remove('on');
  document.body.style.overflow = '';
}

// 提交订单
async function submitOrder() {
  const contact = orderContactInput.value.trim();
  const remark = orderRemarkInput.value.trim();
  
  if (!contact) {
    orderStatusEl.textContent = '请填写联系方式（微信号/QQ）';
    orderStatusEl.style.color = 'var(--accent)';
    return;
  }

  orderSubmitBtn.disabled = true;
  orderSubmitBtn.textContent = '提交中...';
  orderStatusEl.textContent = '';

  try {
    const currentServiceId = Number(modalTitle.dataset.serviceId || allServices[0]?.id || 0);
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: currentServiceId,
        customer_contact: contact,
        remark
      })
    });

    const data = await res.json();
    if (data.success) {
      orderStatusEl.textContent = `✅ 订单提交成功！订单号：${data.order_id.slice(0, 8)}... 请留意客服联系`;
      orderStatusEl.style.color = '#4caf50';
      orderForm.style.display = 'none';
    } else {
      orderStatusEl.textContent = `❌ ${data.error || '提交失败'}`;
      orderStatusEl.style.color = 'var(--accent)';
      orderSubmitBtn.disabled = false;
    }
  } catch (e) {
    orderStatusEl.textContent = '❌ 网络错误，请重试';
    orderStatusEl.style.color = 'var(--accent)';
    orderSubmitBtn.disabled = false;
  }
}

// 复制到剪贴板
function copyToClipboard(text, label) {
  if (!text || text === '未配置') return;
  navigator.clipboard.writeText(text).then(() => {
    showToast(`${label} 已复制`);
  });
}

function showToast(msg) {
  const el = document.createElement('div');
  el.textContent = msg;
  el.style.cssText = `position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.85);color:#fff;padding:10px 18px;border-radius:8px;font-size:13px;z-index:200;`;
  document.body.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; setTimeout(() => el.remove(), 300); }, 1800);
}

// 样式注入
const style = document.createElement('style');
style.textContent = `
  .cat-tag { font-size: 11px; color: var(--gold); margin-left: 4px; }
  .empty { min-height: 120px; display: flex; align-items: center; justify-content: center; }
`;
document.head.appendChild(style);
