export interface PlaceInfo {
  id: string;
  name: string;
  category: 'location' | 'merchant' | 'institution';
  icon: string;
  address: string;
  description: string;
  details: string[];
  surroundingInfo: string[];
  searchKeywords: string[];
  relatedProfiles?: string[];
}

export const PLACES: PlaceInfo[] = [
  {
    id: 'place-plantation',
    name: '南郊山茶种植园',
    category: 'location',
    icon: '🌺',
    address: '鹤城市城南新区以南8公里，靠近环城高速南段',
    description: '本地区唯一的山茶花规模化种植地，占地约200亩。',
    details: [
      '主要产品：山茶花鲜切花、山茶花苗、山茶花茶',
      '从业人数：约30人（含货运司机、花农、管理人员）',
      '开放时间：全年开放，8:00-18:00',
      '特色：本地区唯一的山茶花规模化种植地，每年1-4月为盛花期',
    ],
    surroundingInfo: [
      '距城南社区卫生服务站约3公里',
      '距环城高速南匝道入口约2公里',
      '周边为农业用地，人口密度低',
      '附近有万家达批发市场（约5公里）',
    ],
    searchKeywords: ['南郊', '山茶', '种植园', '山茶花', '茶园', '南郊种植园', '花'],
    relatedProfiles: ['profile-a'],
  },
  {
    id: 'place-market',
    name: '万家达批发市场',
    category: 'merchant',
    icon: '🏪',
    address: '鹤城市城南新区，靠近南郊',
    description: '城南大型综合批发市场，涵盖日用百货、食品、家居用品等品类。',
    details: [
      '营业时间：6:00-18:00',
      '商户数量：200+',
      '主营品类：日用百货、食品饮料、家居用品、清洁用品',
      '黑色加厚垃圾袋和保鲜膜在市场内多家商户有售',
    ],
    surroundingInfo: [
      '位于城南新区，距南郊山茶种植园约5公里',
      '交通便利，环城高速南段出口附近',
      '周边有多个居民小区',
    ],
    searchKeywords: ['批发市场', '万家达', '市场', '城南', '批发', '百货', '垃圾袋', '保鲜膜'],
  },
  {
    id: 'place-clinic',
    name: '城南社区卫生服务站',
    category: 'institution',
    icon: '🏥',
    address: '鹤城市南郊新区XX路XX号',
    description: '社区基层医疗机构，为周边居民提供全科诊疗服务。',
    details: [
      '服务范围：全科诊疗、清创缝合、基础外科、预防接种',
      '医护人员：约15人',
      '常用物资：医用酒精、手术器械、一次性口罩',
      '备有75%医用酒精和各类一次性口罩（含薄荷味款）',
    ],
    surroundingInfo: [
      '位于南郊新区，距南郊山茶种植园约3公里',
      '距环城高速南匝道入口约4公里',
      '周边有多个居民小区和商业区',
    ],
    searchKeywords: ['卫生服务站', '社区医院', '城南医院', '诊所', '社区医疗', '南郊', '医生', '李文彬'],
    relatedProfiles: ['profile-b'],
  },
  {
    id: 'place-market2',
    name: '城北农贸市场',
    category: 'merchant',
    icon: '🥩',
    address: '鹤城市城北老城区',
    description: '城北最大的农贸市场，设有鲜肉区、蔬菜区、水产区等。',
    details: [
      '营业时间：5:00-19:00',
      '赵刚在鲜肉区从事猪肉屠宰和销售工作',
      '日均屠宰量：约20头猪',
      '屠宰工具：专业屠宰刀、砍骨刀等',
    ],
    surroundingInfo: [
      '位于城北老城区，居民密集',
      '距环城高速较远（约15公里）',
      '周边为老居民区',
    ],
    searchKeywords: ['农贸市场', '菜市场', '屠宰', '杀猪', '城北', '猪肉', '赵刚', '市场'],
    relatedProfiles: ['profile-c'],
  },
  {
    id: 'place-garage',
    name: '城东汽车修理厂',
    category: 'merchant',
    icon: '🔧',
    address: '鹤城市城东工业区',
    description: '综合汽车维修厂，提供发动机、底盘、钣金喷漆等服务。',
    details: [
      '营业时间：8:00-20:00',
      '员工：约10人',
      '周明在此担任技师，擅长发动机和底盘维修',
      '维修厂偶尔允许员工借用客户车辆外出试车',
    ],
    surroundingInfo: [
      '位于城东工业区，周边为工厂和仓储',
      '距环城高速较远（约12公里）',
      '距城郊如家酒店约8公里',
    ],
    searchKeywords: ['汽修厂', '修车', '汽车修理', '修理厂', '城东', '技师', '周明', '发动机'],
    relatedProfiles: ['profile-d'],
  },
  {
    id: 'place-hotel',
    name: '如家快捷酒店（城郊店）',
    category: 'location',
    icon: '🏨',
    address: '鹤城市城郊结合部',
    description: '连锁经济型酒店，位于城郊结合部，外来务工人员入住较多。',
    details: [
      '监控覆盖：大堂、走廊、电梯、停车场全覆盖',
      '3名受害人失踪前均在此酒店出现',
      '近期已加强安保，增设24小时轮班保安',
      '警方已多次调取监控录像',
    ],
    surroundingInfo: [
      '位于城郊结合部，靠近环城高速入口',
      '周边有多个小型商铺和餐馆',
      '酒店隔壁有一家小型超市',
    ],
    searchKeywords: ['如家酒店', '城郊酒店', '连锁酒店', '酒店', '如家', '快捷', '城郊'],
  },
];

export function getPlaceById(id: string): PlaceInfo | undefined {
  return PLACES.find((p) => p.id === id);
}