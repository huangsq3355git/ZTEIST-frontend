export type Lang = 'zh' | 'en'

export interface Messages {
  brand: string
  brandSub: string
  // 邀请落地页
  inviteMessage: (name: string) => string
  inviteFallback: string
  inviteNotFound: string
  joinNow: string
  // 注册
  registerTitle: string
  name: string
  nameEn: string
  country: string
  selectCountry: string
  province: string
  eraStart: string
  eraEnd: string
  productLine: string
  role: string
  techDomain: string
  industry: string
  employmentStatus: string
  department: string
  level: string
  contactInfo: string
  wechat: string
  linkedin: string
  whatsapp: string
  phone: string
  email: string
  inviteCode: string
  submit: string
  sendCode: string
  code: string
  nickname: string
  password: string
  verifyLogin: string
  or: string
  // 通用
  loading: string
  error: string
  success: string
  // 搜索
  searchTitle: string
  search: string
  filter: string
  reset: string
  loginRequired: string
  results: string
  noResults: string
  back: string
  // 市场/项目
  supplyDemand: string
  supply: string
  demand: string
  jobs: string
  projects: string
  category: string
  title: string
  description: string
  budget: string
  timeline: string
  requirements: string
  // Header/Footer
  people: string
  login: string
  about: string
  join: string
  privacy: string
  terms: string
  faq: string
  contact: string
  // 首页标语
  slogan: string
  sloganSub: string
  askZ: string
  greetBubble: string
  dueDiligence: string
  // 会员中心
  memberCenter: string
  myLevel: string
  shareCode: string
  publish: string
  myPosts: string
  close: string
  copy: string
  logout: string
  inviteLink: string
}

const zh: Messages = {
  brand: '中友会',
  brandSub: '同事录 / 校友录社区',
  inviteMessage: (name: string) => `你的中兴老同事 ${name} 邀请你参加`,
  inviteFallback: '受邀加入 ZTEIST 中友会',
  inviteNotFound: '邀请链接无效或已失效',
  joinNow: '立即加入',
  registerTitle: '注册',
  name: '姓名',
  nameEn: '英文名 / 拼音',
  country: '国家',
  selectCountry: '请选择国家',
  province: '省份',
  eraStart: '入职年份',
  eraEnd: '离职年份',
  productLine: '产品线',
  role: '岗位',
  techDomain: '技术方向',
  industry: '行业',
  employmentStatus: '在职状态',
  department: '部门',
  level: '职级',
  contactInfo: '联系方式（选填，仅平台内部可见）',
  wechat: '微信',
  linkedin: 'LinkedIn',
  whatsapp: 'WhatsApp',
  phone: '手机',
  email: '邮箱',
  inviteCode: '邀请码（选填）',
  submit: '提交注册',
  sendCode: '发送验证码',
  code: '验证码',
  nickname: '昵称',
  password: '密码',
  verifyLogin: '验证并登录',
  or: '或',
  loading: '加载中…',
  error: '出错了，请重试',
  success: '成功',
  searchTitle: '搜索老同事',
  search: '搜索',
  filter: '筛选',
  reset: '重置',
  loginRequired: '请先登录',
  results: '结果',
  noResults: '暂无结果',
  back: '返回',
  supplyDemand: '供求',
  supply: '供',
  demand: '求',
  jobs: '招聘',
  projects: '项目',
  category: '分类',
  title: '标题',
  description: '描述',
  budget: '预算',
  timeline: '周期',
  requirements: '要求',
  people: '人员',
  login: '登录',
  about: '关于',
  join: '加入',
  privacy: '隐私',
  terms: '条款',
  faq: 'FAQ',
  contact: '联系',
  slogan: '聚是一团火，散是满天星',
  sloganSub: '我是小Z，连接每一颗闪亮之星。',
  askZ: '问问小Z',
  greetBubble: '嗨，我是小Z 🍀',
  dueDiligence: '背景调查',
  memberCenter: '会员中心',
  myLevel: '我的等级',
  shareCode: '专属分享码',
  publish: '发布',
  myPosts: '我的发布',
  close: '下架',
  copy: '复制',
  logout: '退出',
  inviteLink: '邀请链接',
}

const en: Messages = {
  brand: 'ZTEIST',
  brandSub: 'Colleague & Alumni Community',
  inviteMessage: (name: string) => `Your ZTE colleague ${name} invites you to join`,
  inviteFallback: 'You are invited to join ZTEIST',
  inviteNotFound: 'Invalid or expired invite link',
  joinNow: 'Join now',
  registerTitle: 'Register',
  name: 'Name',
  nameEn: 'English name / pinyin',
  country: 'Country',
  selectCountry: 'Select country',
  province: 'Province',
  eraStart: 'Start year',
  eraEnd: 'End year',
  productLine: 'Product line',
  role: 'Role',
  techDomain: 'Tech domain',
  industry: 'Industry',
  employmentStatus: 'Employment status',
  department: 'Department',
  level: 'Level',
  contactInfo: 'Contact (optional, platform-internal only)',
  wechat: 'WeChat',
  linkedin: 'LinkedIn',
  whatsapp: 'WhatsApp',
  phone: 'Phone',
  email: 'Email',
  inviteCode: 'Invite code (optional)',
  submit: 'Submit',
  sendCode: 'Send code',
  code: 'Code',
  nickname: 'Nickname',
  password: 'Password',
  verifyLogin: 'Verify & login',
  or: 'or',
  loading: 'Loading…',
  error: 'Something went wrong, please retry',
  success: 'Success',
  searchTitle: 'Find colleagues',
  search: 'Search',
  filter: 'Filter',
  reset: 'Reset',
  loginRequired: 'Please log in first',
  results: 'Results',
  noResults: 'No results',
  back: 'Back',
  supplyDemand: 'Supply & Demand',
  supply: 'Supply',
  demand: 'Demand',
  jobs: 'Jobs',
  projects: 'Projects',
  category: 'Category',
  title: 'Title',
  description: 'Description',
  budget: 'Budget',
  timeline: 'Timeline',
  requirements: 'Requirements',
  people: 'People',
  login: 'Log in',
  about: 'About',
  join: 'Join',
  privacy: 'Privacy',
  terms: 'Terms',
  faq: 'FAQ',
  contact: 'Contact',
  slogan: 'Together we blaze bright, apart we shine as starlight.',
  sloganSub: "I'm Z, connecting every shining star.",
  askZ: 'Come to ask Z',
  greetBubble: "Hi, I'm Z 🍀",
  dueDiligence: 'Due Diligence',
  memberCenter: 'Member Center',
  myLevel: 'My level',
  shareCode: 'Invite code',
  publish: 'Publish',
  myPosts: 'My Posts',
  close: 'Close',
  copy: 'Copy',
  logout: 'Logout',
  inviteLink: 'Invite link',
}

export function t(lang: Lang): Messages {
  return lang === 'en' ? en : zh
}
