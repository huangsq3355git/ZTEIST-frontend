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

// 供求分类 + 项目类型
export const SUPPLY_CATEGORIES = ['项目', '产品', '资源', '合作']
export const PROJECT_CATEGORIES = ['出海', '本地化', '技术合作', '供应链', '落地服务']
