"use client";

import { useState, useEffect, useMemo } from "react";

// ======== 层级样式（德甲不莱梅官方合作层级）========
const TIER_STYLES = {
  主赞助商: { bg: "bg-emerald-800", text: "text-white" },
  装备供应商: { bg: "bg-slate-700", text: "text-white" },
  顶级合作伙伴: { bg: "bg-slate-700", text: "text-white" },
  聚光灯合作伙伴: { bg: "bg-slate-700", text: "text-white" },
  独家合作伙伴: { bg: "bg-slate-700", text: "text-white" },
  高级合作伙伴: { bg: "bg-slate-700", text: "text-white" },
  "Team11-Partner": { bg: "bg-slate-700", text: "text-white" },
  区域合作伙伴: { bg: "bg-slate-700", text: "text-white" },
};

// ======== 预置 AI 简报（离线演示版本）========
// 真实产品应接入 Anthropic API 动态生成；此处内置了基于当前赞助商数据的运营简报，方便离线展示
const PRESET_REVIEWS = {
  matthaei: `【风险预警】
执行型权益兑现进度 64%，对比时间进度 55% 保持小幅领先，LED 轮播（69%）和新闻发布会背景板（70%）两项节奏尤其稳。合约还剩三年多，当前主要观察点不在交付节奏上，而在如何持续让 €8M 投入产生超出合同条款的品牌资产沉淀。

【客户沟通建议】
Matthäi 是最稳的基本盘，但稳也意味着容易被视为理所当然。建议季度复盘主动向 Herr Weber 汇报履约型权益锁定价值 €6.0M + 执行型已兑现 €3.1M 的完整价值地图，重点讲"共创"而非"交付"。长期合作最大的风险是关系冷化，不是数据下滑。`,

  hummel: `【风险预警】
执行型权益兑现进度 79%，超过时间进度 71%，主要得益于两场新款球衣发布会已全额交付。周边联名款 4/6 和 Pop-up 门店 3/4 都按节奏推进，无明显滞后项。

【客户沟通建议】
Hummel 合约 2027 年中到期，现在正是向丹麦总部呈现"品牌资产年度回报"数据的最佳时机。建议把复古球衣系列的社媒二次传播数据单独整理一份附录，这是他们最看重的品牌渗透指标，可以作为下一轮续约提涨的核心依据。`,

  ewe: `【风险预警】
执行型权益兑现进度 64%，时间进度已 92%，缺口 28 个百分点是当前组合里最严峻的信号。可持续主题短视频 3/6 落后最明显，这恰恰是 EWE 品牌形象的核心出口。合约 2026.6 到期，如果按当前节奏收尾，续约谈判很难要到好价格。

【客户沟通建议】
EWE 的绿色能源定位需要配套的内容弹药。建议在续约谈判前做一次专项复盘，把剩余 3 支短视频的内容方向与他们 PR 团队联合定调，不再走"俱乐部制作 → 客户审阅"的单向流程。把合作从供应商关系升级为联合品牌项目，是撑起溢价续约的唯一路径。`,

  wiesenhof: `【风险预警】
执行型权益兑现进度 56%，时间进度 76%，已形成 20 个百分点的滞后。比赛日美食内容 5/12 最拖后腿，这是对外可见度最高的一项。VIP 休息室餐饮 10/17 虽也落后，但受主场场次上限约束，下半赛季密度天然会上升。

【客户沟通建议】
Wiesenhof 合约还有一年半，眼下的重点不是追赶数字，而是提前告知合作节奏的现实约束，避免对方到赛季末才发现缺口。建议主动提出把未兑现的美食内容打包成一个"赛季末合集"式企划，既补交付又能形成新的传播热点，比单纯补数量更有价值。`,

  cocacola: `【风险预警】
执行型权益兑现进度 36%，时间进度 44%，8 个百分点的落差还在可控范围。青训营饮品 2/8 比例最低，但这类权益通常集中在赛季后半段的青训营活动窗口，暂不构成风险。独家饮料供应条款履约正常，是核心价值锚。

【客户沟通建议】
Coca-Cola 的合作刚进入第二年，关系建设期比数据追赶更重要。建议本季度主动邀请他们区域市场团队参观威悉球场的独家供应执行情况（竞品隔离、陈列规范），用现场感替代报表汇报。独家权是他们最在意的资产，让他们亲眼看到被保护得有多严格，信任感的收益远大于任何 PPT。`,

  mercedes: `【风险预警】
执行型权益兑现进度 47%，时间进度 85%，38 个百分点的缺口是全组合最严重的信号。VIP 贵宾用车 18/40 和球员试驾视频 1/4 两项都明显落后，合约 2026.6 到期时很可能出现无法全额兑现的局面。

【客户沟通建议】
这是一段需要及时面对面的合作。建议尽快约 Frau Meyer 一次非正式沟通，坦承当前节奏问题，并提出"把未使用的用车额度转化为一次客户高端体验日"这样的替代方案。被动等赛季末发现缺口会把续约谈判直接推进僵局，主动重新设计交付反而是把危机转化为亮点的机会。`,

  blg: `【风险预警】
执行型权益兑现进度 60%，时间进度 92%，缺口 32 个百分点。LED 轮播 38/60 和幕后物流短片 1/2 两项均滞后，但 BLG 是 Team11 级别，合约绝对价值不高（€350K），即便按现状收尾影响有限。合约 2026.6 到期，与 EWE 同期。

【客户沟通建议】
BLG 的特殊之处在于对接人 Robert 本身是资深球迷，这种关系型合作最怕用纯数据话术收尾。建议在续约谈判前安排一场"合作回顾"而不是"KPI 复盘"——内容偏情感和故事，数据作为背景支撑。本地企业看重的是"被球队认可"这件事本身，比合约条款更有黏性。`,

  combi: `【风险预警】
合约已到期，最终执行型兑现率 50%，未达预期。三项权益中仅本地媒体联合报道接近一半，区域联合营销 2/4 和门店开放日 3/6 都止步于过半节点。归因主要是他们本地市场预算在 2025 年底有调整，并非俱乐部侧执行问题。

【客户沟通建议】
Combi 是区域级合作，续约窗口已过，当前处于"观察是否重启"的阶段。建议不要主动推销新合约，而是以"本赛季合作复盘"为由做一次轻量面谈，了解他们 2026 年的门店扩张计划。如果他们有新开店需求，再把合作重新包装为"新店启动活动"切入；如果没有，保持友好距离即可，硬推只会透支俱乐部在本地商圈的信誉。`,

  default: `【风险预警】
暂无针对该赞助商的预置简报。真实产品会调用 Anthropic API 基于当前数据动态生成风险预警与沟通建议。

【客户沟通建议】
请选择示例数据中的 8 家赞助商之一查看完整的 AI 运营简报。`,
};

