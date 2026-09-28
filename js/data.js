// 服务数据：改这个文件就能改页面内容，不用动 HTML

const CATEGORIES = [
  { id: 'all', name: '全部' },
  { id: 'huohu', name: '护航专区', tag: '爆款主推' },
  { id: 'quwei', name: '趣味单', tag: '热门' },
  { id: 'xiaoshi', name: '小时陪玩', tag: '' },
  { id: 'chuhong', name: '出红专区', tag: '' },
  { id: 'jianyu', name: '监狱专区', tag: '' },
  { id: 'az3', name: 'AZ3', tag: '' },
  { id: 'bangmang', name: '我来帮忙', tag: '' }
];

const SERVICES = [
  {
    id: 1,
    category: 'huohu',
    name: '新客体验单',
    desc: '基础保底688w',
    note: '限购 1 单',
    price: '118',
    unit: '/单',
    badges: ['热销']
  },
  {
    id: 2,
    category: 'huohu',
    name: '超值保底单',
    desc: '基础保底1000w',
    note: '每人每天限 1 单',
    price: '168',
    unit: '/单',
    badges: []
  },
  {
    id: 3,
    category: 'quwei',
    name: '猜馅专家',
    desc: '猜不出老板所选口味一直打！',
    note: '',
    price: '288',
    unit: '起/单',
    badges: []
  },
  {
    id: 4,
    category: 'quwei',
    name: '数字炸弹',
    desc: '老板指定数字，打手踩中即白吃！！！',
    note: '',
    price: '188',
    unit: '起/单',
    badges: ['近期上新']
  },
  {
    id: 5,
    category: 'quwei',
    name: '神秘黑洞',
    desc: '复活在板板所选黑洞直接白吃',
    note: '',
    price: '288',
    unit: '起/单',
    badges: ['超划算']
  },
  {
    id: 6,
    category: 'xiaoshi',
    name: '亿万富翁',
    desc: '基础保底一个亿！！',
    note: '',
    price: '288',
    unit: '',
    badges: []
  },
  {
    id: 7,
    category: 'xiaoshi',
    name: '小小巨人',
    desc: '清空巨人血条才能结单',
    note: '内置小游戏',
    price: '388',
    unit: '',
    badges: []
  },
  {
    id: 8,
    category: 'chuhong',
    name: '出红护航',
    desc: '指定地图，高价值物资直出',
    note: '每人每天限 2 单',
    price: '388',
    unit: '起/单',
    badges: ['爆款主推']
  },
  {
    id: 9,
    category: 'jianyu',
    name: '潮汐监狱',
    desc: '监狱堵桥组排，安全撤离',
    note: '双人车队',
    price: '188',
    unit: '起/小时',
    badges: []
  },
  {
    id: 10,
    category: 'az3',
    name: 'AZ3 全图护航',
    desc: '全图开黑，路线规划 + 实时报点',
    note: '按小时计',
    price: '68',
    unit: '/小时',
    badges: []
  },
  {
    id: 11,
    category: 'bangmang',
    name: '赛季任务代做',
    desc: '3x3 保险箱 / 支线任务一条龙',
    note: '纯手打绿色',
    price: '288',
    unit: '起/单',
    badges: ['近期上新']
  },
  {
    id: 12,
    category: 'bangmang',
    name: '自定义需求',
    desc: '需求发出去，打手来报价',
    note: '发布免费',
    price: '—',
    unit: '',
    badges: []
  }
];

// 联系方式：点“咨询”按钮弹窗展示
const CONTACT = {
  wechat: 'YOUR_WECHAT_ID',
  qq: 'YOUR_QQ',
  qr: '' // 可填二维码图片地址，留空则不显示
};
