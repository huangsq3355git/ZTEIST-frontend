// 标准化下拉选项（V3.0 二十二节；值即后端存储值）
export const PRODUCT_LINES = ['终端', '移动', '网络', '数据', '光通讯', '供应链', '商务技术', '财务融资', '管理']
export const TECH_DOMAINS = ['硬件', '软件', '算法', '测试', '结构', '项目管理', '市场', '其他']
export const INDUSTRIES = ['通信', '半导体', '互联网', '新能源', '汽车', '金融', 'AI', '其他']
export const EMPLOYMENT_STATUSES = ['创业', '在职', '退休', '自由职业']

// 会员类型 → 徽章文案
export const MEMBER_TYPE_LABEL: Record<string, { zh: string; en: string }> = {
  trial: { zh: '观察期', en: 'Trial' },
  member: { zh: '认证会员', en: 'Verified' },
  expert: { zh: '专家库', en: 'Expert' },
  user: { zh: '普通', en: 'Member' },
}

// 付费档位 → 徽章文案（Stripe 支付后 paid_tier 字段）
export const PAID_TIER_LABEL: Record<string, { zh: string; en: string }> = {
  supporter: { zh: '支持会员', en: 'Supporting Member' },
  enterprise: { zh: '企业会员', en: 'Enterprise Member' },
}

// 值 → 双语标签（存储仍是中文值，显示按语言切换）
export const PRODUCT_LINE_LABELS: Record<string, { zh: string; en: string }> = {
  终端: { zh: '终端', en: 'Devices' },
  移动: { zh: '移动', en: 'Mobile' },
  网络: { zh: '网络', en: 'Network' },
  数据: { zh: '数据', en: 'Data' },
  光通讯: { zh: '光通讯', en: 'Optical' },
  供应链: { zh: '供应链', en: 'Supply Chain' },
  商务技术: { zh: '商务技术', en: 'Commercial' },
  财务融资: { zh: '财务融资', en: 'Finance' },
  管理: { zh: '管理', en: 'Management' },
}
export const TECH_DOMAIN_LABELS: Record<string, { zh: string; en: string }> = {
  硬件: { zh: '硬件', en: 'Hardware' },
  软件: { zh: '软件', en: 'Software' },
  算法: { zh: '算法', en: 'Algorithm' },
  测试: { zh: '测试', en: 'Testing' },
  结构: { zh: '结构', en: 'Structure' },
  项目管理: { zh: '项目管理', en: 'Project Mgmt' },
  市场: { zh: '市场', en: 'Marketing' },
  其他: { zh: '其他', en: 'Other' },
}
export const INDUSTRY_LABELS: Record<string, { zh: string; en: string }> = {
  通信: { zh: '通信', en: 'Telecom' },
  半导体: { zh: '半导体', en: 'Semiconductor' },
  互联网: { zh: '互联网', en: 'Internet' },
  新能源: { zh: '新能源', en: 'New Energy' },
  汽车: { zh: '汽车', en: 'Automotive' },
  金融: { zh: '金融', en: 'Finance' },
  AI: { zh: 'AI', en: 'AI' },
  其他: { zh: '其他', en: 'Other' },
}
export const EMPLOYMENT_STATUS_LABELS: Record<string, { zh: string; en: string }> = {
  创业: { zh: '创业', en: 'Startup' },
  在职: { zh: '在职', en: 'Employed' },
  退休: { zh: '退休', en: 'Retired' },
  自由职业: { zh: '自由职业', en: 'Freelance' },
}

export function valueLabel(
  labels: Record<string, { zh: string; en: string }>,
  value: string,
  lang: 'zh' | 'en'
): string {
  const l = labels[value]
  return l ? (lang === 'zh' ? l.zh : l.en) : value
}

// 供求分类 + 项目类型
export const SUPPLY_CATEGORIES = ['项目', '产品', '资源', '合作']
export const PROJECT_CATEGORIES = ['出海', '本地化', '技术合作', '供应链', '落地服务']
