// 页面交互逻辑

// 当前激活的分类
let activeCategory = 'all';
let currentService = null;

// DOM 元素
const tabsEl = document.getElementById('tabs');
const gridEl = document.getElementById('grid');
const modal = document.getElementById('consultModal');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalCloseBtn = document.getElementById('modalClose');
const modalWechat = document.getElementById('modalWechat');
const modalQQ = document.getElementById('modalQQ');
const modalQR = document.getElementById('modalQR');

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  renderTabs();
  renderGrid();
  bindEvents();
});

// 渲染分类 Tab
function renderTabs() {
  if (!tabsEl) return;
  tabsEl.innerHTML = CATEGORIES.map(cat => `
    <button class="tab ${cat.id === activeCategory ? 'on' : ''}" data-cat="${cat.id}">
      ${cat.name}${cat.tag ? ` <span class="cat-tag">${cat.tag}</span>` : ''}
    </button>
  `).join('');
}

// 渲染服务卡片网格
function renderGrid() {
  if (!gridEl) return;
  const filtered = activeCategory === 'all'
    ? SERVICES
    : SERVICES.filter(s => s.category === activeCategory);

  if (filtered.length === 0) {
    gridEl.innerHTML = `<div class="empty" style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-dim);">暂无该分类下的服务</div>`;
    return;
  }

  gridEl.innerHTML = filtered.map((s, i) => `
    <article class="card" style="animation-delay:${i * 40}ms" data-id="${s.id}">
      <div class="card-top">
        <h3 class="card-name">${s.name}</h3>
        <div class="badges">
          ${s.badges.map(b => `<span class="badge ${b === '热销' || b === '爆款主推' ? 'hot' : ''}">${b}</span>`).join('')}
        </div>
      </div>
      ${s.desc ? `<p class="card-desc">${s.desc}</p>` : ''}
      ${s.note ? `<p class="card-note">${s.note}</p>` : ''}
      <div class="card-foot">
        <div class="price">¥${s.price}${s.price !== '—' ? `<small>${s.unit}</small>` : ''}</div>
        <button class="btn-consult" data-id="${s.id}">咨询</button>
      </div>
    </article>
  `).join('');
}

// 绑定事件
function bindEvents() {
  // Tab 切换
  tabsEl?.addEventListener('click', e => {
    const btn = e.target.closest('.tab');
    if (!btn) return;
    activeCategory = btn.dataset.cat;
    renderTabs();
    renderGrid();
    window.scrollTo({ top: tabsEl.offsetTop - 70, behavior: 'smooth' });
  });

  // 咨询按钮
  gridEl?.addEventListener('click', e => {
    const btn = e.target.closest('.btn-consult');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    openConsultModal(id);
  });

  // 弹窗关闭
  modalCloseBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

// 打开咨询弹窗
function openConsultModal(id) {
  const s = SERVICES.find(x => x.id === id);
  if (!s) return;
  currentService = s;
  modalTitle.textContent = s.name;
  modalDesc.textContent = s.desc || '无详细描述';

  // 微信号
  modalWechat.textContent = CONTACT.wechat || '未配置';
  modalWechat.href = CONTACT.wechat ? `weixin://addfriend?${CONTACT.wechat}` : '#';

  // QQ
  modalQQ.textContent = CONTACT.qq || '未配置';
  modalQQ.href = CONTACT.qq ? `tencent://message/?uin=${CONTACT.qq}&Site=&Menu=yes` : '#';

  // 二维码
  if (CONTACT.qr) {
    modalQR.innerHTML = `<img src="${CONTACT.qr}" alt="二维码" style="width:160px;height:160px;border-radius:8px;">`;
    modalQR.style.display = 'block';
  } else {
    modalQR.style.display = 'none';
  }

  modal.classList.add('on');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal?.classList.remove('on');
  document.body.style.overflow = '';
  currentService = null;
}

// 复制到剪贴板（可选：点击微信号/QQ复制）
function copyToClipboard(text, label) {
  if (!text || text === '未配置') return;
  navigator.clipboard.writeText(text).then(() => {
    toast(`${label} 已复制`);
  });
}

// 简单 toast
function toast(msg) {
  const el = document.createElement('div');
  el.textContent = msg;
  el.style.cssText = `position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.85);color:#fff;padding:10px 18px;border-radius:8px;font-size:13px;z-index:200;animation:fade .3s`;
  document.body.appendChild(el);
  setTimeout(() => { el.style.animation = 'fade .3s reverse'; setTimeout(() => el.remove(), 300); }, 1800);
}

// 样式注入：toast 用的 fade
const style = document.createElement('style');
style.textContent = `
@keyframes fade { from { opacity: 0; transform: translate(-50%, 10px); } to { opacity: 1; transform: translate(-50%, 0); } }
`;
document.head.appendChild(style);