// ======== 初始赞助商数据 ========
// rightType: "entitlement" 履约型（合约锁定，自动兑现）| "activation" 执行型（需主动排期/创意/邀请）
const INITIAL_SPONSORS = [
  {
    id: "matthaei",
    name: "Matthäi",
    tier: "主赞助商",
    tierEn: "Hauptsponsor",
    industry: "建筑工程",
    contractAmount: 8000000,
    contractPeriod: { start: "2022-07", end: "2029-06" },
    contact: { name: "Michael Weber", email: "m.weber@matthaei.com", phone: "+49 421 5502-100" },
    note: "合约签到2029年，最稳的基本盘。CEO Herr Weber 偏好德语沟通，重要邮件尽量别夹英文缩写。",
    rights: [
      { id: "m1", rightType: "entitlement", category: "品牌曝光", type: "球衣胸前主Logo", required: 34, delivered: 21, unit: "场比赛", deadline: "2026-05", valuePerUnit: 210000 },
      { id: "m2", rightType: "activation", category: "品牌曝光", type: "威悉球场LED轮播", required: 200, delivered: 138, unit: "次", deadline: "2026-05", valuePerUnit: 16000 },
      { id: "m3", rightType: "entitlement", category: "品牌曝光", type: "官网首页主合作伙伴专区", required: 365, delivered: 280, unit: "天", deadline: "2026-06", valuePerUnit: 2800 },
      { id: "m4", rightType: "activation", category: "内容与社媒", type: "官方社媒联合内容", required: 24, delivered: 13, unit: "条", deadline: "2026-06", valuePerUnit: 30000 },
      { id: "m5", rightType: "activation", category: "接待与体验", type: "VIP包厢冠名使用", required: 17, delivered: 9, unit: "主场", deadline: "2026-05", valuePerUnit: 45000 },
      { id: "m6", rightType: "activation", category: "接待与体验", type: "新闻发布会背景板", required: 20, delivered: 14, unit: "场", deadline: "2026-05", valuePerUnit: 9000 },
    ],
    metrics: { impressions: 285000000, socialReach: 18500000 },
  },
  {
    id: "hummel",
    name: "Hummel",
    tier: "装备供应商",
    tierEn: "Ausrüster",
    industry: "体育装备",
    contractAmount: 4500000,
    contractPeriod: { start: "2023-07", end: "2027-06" },
    contact: { name: "Sarah Johnson", email: "s.johnson@hummel.com", phone: "+45 70 20 80 80" },
    note: "丹麦总部决策偏慢，但一旦定下执行很稳。联名款设计评审要留足 4 周，别压到赛季末。",
    rights: [
      { id: "h1", rightType: "entitlement", category: "品牌曝光", type: "球衣品牌Logo", required: 34, delivered: 21, unit: "场", deadline: "2026-05", valuePerUnit: 130000 },
      { id: "h2", rightType: "entitlement", category: "商业授权", type: "训练服独家供应", required: 1, delivered: 1, unit: "赛季", deadline: "2026-06", valuePerUnit: 650000 },
      { id: "h3", rightType: "activation", category: "商业授权", type: "周边商品联名款", required: 6, delivered: 4, unit: "款", deadline: "2026-06", valuePerUnit: 85000 },
      { id: "h4", rightType: "activation", category: "内容与社媒", type: "新款球衣发布会", required: 2, delivered: 2, unit: "次", deadline: "2026-06", valuePerUnit: 180000 },
      { id: "h5", rightType: "activation", category: "接待与体验", type: "线下Pop-up门店活动", required: 4, delivered: 3, unit: "次", deadline: "2026-06", valuePerUnit: 65000 },
    ],
    metrics: { impressions: 320000000, socialReach: 21000000 },
  },
  {
    id: "ewe",
    name: "EWE",
    tier: "顶级合作伙伴",
    tierEn: "Top-Partner",
    industry: "能源",
    contractAmount: 2500000,
    contractPeriod: { start: "2024-07", end: "2026-06" },
    contact: { name: "Thomas Becker", email: "t.becker@ewe.de", phone: "+49 441 4805-0" },
    note: "绿色能源是他们对外形象的重点，相关物料务必同步他们 PR 团队后再发。合约 2026.6 到期，注意留出谈续约的时间窗。",
    rights: [
      { id: "e1", rightType: "entitlement", category: "品牌曝光", type: "球衣袖标Logo", required: 34, delivered: 21, unit: "场", deadline: "2026-05", valuePerUnit: 55000 },
      { id: "e2", rightType: "activation", category: "品牌曝光", type: "球场LED赞助位", required: 150, delivered: 98, unit: "次", deadline: "2026-05", valuePerUnit: 7500 },
      { id: "e3", rightType: "entitlement", category: "商业授权", type: "绿色能源合作项目冠名", required: 1, delivered: 1, unit: "项", deadline: "2026-06", valuePerUnit: 280000 },
      { id: "e4", rightType: "activation", category: "接待与体验", type: "球迷互动区运营", required: 17, delivered: 11, unit: "主场", deadline: "2026-05", valuePerUnit: 11000 },
      { id: "e5", rightType: "activation", category: "内容与社媒", type: "可持续主题短视频", required: 6, delivered: 3, unit: "支", deadline: "2026-06", valuePerUnit: 28000 },
    ],
    metrics: { impressions: 95000000, socialReach: 4500000 },
  },
  {
    id: "wiesenhof",
    name: "Wiesenhof",
    tier: "聚光灯合作伙伴",
    tierEn: "Flutlichtpartner",
    industry: "食品",
    contractAmount: 1200000,
    contractPeriod: { start: "2024-01", end: "2026-12" },
    contact: { name: "Anna Schmidt", email: "a.schmidt@wiesenhof.de", phone: "+49 4441 898-0" },
    note: "比赛日餐饮，赛前 48 小时要确认 VIP 人数。遇恶劣天气可能临时调菜单，注意同步球迷运营。",
    rights: [
      { id: "w1", rightType: "activation", category: "品牌曝光", type: "球场LED赞助位", required: 100, delivered: 62, unit: "次", deadline: "2026-12", valuePerUnit: 6000 },
      { id: "w2", rightType: "activation", category: "接待与体验", type: "VIP休息室餐饮", required: 17, delivered: 10, unit: "主场", deadline: "2026-05", valuePerUnit: 9000 },
      { id: "w3", rightType: "activation", category: "内容与社媒", type: "比赛日美食内容", required: 12, delivered: 5, unit: "条", deadline: "2026-12", valuePerUnit: 22000 },
      { id: "w4", rightType: "entitlement", category: "商业授权", type: "球场摊位运营权", required: 17, delivered: 11, unit: "主场", deadline: "2026-12", valuePerUnit: 30000 },
    ],
    metrics: { impressions: 42000000, socialReach: 1800000 },
  },
  {
    id: "cocacola",
    name: "Coca-Cola",
    tier: "独家合作伙伴",
    tierEn: "Exklusiv-Partner",
    industry: "饮料",
    contractAmount: 800000,
    contractPeriod: { start: "2025-01", end: "2027-12" },
    contact: { name: "David Miller", email: "d.miller@coca-cola.com", phone: "+49 40 3540 4000" },
    note: "独家品类严格执行：任何官方场合不得出现百威、Red Bull、Fritz-Kola 等竞品。合作活动需提前 2 周送他们合规审查。",
    rights: [
      { id: "c1", rightType: "entitlement", category: "商业授权", type: "球场饮料独家供应", required: 1, delivered: 1, unit: "赛季", deadline: "2027-12", valuePerUnit: 380000 },
      { id: "c2", rightType: "activation", category: "品牌曝光", type: "球场LED赞助位", required: 120, delivered: 45, unit: "次", deadline: "2027-12", valuePerUnit: 4500 },
      { id: "c3", rightType: "activation", category: "接待与体验", type: "青训营饮品赞助", required: 8, delivered: 2, unit: "场", deadline: "2027-12", valuePerUnit: 8000 },
      { id: "c4", rightType: "activation", category: "内容与社媒", type: "社媒联名活动", required: 6, delivered: 2, unit: "次", deadline: "2027-12", valuePerUnit: 20000 },
    ],
    metrics: { impressions: 65000000, socialReach: 3800000 },
  },
  {
    id: "mercedes",
    name: "梅赛德斯-奔驰不莱梅",
    tier: "高级合作伙伴",
    tierEn: "Premium-Partner",
    industry: "汽车",
    contractAmount: 600000,
    contractPeriod: { start: "2025-07", end: "2026-06" },
    contact: { name: "Julia Meyer", email: "j.meyer@mercedes-bremen.de", phone: "+49 421 8992-0" },
    note: "本地经销商合作，用车排期提前两周申请。关键比赛周优先保障客户接送，内部用车需求往后排。",
    rights: [
      { id: "mb1", rightType: "activation", category: "接待与体验", type: "VIP贵宾用车服务", required: 40, delivered: 18, unit: "次", deadline: "2026-06", valuePerUnit: 4000 },
      { id: "mb2", rightType: "activation", category: "品牌曝光", type: "球场LED赞助位", required: 80, delivered: 48, unit: "次", deadline: "2026-05", valuePerUnit: 2500 },
      { id: "mb3", rightType: "entitlement", category: "商业授权", type: "官方用车冠名", required: 1, delivered: 1, unit: "赛季", deadline: "2026-06", valuePerUnit: 120000 },
      { id: "mb4", rightType: "activation", category: "内容与社媒", type: "球员试驾视频", required: 4, delivered: 1, unit: "支", deadline: "2026-06", valuePerUnit: 25000 },
    ],
    metrics: { impressions: 28000000, socialReach: 950000 },
  },
  {
    id: "blg",
    name: "BLG Logistics",
    tier: "Team11-Partner",
    tierEn: "Team11-Partner",
    industry: "物流",
    contractAmount: 350000,
    contractPeriod: { start: "2024-07", end: "2026-06" },
    contact: { name: "Robert Klein", email: "r.klein@blg.de", phone: "+49 421 398-01" },
    note: "本地物流伙伴，对接人 Robert 是资深球迷，沟通顺畅但务必把合同边界写清楚，别被热情冲昏头答应合约外的事。",
    rights: [
      { id: "b1", rightType: "activation", category: "品牌曝光", type: "球场LED赞助位", required: 60, delivered: 38, unit: "次", deadline: "2026-05", valuePerUnit: 3000 },
      { id: "b2", rightType: "entitlement", category: "商业授权", type: "球队装备运输", required: 34, delivered: 21, unit: "场", deadline: "2026-06", valuePerUnit: 8000 },
      { id: "b3", rightType: "activation", category: "内容与社媒", type: "幕后物流主题短片", required: 2, delivered: 1, unit: "支", deadline: "2026-06", valuePerUnit: 35000 },
    ],
    metrics: { impressions: 15000000, socialReach: 420000 },
  },
  {
    id: "combi",
    name: "Combi",
    tier: "区域合作伙伴",
    tierEn: "Regio-Partner",
    industry: "零售",
    contractAmount: 180000,
    contractPeriod: { start: "2025-04", end: "2026-03" },
    contact: { name: "Lisa Wagner", email: "l.wagner@combi.de", phone: "+49 441 2050-0" },
    note: "区域零售合作，门店店长可提需求但不能越权承诺。合约刚到期，续约谈判要用好本赛季的兑现数据当筹码。",
    rights: [
      { id: "co1", rightType: "activation", category: "内容与社媒", type: "区域市场联合营销", required: 4, delivered: 2, unit: "campaigns", deadline: "2026-03", valuePerUnit: 22000 },
      { id: "co2", rightType: "activation", category: "接待与体验", type: "门店球迷开放日", required: 6, delivered: 3, unit: "次", deadline: "2026-03", valuePerUnit: 8500 },
      { id: "co3", rightType: "activation", category: "品牌曝光", type: "本地媒体联合报道", required: 8, delivered: 4, unit: "次", deadline: "2026-03", valuePerUnit: 4500 },
    ],
    metrics: { impressions: 8000000, socialReach: 320000 },
  },
];

