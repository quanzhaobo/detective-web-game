export type ClueCategory = 'evidence' | 'forensic' | 'surveillance' | 'trace' | 'psychology';

export interface Clue {
  id: string;
  name: string;
  category: ClueCategory;
  chapter: number;
  description: string;
  detail: string;
}

export const CATEGORY_LABELS: Record<ClueCategory, string> = {
  evidence: '🔬 物证类',
  forensic: '🩺 法医类',
  surveillance: '📹 监控类',
  trace: '🔎 溯源类',
  psychology: '🧠 心理侧写',
};

export const ALL_CLUES: Clue[] = [
  // ========== 物证类 (6条) ==========
  {
    id: 'E01',
    name: '运动鞋印',
    category: 'evidence',
    chapter: 1,
    description: '42码男士运动鞋印，橡胶底纹',
    detail: '42码男士运动鞋，橡胶底纹含泥沙+微量山茶花粉，磨损特征符合常年驾车踩离合刹车。',
  },
  {
    id: 'E02',
    name: '混合指纹',
    category: 'evidence',
    chapter: 1,
    description: '残缺混合指纹，含男女两份DNA',
    detail: '残缺混合指纹含男性DNA + 女性DNA，女性DNA与3号受害人完全匹配。男性DNA未录入公安数据库，非前科人员。',
  },
  {
    id: 'E03',
    name: '黑色垃圾袋',
    category: 'evidence',
    chapter: 3,
    description: '全新黑色加厚垃圾袋',
    detail: '全新黑色加厚垃圾袋，本地批发市场流通款，未提取到指纹。凶手在本地有采购渠道。',
  },
  {
    id: 'E04',
    name: '透明保鲜膜',
    category: 'evidence',
    chapter: 3,
    description: '透明保鲜膜，本地流通款',
    detail: '透明保鲜膜，本地批发市场流通款，与垃圾袋同来源。未提取到指纹。',
  },
  {
    id: 'E05',
    name: '山茶花粉',
    category: 'evidence',
    chapter: 3,
    description: '鞋底纹线中提取到山茶花粉',
    detail: '山茶花粉仅本市南郊山茶种植园独有，该种植园是本地区唯一的山茶花规模化种植地。凶手活动区域与南郊有关联。',
  },
  {
    id: 'E06',
    name: '南方红壤颗粒',
    category: 'evidence',
    chapter: 2,
    description: '受害人指甲缝检出南方红壤',
    detail: '受害人指甲缝检出南方红壤土壤颗粒。该土壤类型常见于我国南方地区，非本地土壤特征。凶手鞋底或衣物可能携带南方红壤。',
  },

  // ========== 法医类 (6条) ==========
  {
    id: 'F01',
    name: '死因：机械性窒息',
    category: 'forensic',
    chapter: 2,
    description: '3名死者均死于机械性窒息',
    detail: '3名死者均为机械性窒息死亡（扼颈/勒颈），死因一致，手法相同。',
  },
  {
    id: 'F02',
    name: '分尸时间窗口',
    category: 'forensic',
    chapter: 2,
    description: '死后12小时内被分尸',
    detail: '死后12小时内被分尸。凶手有充裕的隐蔽空间和固定作案场所，排除临时起意。',
  },
  {
    id: 'F03',
    name: '分尸工具与手法',
    category: 'forensic',
    chapter: 2,
    description: '家用菜刀+美工刀，切口整齐',
    detail: '分尸工具为家用菜刀+美工刀，切口整齐、关节分离精准。手法冷静，具备基础解剖常识，可能从事医学/兽医/屠宰相关职业。刀痕方向分析显示凶手惯用右手。',
  },
  {
    id: 'F04',
    name: '医用酒精残留',
    category: 'forensic',
    chapter: 2,
    description: '尸块皮肤检出75%医用酒精',
    detail: '尸块皮肤有微量75%医用酒精残留。凶手有医用酒精获取渠道或使用习惯，可能从事医疗相关工作。',
  },
  {
    id: 'F05',
    name: '薄荷味熔喷布纤维',
    category: 'forensic',
    chapter: 2,
    description: '尸块皮肤附着口罩熔喷布纤维',
    detail: '尸块皮肤残留薄荷味口罩熔喷布纤维。凶手作业时佩戴口罩，该纤维为凶手所佩戴口罩残留，非受害人自身携带。',
  },
  {
    id: 'F06',
    name: '男性表皮组织',
    category: 'forensic',
    chapter: 2,
    description: '受害人指甲缝检出男性表皮',
    detail: '受害人指甲缝检出男性表皮组织，DNA与混合指纹中的男性DNA一致。受害人死前有反抗行为，凶手被抓伤。',
  },

  // ========== 监控类 (4条) ==========
  {
    id: 'S01',
    name: '同行男性',
    category: 'surveillance',
    chapter: 4,
    description: '受害人失踪前均与同一特征男性同行',
    detail: '酒店监控显示，3名受害人失踪前均与一名男性同行，该男性特征一致。凶手主动接近受害人。',
  },
  {
    id: 'S02',
    name: '本地口音',
    category: 'surveillance',
    chapter: 4,
    description: '嫌疑人操本地口音',
    detail: '监控录音显示该男性操本地口音。凶手为本地人或长期在本地居住生活。',
  },
  {
    id: 'S03',
    name: '外貌与口罩特征',
    category: 'surveillance',
    chapter: 4,
    description: '身高178cm，戴黑色薄荷口罩',
    detail: '身高178cm左右，戴黑色薄荷口罩，全程未摘口罩。反侦察意识极强，刻意避免面部被识别。',
  },
  {
    id: 'S04',
    name: '深色SUV车辆',
    category: 'surveillance',
    chapter: 4,
    description: '驾驶深色SUV离开，仅拍到车尾无牌照',
    detail: '离开时驾驶一辆深色SUV，监控仅拍到车尾且无牌照。车辆可能为外地套牌或故意遮挡号牌。',
  },

  // ========== 溯源类 (3条) ==========
  {
    id: 'T01',
    name: '批发市场采购',
    category: 'trace',
    chapter: 3,
    description: '垃圾袋/保鲜膜为本地批发市场流通款',
    detail: '垃圾袋和保鲜膜均为本地批发市场流通款，属于大宗常见商品。凶手在本地有生活基础和采购渠道。',
  },
  {
    id: 'T02',
    name: '花粉产地锁定',
    category: 'trace',
    chapter: 3,
    description: '山茶花粉仅南郊种植园独有',
    detail: '经植物学鉴定，该山茶花粉仅产自本市南郊山茶种植园，为本地区唯一规模化种植地。凶手工作或经常出入南郊区域。',
  },
  {
    id: 'T03',
    name: '口罩品牌溯源',
    category: 'trace',
    chapter: 5,
    description: '薄荷味口罩为某品牌长期在售款',
    detail: '薄荷味口罩为某品牌长期在售款，非一次性临时购买。凶手有长期佩戴该品牌口罩的习惯，非作案时临时购置。',
  },

  // ========== 心理侧写类 (4条) ==========
  {
    id: 'P01',
    name: '反侦察能力极强',
    category: 'psychology',
    chapter: 5,
    description: '抛尸路线避开所有天网摄像头',
    detail: '抛尸路线刻意避开所有天网摄像头，熟悉本地路网和监控分布。凶手对本地环境极为了解，反侦察训练有素。',
  },
  {
    id: 'P02',
    name: '具备解剖常识',
    category: 'psychology',
    chapter: 5,
    description: '分尸手法冷静，关节分离精准',
    detail: '分尸手法冷静且具备基础解剖常识，关节分离精准。可能从事医学、兽医或屠宰相关职业。',
  },
  {
    id: 'P03',
    name: '无性侵行为',
    category: 'psychology',
    chapter: 5,
    description: '3名受害者均无性侵痕迹',
    detail: '3名受害者均无性侵痕迹。杀人动机非性驱动，排除性侵未遂杀人的可能性。',
  },
  {
    id: 'P04',
    name: '固定作案周期',
    category: 'psychology',
    chapter: 5,
    description: '作案周期固定为每18天1起',
    detail: '作案周期固定为每18天1起，呈现明显的仪式化/强迫性特征。符合偏执型人格障碍的行为模式，非反社会人格的典型表现。',
  },
];
