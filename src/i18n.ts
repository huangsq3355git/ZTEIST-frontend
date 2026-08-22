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
  eraStart: string
  eraEnd: string
  productLine: string
  role: string
  techDomain: string
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
  verifyLogin: string
  or: string
  // 通用
  loading: string
  error: string
  success: string
  // 搜索
  searchTitle: string
  search: string
  results: string
  noResults: string
  back: string
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
  eraStart: '入职年份',
  eraEnd: '离职年份',
  productLine: '产品线',
  role: '岗位',
  techDomain: '技术方向',
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
  verifyLogin: '验证并登录',
  or: '或',
  loading: '加载中…',
  error: '出错了，请重试',
  success: '成功',
  searchTitle: '搜索老同事',
  search: '搜索',
  results: '结果',
  noResults: '暂无结果',
  back: '返回',
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
  eraStart: 'Start year',
  eraEnd: 'End year',
  productLine: 'Product line',
  role: 'Role',
  techDomain: 'Tech domain',
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
  verifyLogin: 'Verify & login',
  or: 'or',
  loading: 'Loading…',
  error: 'Something went wrong, please retry',
  success: 'Success',
  searchTitle: 'Find colleagues',
  search: 'Search',
  results: 'Results',
  noResults: 'No results',
  back: 'Back',
}

export function t(lang: Lang): Messages {
  return lang === 'en' ? en : zh
}