// ======== 工具函数 ========
function formatEUR(amount) {
  if (!Number.isFinite(amount)) return "€0";
  if (amount >= 1000000) return `€${(amount / 1000000).toFixed(2)}M`;
  if (amount >= 1000) return `€${(amount / 1000).toFixed(0)}K`;
  return `€${amount.toLocaleString()}`;
}

function formatNum(n) {
  if (!Number.isFinite(n)) return "0";
  if (n >= 1e8) return `${(n / 1e8).toFixed(2)}亿`;
  if (n >= 1e4) return `${(n / 1e4).toFixed(1)}万`;
  return n.toLocaleString();
}

function formatPeriod(period) {
  const fmt = (s) => {
    const [y, m] = s.split("-");
    return `${y}年${parseInt(m)}月`;
  };
  return `${fmt(period.start)} - ${fmt(period.end)}`;
}

function computeTimeProgress(period) {
  const start = new Date(period.start + "-01").getTime();
  const end = new Date(period.end + "-01").getTime();
  const now = Date.now();
  if (now <= start) return 0;
  if (now >= end) return 100;
  return ((now - start) / (end - start)) * 100;
}

function computeCompletion(rights) {
  if (!rights.length) return 0;
  const sum = rights.reduce((acc, r) => acc + Math.min(r.delivered / r.required, 1), 0);
  return (sum / rights.length) * 100;
}

// 单项价值（|| 0 兜底，避免脏数据产生 NaN）
function rightDeliveredValue(r) {
  return (r.delivered || 0) * (r.valuePerUnit || 0);
}
function rightContractedValue(r) {
  return (r.required || 0) * (r.valuePerUnit || 0);
}

// 赞助商级聚合
function sponsorDeliveredValue(s) {
  return s.rights.reduce((a, r) => a + rightDeliveredValue(r), 0);
}
function sponsorContractedValue(s) {
  return s.rights.reduce((a, r) => a + rightContractedValue(r), 0);
}

// 预计 ROI：合同完整履约后的回报倍数（= 全部权益承诺总价值 / 合同金额）
function computeROIMultiplier(s) {
  return sponsorContractedValue(s) / s.contractAmount;
}

// 已兑现 ROI：截至当前已交付的回报倍数
function computeRealizedROI(s) {
  return sponsorDeliveredValue(s) / s.contractAmount;
}

function roiHealth(multiplier) {
  if (multiplier >= 1.4) return { label: "优秀", color: "text-emerald-700", bg: "bg-emerald-100", border: "border-emerald-400" };
  if (multiplier >= 1.0) return { label: "健康", color: "text-green-700", bg: "bg-green-100", border: "border-green-400" };
  if (multiplier >= 0.8) return { label: "关注", color: "text-yellow-700", bg: "bg-yellow-100", border: "border-yellow-400" };
  return { label: "风险", color: "text-red-700", bg: "bg-red-100", border: "border-red-400" };
}

// 清理 Markdown 残留，保证简报以纯文本段落呈现
function cleanMarkdown(text) {
  if (!text) return text;
  return text
    .replace(/\*\*/g, "")                              // 去掉所有 ** 加粗符号
    .replace(/__/g, "")                                // 去掉 __ 加粗符号
    .replace(/^[\s]*\|[\s\-:|]+\|[\s]*$/gm, "")       // 去掉 Markdown 表格分隔行 |---|---|
    .replace(/^#{1,6}\s+/gm, "")                       // 去掉 # 开头的标题
    .replace(/^[\s]*[-*]\s+/gm, "")                    // 去掉行首的 - 或 * 列表符号
    .replace(/\n{3,}/g, "\n\n")                        // 合并多余空行
    .trim();
}

// ======== 主组件 ========
export default function App() {
  const [sponsors, setSponsors] = useState(INITIAL_SPONSORS);
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const [aiReview, setAiReview] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("werder_sponsors_v3");
      if (raw) {
        const parsed = JSON.parse(raw);
        const valid =
          Array.isArray(parsed) &&
          parsed.every(
            (s) =>
              s &&
              typeof s.contractAmount === "number" &&
              s.metrics &&
              typeof s.metrics.impressions === "number" &&
              Array.isArray(s.rights) &&
              s.rights.every(
                (r) =>
                  typeof r.valuePerUnit === "number" &&
                  (r.rightType === "entitlement" || r.rightType === "activation"),
              ),
          );
        if (valid) setSponsors(parsed);
      }
    } catch (e) {
      // 读取或解析失败，使用默认数据
    }
  }, []);

  const persist = (next) => {
    setSponsors(next);
    try {
      localStorage.setItem("werder_sponsors_v3", JSON.stringify(next));
    } catch (e) {}
  };

  const resetData = () => {
    setSponsors(INITIAL_SPONSORS);
    try {
      localStorage.setItem("werder_sponsors_v3", JSON.stringify(INITIAL_SPONSORS));
    } catch (e) {}
    setSelected(null);
  };

  const updateDelivered = (sponsorId, rightId, delta) => {
    const next = sponsors.map((s) => {
      if (s.id !== sponsorId) return s;
      return {
        ...s,
        rights: s.rights.map((r) => {
          if (r.id !== rightId) return r;
          const newVal = Math.max(0, Math.min(r.required * 1.5, r.delivered + delta));
          return { ...r, delivered: newVal };
        }),
      };
    });
    persist(next);
    if (selected && selected.id === sponsorId) {
      setSelected(next.find((s) => s.id === sponsorId));
    }
  };

  const summary = useMemo(() => {
    const totalAmount = sponsors.reduce((a, s) => a + s.contractAmount, 0);
    const totalContracted = sponsors.reduce((a, s) => a + sponsorContractedValue(s), 0);
    const totalDelivered = sponsors.reduce((a, s) => a + sponsorDeliveredValue(s), 0);
    const avgCompletion = sponsors.reduce((a, s) => a + computeCompletion(s.rights), 0) / sponsors.length;
    const portfolioROI = totalContracted / totalAmount;
    const realizedROI = totalDelivered / totalAmount;
    return { totalAmount, totalContracted, totalDelivered, avgCompletion, portfolioROI, realizedROI, count: sponsors.length };
  }, [sponsors]);

  const runAIReview = (sponsor) => {
    setLoadingAI(true);
    setAiReview(null);
    // 模拟生成延迟，让交互感更自然（实际是从内置数据取）
    const delay = 800 + Math.random() * 600;
    setTimeout(() => {
      const review = PRESET_REVIEWS[sponsor.id] || PRESET_REVIEWS.default;
      setAiReview(review);
      setLoadingAI(false);
    }, delay);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold">
                SVW
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">SV Werder Bremen</h1>
                <span className="px-2 py-0.5 bg-yellow-400 text-emerald-900 rounded text-xs font-bold">
                  2025/26 赛季
                </span>
              </div>
              <p className="text-emerald-100 text-sm">赞助商权益追踪 · 品牌运营简报</p>
            </div>
          </div>
          <button
            onClick={resetData}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition"
          >
            ↻ 重置示例数据
          </button>
        </div>
        <div className="h-1 bg-gradient-to-r from-yellow-400 via-white to-yellow-400 opacity-60"></div>
      </header>

      {/* 演示数据声明 */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-6 py-2 text-xs text-amber-900 flex items-center gap-2">
          <span>ℹ️</span>
          <span>
            本页面为产品原型演示。赞助商层级和公司名基于公开信息，合同金额、权益明细、ROI 数据均为模拟，仅用于展示工具能力。AI 简报为预生成内容，离线演示版本。
          </span>
        </div>
      </div>

      {/* Tab 栏 */}
      <nav className="bg-slate-100 border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 flex items-end gap-1 pt-3">
          <TabButton
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          >
            赞助商总览
          </TabButton>
          <TabButton
            active={activeTab === "sponsors"}
            onClick={() => setActiveTab("sponsors")}
          >
            赞助商
          </TabButton>
        </div>
      </nav>

      {activeTab === "overview" && (
        <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          {/* KPI 概览 */}
          <section>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <KpiCard label="赞助商总数" value={summary.count} suffix="家" icon="🏅" />
              <KpiCard
                label="合同投入"
                value={formatEUR(summary.totalAmount)}
                icon="💰"
                sub={`承诺总价值 ${formatEUR(summary.totalContracted)}`}
              />
              <KpiCard
                label="已兑现价值"
                value={formatEUR(summary.totalDelivered)}
                icon="✅"
                valueColor="text-emerald-700"
                sub={`已兑现 ROI ${summary.realizedROI.toFixed(2)}x`}
              />
              <KpiCard
                label="组合预计 ROI"
                value={`${summary.portfolioROI.toFixed(2)}x`}
                icon="📈"
                valueColor={summary.portfolioROI >= 1 ? "text-emerald-700" : "text-red-600"}
                sub={summary.portfolioROI >= 1.3 ? "表现优秀" : summary.portfolioROI >= 1 ? "整体健康" : "需关注"}
              />
            </div>
          </section>

          {/* 商业概览：投入结构 + 续约时间轴 */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-white flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-lg font-bold">本赛季商业概览</h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  组合级财务结构 · 续约时间轴
                </p>
              </div>
              <ROIBadge multiplier={summary.portfolioROI} />
            </div>

            <div className="grid md:grid-cols-2 gap-6 p-6">
              <div>
                <ROIBreakdown sponsors={sponsors} />
              </div>
              <div>
                <RenewalTimeline sponsors={sponsors} />
              </div>
            </div>
          </section>
        </main>
      )}

      {activeTab === "sponsors" && (
        <main className="max-w-7xl mx-auto px-6 py-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">赞助商</h2>
              <p className="text-sm text-slate-500">点击卡片查看详情</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sponsors.map((s) => (
                <SponsorCard
                  key={s.id}
                  sponsor={s}
                  onClick={() => { setSelected(s); setAiReview(null); }}
                />
              ))}
            </div>
          </section>
        </main>
      )}

      {/* 详情 Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
          onClick={() => { setSelected(null); setAiReview(null); }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-8 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <SponsorDetail
              sponsor={selected}
              onClose={() => { setSelected(null); setAiReview(null); }}
              onUpdateDelivered={updateDelivered}
              onRunAI={runAIReview}
              aiReview={aiReview}
              loadingAI={loadingAI}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ======== Tab 按钮：立体标签卡片样式 ========
function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`relative px-6 py-3 font-semibold text-sm transition rounded-t-lg border-x border-t ${
        active
          ? "bg-white text-emerald-700 border-slate-200 shadow-[0_-2px_6px_rgba(0,0,0,0.04)] -mb-px z-10"
          : "bg-slate-200/70 text-slate-600 hover:bg-slate-200 hover:text-slate-800 border-transparent"
      }`}
    >
      {active && (
        <span className="absolute top-0 left-0 right-0 h-[3px] bg-emerald-600 rounded-t-lg"></span>
      )}
      {children}
    </button>
  );
}

// ======== 子组件 ========
function KpiCard({ label, value, suffix, icon, valueColor = "text-slate-900", sub }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-500">{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <div className={`text-2xl font-bold ${valueColor}`}>
        {value}
        {suffix && <span className="text-base text-slate-400 ml-1">{suffix}</span>}
      </div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  );
}

function ROIBadge({ multiplier }) {
  const h = roiHealth(multiplier);
  return (
    <div className={`px-4 py-2 rounded-full border ${h.border} ${h.bg} ${h.color} font-bold text-sm flex items-center gap-2`}>
      <span className="text-lg">{multiplier.toFixed(2)}x</span>
      <span>{h.label}</span>
    </div>
  );
}

function ROIBreakdown({ sponsors }) {
  const totalInvest = sponsors.reduce((a, s) => a + s.contractAmount, 0);
  const totalContracted = sponsors.reduce((a, s) => a + sponsorContractedValue(s), 0);
  const totalDelivered = sponsors.reduce((a, s) => a + sponsorDeliveredValue(s), 0);
  const deliveryRate = totalContracted > 0 ? (totalDelivered / totalContracted) * 100 : 0;

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700 mb-3">投入 → 承诺价值 → 已兑现</h3>
      <div className="space-y-3">
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
          <div className="text-xs text-slate-500 mb-1">合同投入</div>
          <div className="text-xl font-bold">{formatEUR(totalInvest)}</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-white rounded-lg p-3 border border-emerald-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500">合同承诺总价值</span>
            <span className="text-xs text-emerald-700 font-semibold">
              {(totalContracted / totalInvest).toFixed(2)}x 预计 ROI
            </span>
          </div>
          <div className="text-xl font-bold text-emerald-700">{formatEUR(totalContracted)}</div>

          <div className="mt-3 pt-3 border-t border-emerald-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-500">已兑现价值</span>
              <span className="text-xs font-semibold">{deliveryRate.toFixed(0)}% 兑现进度</span>
            </div>
            <div className="text-lg font-bold text-emerald-800">{formatEUR(totalDelivered)}</div>
            <div className="h-2 mt-2 bg-white rounded-full overflow-hidden border border-emerald-100">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${deliveryRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ======== 续约时间轴 ========
// 按合约结束日排序，展示未来 24 个月内到期的赞助商
function RenewalTimeline({ sponsors }) {
  const now = new Date();
  const twoYearsLater = new Date(now.getFullYear() + 2, now.getMonth(), 1);

  const upcoming = sponsors
    .map((s) => {
      const endDate = new Date(s.contractPeriod.end + "-01");
      const monthsLeft = (endDate.getFullYear() - now.getFullYear()) * 12 + (endDate.getMonth() - now.getMonth());
      return { sponsor: s, endDate, monthsLeft };
    })
    .filter((x) => x.endDate <= twoYearsLater)
    .sort((a, b) => a.endDate - b.endDate);

  // 已到期：灰色（已完结，不做评判）；其他所有未到期：统一琥珀色
  const urgencyStyle = (months) =>
    months <= 0 ? "bg-slate-200 text-slate-700" : "bg-amber-100 text-amber-800";
  const urgencyLabel = (months) => {
    if (months <= 0) return "已到期";
    if (months <= 12) return `${months}个月后`;
    return `${Math.round(months / 12 * 10) / 10}年后`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700">续约时间轴</h3>
        <span className="text-xs text-slate-500">未来 24 个月内到期 {upcoming.length} 家</span>
      </div>
      {upcoming.length === 0 ? (
        <div className="bg-slate-50 rounded-lg p-6 text-center text-sm text-slate-500">
          未来 24 个月内无合约到期
        </div>
      ) : (
        <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
          {upcoming.map(({ sponsor, monthsLeft }) => {
            const timeProgress = computeTimeProgress(sponsor.contractPeriod);
            const delivered = sponsorDeliveredValue(sponsor);
            const contracted = sponsorContractedValue(sponsor);
            const valueProgress = contracted > 0 ? (delivered / contracted) * 100 : 0;
            const isExpired = monthsLeft <= 0;

            // 三种状态：
            // 1) 已完结 · 最终兑现 X% → 灰色
            // 2) 兑现稳健（进度跟得上，gap >= -5%）→ 绿色
            // 3) 已完成 X%（落后于时间进度，gap < -5%）→ 红色（替代"显著落后"/"轻微落后"这种定性用词）
            let statusLabel, statusColor;
            if (isExpired) {
              statusLabel = `已完结 · 最终兑现 ${valueProgress.toFixed(0)}%`;
              statusColor = "text-slate-500";
            } else {
              const gap = valueProgress - timeProgress;
              if (gap >= -5) {
                statusLabel = "兑现稳健";
                statusColor = "text-emerald-700 font-semibold";
              } else {
                statusLabel = `已完成 ${valueProgress.toFixed(0)}%`;
                statusColor = "text-red-700 font-semibold";
              }
            }

            return (
              <div
                key={sponsor.id}
                className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition"
              >
                <div className={`shrink-0 px-2 py-1 rounded text-xs font-semibold min-w-[70px] text-center ${urgencyStyle(monthsLeft)}`}>
                  {urgencyLabel(monthsLeft)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-sm truncate">{sponsor.name}</div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                      {sponsor.tier}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    到期 {sponsor.contractPeriod.end} · <span className={statusColor}>{statusLabel}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


function SponsorCard({ sponsor, onClick }) {
  const completion = computeCompletion(sponsor.rights);
  const timeProgress = computeTimeProgress(sponsor.contractPeriod);
  const roi = computeROIMultiplier(sponsor);
  const health = roiHealth(roi);

  return (
    <button
      onClick={onClick}
      className="group text-left bg-white rounded-xl border border-slate-200 hover:border-emerald-400 hover:shadow-lg transition p-5 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-slate-100 text-slate-700">
            {sponsor.tier}
          </div>
          <h3 className="text-base font-bold mt-2 truncate">{sponsor.name}</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {sponsor.industry} · {sponsor.tierEn}
          </p>
        </div>
      </div>

      <div className="text-xs text-slate-600">
        <div className="flex items-center gap-1 text-slate-500 mb-0.5">
          <span>📅</span>
          <span>合作周期</span>
        </div>
        <div className="font-medium text-slate-800">{formatPeriod(sponsor.contractPeriod)}</div>
      </div>

      <div>
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-500">权益完成率</span>
          <span className="font-semibold">{completion.toFixed(0)}%</span>
        </div>
        <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              completion >= 70 ? "bg-emerald-500" : completion >= 50 ? "bg-amber-500" : "bg-red-500"
            }`}
            style={{ width: `${completion}%` }}
          ></div>
          <div
            className="absolute top-0 h-full w-0.5 bg-slate-700"
            style={{ left: `${timeProgress}%` }}
            title="时间进度"
          ></div>
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">竖线 = 时间进度 {timeProgress.toFixed(0)}%</div>
      </div>

      <div className={`rounded-lg ${health.bg} ${health.border} border px-3 py-2 flex items-center justify-between`}>
        <div className="text-xs text-slate-600">ROI</div>
        <div className="flex items-center gap-2">
          <span className={`font-bold text-lg ${health.color}`}>{roi.toFixed(2)}x</span>
          <span className={`text-xs font-semibold ${health.color}`}>{health.label}</span>
        </div>
      </div>

      <div className="text-xs text-emerald-700 font-medium group-hover:translate-x-0.5 transition">查看详情 →</div>
    </button>
  );
}

function SponsorDetail({ sponsor, onClose, onUpdateDelivered, onRunAI, aiReview, loadingAI }) {
  const tierStyle = TIER_STYLES[sponsor.tier] || TIER_STYLES["区域合作伙伴"];
  const completion = computeCompletion(sponsor.rights);
  const timeProgress = computeTimeProgress(sponsor.contractPeriod);
  const roi = computeROIMultiplier(sponsor);
  const contractedValue = sponsorContractedValue(sponsor);
  const deliveredValue = sponsorDeliveredValue(sponsor);
  const valueDeliveryRate = contractedValue > 0 ? (deliveredValue / contractedValue) * 100 : 0;
  const health = roiHealth(roi);

  // 按权益类型分两大组，每组再按 category 分类
  const entitlements = sponsor.rights.filter((r) => r.rightType === "entitlement");
  const activations = sponsor.rights.filter((r) => r.rightType === "activation");
  const entitlementValue = entitlements.reduce((a, r) => a + rightContractedValue(r), 0);
  const activationContractValue = activations.reduce((a, r) => a + rightContractedValue(r), 0);
  const activationDelivered = activations.reduce((a, r) => a + rightDeliveredValue(r), 0);
  const activationProgress = activationContractValue > 0 ? (activationDelivered / activationContractValue) * 100 : 0;

  // 执行型按 category 再分组
  const activationGrouped = activations.reduce((acc, r) => {
    (acc[r.category] = acc[r.category] || []).push(r);
    return acc;
  }, {});

  return (
    <div>
      {/* 详情头部 */}
      <div className={`${tierStyle.bg} ${tierStyle.text} px-6 py-5 flex items-start justify-between gap-4`}>
        <div className="flex-1 min-w-0">
          <div className="text-xs opacity-90 mb-1">
            {sponsor.tierEn} · {sponsor.industry}
          </div>
          <h2 className="text-2xl font-bold">{sponsor.name}</h2>
          <p className="text-sm opacity-90 mt-1">{sponsor.note}</p>
        </div>
        <button
          onClick={onClose}
          className="text-white/90 hover:text-white text-2xl leading-none px-2 shrink-0"
          aria-label="关闭"
        >
          ×
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* 合同 + 对接人信息 */}
        <div className="grid md:grid-cols-3 gap-4">
          <InfoBox title="合同金额">
              <div className="text-2xl font-bold text-slate-900">{formatEUR(sponsor.contractAmount)}</div>
              <div className="text-xs text-slate-500 mt-0.5">每赛季（含营销执行）</div>
            </InfoBox>
            <InfoBox title="合作周期">
              <div className="text-base font-semibold text-slate-900">{formatPeriod(sponsor.contractPeriod)}</div>
              <div className="text-xs text-slate-500 mt-0.5">
                时间进度 {timeProgress.toFixed(0)}% · 权益完成 {completion.toFixed(0)}%
              </div>
            </InfoBox>
            <InfoBox title="对接人">
              <div className="text-base font-semibold text-slate-900">{sponsor.contact.name}</div>
              <div className="text-xs text-slate-500 mt-0.5">{sponsor.contact.email}</div>
              <div className="text-xs text-slate-500">{sponsor.contact.phone}</div>
            </InfoBox>
          </div>

          {/* ROI 价值分解：投入 → 合同承诺总价值 → 已兑现 */}
          <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 rounded-xl border border-emerald-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-800">ROI 价值分解</h3>
                <p className="text-xs text-slate-500 mt-0.5">所有数字来自权益明细聚合，修改下方权益的已交付数，会直接更新这里</p>
              </div>
              <div className={`px-3 py-1 rounded-full border ${health.border} ${health.bg} ${health.color} text-sm font-bold`}>
                {roi.toFixed(2)}x · {health.label}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricTile label="合同投入" value={formatEUR(sponsor.contractAmount)} />
              <MetricTile
                label="合同承诺总价值"
                value={formatEUR(contractedValue)}
                color="text-emerald-700"
                sub={`预计 ROI ${roi.toFixed(2)}x`}
              />
              <MetricTile
                label="已兑现价值"
                value={formatEUR(deliveredValue)}
                color="text-emerald-800"
                sub={`兑现进度 ${valueDeliveryRate.toFixed(0)}%`}
              />
              <MetricTile
                label="预计净收益"
                value={formatEUR(contractedValue - sponsor.contractAmount)}
                color={contractedValue >= sponsor.contractAmount ? "text-emerald-700" : "text-red-600"}
              />
            </div>
            <div className="mt-4 pt-4 border-t border-emerald-200 flex items-center justify-between flex-wrap gap-2">
              <div className="text-xs text-slate-500">
                媒体曝光 <span className="font-semibold text-slate-700">{formatNum(sponsor.metrics.impressions)} 次</span>
                <span className="mx-2 text-slate-300">·</span>
                社媒触达 <span className="font-semibold text-slate-700">{formatNum(sponsor.metrics.socialReach)} 人次</span>
              </div>
              <div className="flex-1 min-w-[180px] max-w-xs">
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${valueDeliveryRate}%` }}
                  ></div>
                  <div
                    className="absolute top-0 h-full w-0.5 bg-slate-700"
                    style={{ left: `${timeProgress}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 text-right">
                  竖线 = 时间进度 {timeProgress.toFixed(0)}%
                </div>
              </div>
            </div>
          </div>

          {/* 履约型权益：合约锁定，默认自动兑现 */}
          {entitlements.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <span className="text-lg">🔒</span>
                    履约型权益
                    <span className="text-xs font-normal text-slate-500 ml-1">（合约锁定 · 自动兑现）</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    合约生效即持续履约，不需主动排期。追踪重点是履约异常，而非完成率。
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-slate-500">锁定价值贡献</div>
                  <div className="text-lg font-bold text-emerald-700">{formatEUR(entitlementValue)}</div>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {entitlements.map((r) => {
                  const contractedVal = rightContractedValue(r);
                  const shareOfTotal = contractedValue > 0 ? (contractedVal / contractedValue) * 100 : 0;
                  return (
                    <div
                      key={r.id}
                      className="bg-gradient-to-br from-emerald-50 to-white rounded-lg border border-emerald-200 p-4"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-900">{r.type}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{r.category}</div>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-xs font-medium shrink-0">
                          ✓ 正常履约中
                        </span>
                      </div>
                      <div className="flex items-end justify-between pt-2 border-t border-emerald-100">
                        <div>
                          <div className="text-xs text-slate-500">锁定价值</div>
                          <div className="text-base font-bold text-emerald-700">{formatEUR(contractedVal)}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-500">占总价值</div>
                          <div className="text-sm font-semibold text-slate-700">{shareOfTotal.toFixed(1)}%</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 执行型权益：需主动排期/创意/邀请 */}
          {activations.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <span className="text-lg">🎯</span>
                    执行型权益
                    <span className="text-xs font-normal text-slate-500 ml-1">（需主动排期 · 运营重点）</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    这些权益需要运营团队主动推进，完成率对比时间进度才有管理意义。
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-slate-500">价值兑现进度</div>
                  <div className="text-lg font-bold text-slate-800">
                    {formatEUR(activationDelivered)}
                    <span className="text-xs text-slate-500 font-normal ml-1">/ {formatEUR(activationContractValue)}</span>
                  </div>
                  <div className="text-xs text-emerald-700 font-semibold">{activationProgress.toFixed(0)}% 已兑现</div>
                </div>
              </div>
              <div className="space-y-4">
                {Object.entries(activationGrouped).map(([category, items]) => (
                  <div key={category}>
                    <div className="text-xs font-semibold text-emerald-700 mb-2 flex items-center gap-1">
                      <span className="w-1 h-4 bg-emerald-600 rounded"></span>
                      {category}
                    </div>
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-sm min-w-[720px]">
                        <thead className="bg-slate-50 text-slate-600">
                          <tr>
                            <th className="text-left px-3 py-2 font-medium">权益子项</th>
                            <th className="text-center px-3 py-2 font-medium">合同承诺</th>
                            <th className="text-center px-3 py-2 font-medium">已兑现</th>
                            <th className="text-center px-3 py-2 font-medium w-40">完成率</th>
                            <th className="text-center px-3 py-2 font-medium">操作</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {items.map((r) => {
                            const rate = (r.delivered / r.required) * 100;
                            const deliveredVal = rightDeliveredValue(r);
                            const contractedVal = rightContractedValue(r);
                            return (
                              <tr key={r.id} className="hover:bg-slate-50 align-top">
                                <td className="px-3 py-3">
                                  <div className="font-medium text-slate-900">{r.type}</div>
                                  <div className="text-xs text-slate-500 mt-0.5">
                                    单价 {formatEUR(r.valuePerUnit)} / {r.unit}
                                  </div>
                                </td>
                                <td className="px-3 py-3 text-center">
                                  <div className="text-slate-700">
                                    {r.required}
                                    <span className="text-xs text-slate-400 ml-0.5">{r.unit}</span>
                                  </div>
                                  <div className="text-xs text-slate-500 mt-0.5">{formatEUR(contractedVal)}</div>
                                </td>
                                <td className="px-3 py-3 text-center">
                                  <div className="font-semibold text-slate-900">
                                    {r.delivered}
                                    <span className="text-xs text-slate-400 ml-0.5">{r.unit}</span>
                                  </div>
                                  <div className="text-xs text-emerald-700 font-semibold mt-0.5">
                                    {formatEUR(deliveredVal)}
                                  </div>
                                </td>
                                <td className="px-3 py-3">
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                      <div
                                        className={`h-full ${rate >= 95 ? "bg-emerald-500" : rate >= 70 ? "bg-yellow-500" : "bg-red-500"}`}
                                        style={{ width: `${Math.min(rate, 100)}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-xs font-semibold min-w-[32px] text-right">{rate.toFixed(0)}%</span>
                                  </div>
                                </td>
                                <td className="px-3 py-3 text-center">
                                  <div className="inline-flex items-center gap-1">
                                    <button
                                      onClick={() => onUpdateDelivered(sponsor.id, r.id, -1)}
                                      className="w-6 h-6 rounded border border-slate-200 hover:bg-slate-100 text-xs"
                                      aria-label="减少"
                                    >−</button>
                                    <button
                                      onClick={() => onUpdateDelivered(sponsor.id, r.id, 1)}
                                      className="w-6 h-6 rounded border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs"
                                      aria-label="增加"
                                    >+</button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI 复盘 */}
          <div className="bg-gradient-to-br from-slate-900 to-emerald-900 rounded-xl p-5 text-white">
            <div className="flex items-center justify-between mb-3 gap-4">
              <div className="min-w-0">
                <h3 className="font-bold text-lg flex items-center gap-2 flex-wrap">
                  <span>📋</span>
                  <span className="truncate">云达不莱梅 × {sponsor.name} 品牌运营简报</span>
                </h3>
                <p className="text-xs text-emerald-100 mt-1">
                  基于当前权益交付与 ROI 数据生成
                </p>
              </div>
              <button
                onClick={() => onRunAI(sponsor)}
                disabled={loadingAI}
                className="px-4 py-2 bg-white text-emerald-800 rounded-lg font-semibold hover:bg-emerald-50 transition disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
              >
                {loadingAI ? "撰写中…" : "生成简报"}
              </button>
            </div>
            {aiReview && (
              <div className="bg-white/95 text-slate-800 rounded-lg p-5 text-sm whitespace-pre-wrap leading-7 max-h-96 overflow-y-auto">
                {cleanMarkdown(aiReview)}
              </div>
            )}
            {!aiReview && !loadingAI && (
              <div className="bg-white/10 border border-white/20 rounded-lg p-4 text-sm text-emerald-100">
                点击右上角"生成简报"获取本期运营简报
              </div>
            )}
          </div>
        </div>
      </div>
    );
}

function InfoBox({ title, children }) {
  return (
    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
      <div className="text-xs text-slate-500 mb-1.5">{title}</div>
      {children}
    </div>
  );
}

function MetricTile({ label, value, sub, color = "text-slate-900" }) {
  return (
    <div className="bg-white rounded-lg border border-emerald-100 p-3">
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className={`text-lg font-bold ${color}`}>
        {value}
        {sub && <span className="text-xs text-slate-400 ml-1 font-normal">{sub}</span>}
      </div>
    </div>
  );
}
