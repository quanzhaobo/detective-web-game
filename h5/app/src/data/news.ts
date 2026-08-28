export interface NewsContentBlock {
  id: string;
  text: string;
  type: 'text' | 'quote' | 'heading';
  clueId?: string;
  markable: boolean;
}

export interface NewsArticle {
  id: string;
  title: string;
  date: string;
  author: string;
  source: string;
  category: string;
  content: NewsContentBlock[];
  relatedArticles: string[];
  searchKeywords: string[];
  clueIds: string[];
}

export const NEWS_CATEGORIES = [
  { id: 'all', name: '全部' },
  { id: 'police', name: '警方通报' },
  { id: 'society', name: '社会新闻' },
  { id: 'investigation', name: '案件调查' },
];

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'news-1',
    title: '市公安局关于近期女性失踪案的警情通报',
    date: '2026-04-21',
    author: '鹤城新闻网',
    source: '鹤城市公安局',
    category: 'police',
    content: [
      {
        id: 'n1-1',
        text: '近日，我市连续发生多起女性失踪案件，引发社会广泛关注。鹤城市公安局高度重视，现将有关情况通报如下：',
        type: 'text',
        markable: false,
      },
      {
        id: 'n1-2',
        text: '一、案件基本情况',
        type: 'heading',
        markable: false,
      },
      {
        id: 'n1-3',
        text: '自2026年3月至今，我市已连续发生3起女性失踪案件。失踪者均为外地来鹤城务工的年轻女性，年龄在20至28岁之间。三名失踪者失踪前均曾现身于城郊"如家快捷"连锁酒店。',
        type: 'text',
        markable: false,
      },
      {
        id: 'n1-4',
        text: '二、案件进展',
        type: 'heading',
        markable: false,
      },
      {
        id: 'n1-5',
        text: '经侦查，在环城高速不同匝道的绿化带中，先后发现被分尸的遗体残块。尸块被包裹在全新黑色加厚垃圾袋内，外层缠绕透明保鲜膜。包裹物表面未提取到任何指纹。案件性质恶劣，已引起公安机关高度重视。',
        type: 'text',
        markable: false,
      },
      {
        id: 'n1-6',
        text: '三、工作部署',
        type: 'heading',
        markable: false,
      },
      {
        id: 'n1-7',
        text: '市公安局已成立专案组，由刑侦支队陈队担任组长，抽调精干力量全力侦办此案。同时，警方呼吁广大市民积极提供线索，共同维护社会治安。',
        type: 'text',
        markable: false,
      },
      {
        id: 'n1-8',
        text: '如有市民掌握相关线索，请拨打举报热线：110，或通过清风论坛"收集箱"板块提交。公安机关将对举报人信息严格保密。',
        type: 'text',
        markable: false,
      },
    ],
    relatedArticles: ['news-2', 'news-3', 'news-4'],
    searchKeywords: ['失踪案', '碎尸案', '连环案', '警情通报', '专案组', '陈队', '如家酒店', '环城高速', '公务', '女性'],
    clueIds: [],
  },
  {
    id: 'news-2',
    title: '环城高速绿化带再现人体残块，警方封锁现场',
    date: '2026-04-20',
    author: '记者 张明',
    source: '鹤城新闻网',
    category: 'society',
    content: [
      {
        id: 'n2-1',
        text: '本报记者 张明',
        type: 'text',
        markable: false,
      },
      {
        id: 'n2-2',
        text: '今日凌晨6时许，一名环卫工人在环城高速南段匝道绿化带内发现可疑包裹，经确认系人体残块。这是近期第三起类似案件。',
        type: 'text',
        markable: false,
      },
      {
        id: 'n2-3',
        text: '现场直击',
        type: 'heading',
        markable: false,
      },
      {
        id: 'n2-4',
        text: '记者赶到现场时，环城高速南段匝道已被警方封锁。据现场民警介绍，尸块被包裹在黑色垃圾袋中，外层缠绕保鲜膜，与之前两起案件的手法完全一致。',
        type: 'text',
        markable: false,
      },
      {
        id: 'n2-5',
        text: '发现地点的绿化带位于匝道拐弯处，距离主路约50米，较为隐蔽。该路段夜间车流量较少，周边无监控摄像头覆盖。',
        type: 'text',
        markable: false,
      },
      {
        id: 'n2-6',
        text: '前两起案件回顾',
        type: 'heading',
        markable: false,
      },
      {
        id: 'n2-7',
        text: '第一次发现尸块为3月15日，地点在环城高速东段匝道；第二次为4月2日，地点在环城高速西段匝道。三次抛尸均选择在高速公路匝道绿化带，远离主路，且周边均无监控覆盖。',
        type: 'text',
        markable: false,
      },
      {
        id: 'n2-8',
        text: '目前，警方已提取现场痕迹，并对周边区域展开地毯式搜索。本报将持续关注案件进展。',
        type: 'text',
        markable: false,
      },
    ],
    relatedArticles: ['news-1', 'news-3'],
    searchKeywords: ['环城高速', '抛尸', '匝道', '绿化带', '人体残块', '尸块', '封锁', '现场', '南段'],
    clueIds: [],
  },
  {
    id: 'news-3',
    title: '法医专家：三名受害者均死于机械性窒息',
    date: '2026-04-22',
    author: '记者 李华',
    source: '鹤城新闻网',
    category: 'investigation',
    content: [
      {
        id: 'n3-1',
        text: '本报记者 李华',
        type: 'text',
        markable: false,
      },
      {
        id: 'n3-2',
        text: '今日，记者专访了参与本案尸检工作的主检法医林正明主任医师。林法医就目前公开的尸检信息进行了说明。',
        type: 'text',
        markable: false,
      },
      {
        id: 'n3-3',
        text: '死因确认',
        type: 'heading',
        markable: false,
      },
      {
        id: 'n3-4',
        text: '据林法医介绍，三名死者均为机械性窒息死亡。颈部可见扼压痕迹，舌骨大角骨折，符合扼颈或勒颈致死的特征。三人死因一致，手法相同，可以确定系同一人所为。',
        type: 'text',
        markable: true,
        clueId: 'F01',
      },
      {
        id: 'n3-5',
        text: '分尸时间窗口',
        type: 'heading',
        markable: false,
      },
      {
        id: 'n3-6',
        text: '根据尸僵、尸斑及胃内容物消化程度综合判定，三名死者均在死后12小时内被分尸。林法医表示，这一时间窗口表明凶手有充裕的隐蔽空间和固定的作案场所，排除临时起意或野外作案的可能性。',
        type: 'text',
        markable: true,
        clueId: 'F02',
      },
      {
        id: 'n3-7',
        text: '微量物证',
        type: 'heading',
        markable: false,
      },
      {
        id: 'n3-8',
        text: '林法医还透露，在尸块表面检测到了一些微量物证，包括某些纤维残留和化学物质。但具体成分和来源仍在进一步分析中，暂不便对外公布详细结果。',
        type: 'text',
        markable: true,
        clueId: 'E02',
      },
      {
        id: 'n3-8b',
        text: '此外，在包裹尸块的保鲜膜内侧提取到一组残缺混合指纹，经鉴定含有男性DNA和女性DNA两份样本。女性DNA与3号受害人完全匹配，男性DNA未录入公安数据库，非前科人员。',
        type: 'text',
        markable: true,
        clueId: 'F06',
      },
      {
        id: 'n3-9',
        text: '此外，受害人指甲缝中检出了一些特殊土壤颗粒，经初步分析，并非本地常见土壤类型。这一发现或将为锁定凶手活动范围提供重要线索。',
        type: 'text',
        markable: true,
        clueId: 'E06',
      },
      {
        id: 'n3-10',
        text: '林法医强调，目前案件仍在侦办阶段，部分检验结果尚需进一步复核。本报将持续关注案件进展。',
        type: 'text',
        markable: false,
      },
    ],
    relatedArticles: ['news-1', 'news-5', 'news-6'],
    searchKeywords: ['法医', '尸检', '死因', '窒息', '机械性窒息', '林正明', '分尸', '12小时', '土壤', '指甲', '微量物证'],
    clueIds: ['F01', 'F02', 'E02', 'F06', 'E06'],
  },
  {
    id: 'news-4',
    title: '警方呼吁市民提供线索，设立举报热线',
    date: '2026-04-23',
    author: '鹤城新闻网',
    source: '鹤城市公安局',
    category: 'police',
    content: [
      {
        id: 'n4-1',
        text: '今日，鹤城市公安局召开新闻发布会，专案组组长陈队就近期连环女性失踪案向社会公开征集线索。',
        type: 'text',
        markable: false,
      },
      {
        id: 'n4-2',
        text: '陈队在发布会上表示："本案性质恶劣，影响重大。我们呼吁广大市民，如果您在3月12日、3月30日、4月17日前后，在环城高速沿线或城郊如家酒店附近发现任何可疑人员或车辆，请及时与警方联系。"',
        type: 'quote',
        markable: false,
      },
      {
        id: 'n4-3',
        text: '陈队透露，目前案件已取得一定进展，但仍有大量线索需要核实。警方已在清风推理论坛设立"民间线索收集箱"，欢迎市民通过该渠道提交有价值的线索和分析。',
        type: 'text',
        markable: false,
      },
      {
        id: 'n4-4',
        text: '警方特别提醒：市民提供线索时请务必如实反映，切勿散布谣言或提供虚假信息。对于提供关键线索协助破案的市民，将给予适当奖励。',
        type: 'text',
        markable: false,
      },
      {
        id: 'n4-5',
        text: '举报热线：110',
        type: 'text',
        markable: false,
      },
    ],
    relatedArticles: ['news-1', 'news-8'],
    searchKeywords: ['线索', '举报', '热线', '警方', '陈队', '收集箱', '市民', '征集'],
    clueIds: [],
  },
  {
    id: 'news-5',
    title: '物证溯源有突破：包裹材料为本地市场流通品',
    date: '2026-04-25',
    author: '记者 王芳',
    source: '鹤城新闻网',
    category: 'investigation',
    content: [
      {
        id: 'n5-1',
        text: '本报记者 王芳',
        type: 'text',
        markable: false,
      },
      {
        id: 'n5-2',
        text: '记者今日从专案组获悉，包裹尸块所用材料的来源调查取得重要进展。',
        type: 'text',
        markable: false,
      },
      {
        id: 'n5-3',
        text: '经物证技术科鉴定，包裹尸块所用的黑色加厚垃圾袋和透明保鲜膜均为无品牌通用型产品，属于大宗常见商品。经走访排查，此类产品在本市城南"万家达"批发市场多家商户均有销售。',
        type: 'text',
        markable: true,
        clueId: 'T01',
      },
      {
        id: 'n5-4',
        text: '物证技术科负责人表示，黑色加厚垃圾袋规格为60cm×80cm，透明保鲜膜同为通用型。由于这些产品属于大宗流通商品，无品牌标识，暂时无法通过品牌或批次锁定具体购买者。',
        type: 'text',
        markable: true,
        clueId: 'E03',
      },
      {
        id: 'n5-5',
        text: '但这一发现至少确认了一点：凶手是在本地采购的作案工具，而非通过电商平台购买。这说明凶手在本地有稳定的生活基础和采购渠道，熟悉本地市场环境。',
        type: 'text',
        markable: true,
        clueId: 'E04',
      },
      {
        id: 'n5-6',
        text: '此外，记者了解到，专案组正在对万家达批发市场周边的监控录像进行调取分析，以排查近期大量购买此类物品的可疑人员。',
        type: 'text',
        markable: false,
      },
    ],
    relatedArticles: ['news-3', 'news-6'],
    searchKeywords: ['物证', '溯源', '垃圾袋', '保鲜膜', '批发市场', '万家达', '本地', '流通', '采购'],
    clueIds: ['T01', 'E03', 'E04'],
  },
  {
    id: 'news-6',
    title: '现场鞋印曝光：42码运动鞋，驾车特征明显',
    date: '2026-04-26',
    author: '记者 李华',
    source: '鹤城新闻网',
    category: 'investigation',
    content: [
      {
        id: 'n6-1',
        text: '本报记者 李华',
        type: 'text',
        markable: false,
      },
      {
        id: 'n6-2',
        text: '记者从专案组获悉，在抛尸现场提取到的关键物证——一枚运动鞋印，经技术分析已获得重要信息。',
        type: 'text',
        markable: false,
      },
      {
        id: 'n6-3',
        text: '据痕迹检验专家介绍，该鞋印为42码男士运动鞋，橡胶底纹。鞋印磨损特征明显：前掌内侧和脚跟外侧磨损严重，这种磨损模式高度符合常年驾车踩离合和刹车的习惯。',
        type: 'text',
        markable: true,
        clueId: 'E01',
      },
      {
        id: 'n6-4',
        text: '更为关键的是，鞋印纹线中检出微量泥沙和花粉残留。经初步分析，泥沙中含有本地特有的土壤成分，而花粉种类正在进一步鉴定中。',
        type: 'text',
        markable: true,
      },
      {
        id: 'n6-5',
        text: '刑事技术专家表示，花粉鉴定结果一旦出炉，将可能成为锁定凶手活动范围的关键证据。因为不同植物的花粉分布具有极强的地域性，可以精确到特定区域。',
        type: 'text',
        markable: false,
      },
      {
        id: 'n6-6',
        text: '此外，记者了解到，该鞋印所属运动鞋品牌和型号已初步确定，警方正在排查本地该品牌运动鞋的销售记录。',
        type: 'text',
        markable: false,
      },
    ],
    relatedArticles: ['news-3', 'news-5'],
    searchKeywords: ['鞋印', '脚印', '运动鞋', '42码', '驾车', '离合', '花粉', '磨损', '泥沙'],
    clueIds: ['E01'],
  },
  {
    id: 'news-7',
    title: '酒店监控披露：受害者失踪前与一名男性同行',
    date: '2026-04-28',
    author: '记者 张明',
    source: '鹤城新闻网',
    category: 'investigation',
    content: [
      {
        id: 'n7-1',
        text: '本报记者 张明',
        type: 'text',
        markable: false,
      },
      {
        id: 'n7-2',
        text: '专案组今日向媒体披露了城郊"如家快捷"酒店监控录像的部分分析结果。',
        type: 'text',
        markable: false,
      },
      {
        id: 'n7-3',
        text: '据视频侦查科介绍，通过对3名受害人失踪当天的监控录像逐帧分析，发现三名受害人在失踪前均与同一名男性在酒店出现。该男性三次出现的外貌特征和衣着风格高度一致。',
        type: 'text',
        markable: true,
        clueId: 'S01',
      },
      {
        id: 'n7-4',
        text: '监控录音还捕获到该男性的说话声音。经语音分析，该男性操本地口音，语调自然，非刻意模仿。警方判断，此人很可能为本地人或已在本地长期居住。',
        type: 'text',
        markable: true,
      },
      {
        id: 'n7-5',
        text: '警方同时公布了该男性的部分体貌特征：身高约178cm，体型中等偏瘦，全程佩戴黑色口罩，未暴露面部任何特征。该男性在酒店内与受害人互动自然，受害人未表现出警惕或抗拒。',
        type: 'text',
        markable: false,
      },
      {
        id: 'n7-6',
        text: '离开酒店时，该男性驾驶一辆深色SUV（疑似黑色或深灰色），停车位置选择在监控死角附近。监控仅拍到车尾画面，且车尾未见牌照。车辆行驶方向为向南，朝南郊方向驶离。',
        type: 'text',
        markable: false,
      },
      {
        id: 'n7-7',
        text: '警方呼吁，如有市民认识符合上述特征的人员，请及时与警方联系。',
        type: 'text',
        markable: false,
      },
    ],
    relatedArticles: ['news-1', 'news-8'],
    searchKeywords: ['酒店', '监控', '如家', '男性', '同行', '本地口音', '178cm', '黑色口罩', 'SUV', '深色', '车尾', '无牌照', '南郊'],
    clueIds: ['S01'],
  },
  {
    id: 'news-8',
    title: '专案组组长陈队：嫌疑人具有较强反侦察能力',
    date: '2026-04-30',
    author: '记者 王芳',
    source: '鹤城新闻网',
    category: 'investigation',
    content: [
      {
        id: 'n8-1',
        text: '本报记者 王芳',
        type: 'text',
        markable: false,
      },
      {
        id: 'n8-2',
        text: '在今日的专案组工作进展通报会上，专案组组长陈队接受了本报记者专访，就案件侦办中的难点进行了说明。',
        type: 'text',
        markable: false,
      },
      {
        id: 'n8-3',
        text: '陈队表示："经过对三处抛尸现场和酒店监控的反复分析，我们可以确定嫌疑人具有极强的反侦察能力。抛尸路线经过精心规划，刻意避开了沿途所有天网监控摄像头。嫌疑人对本地路网和监控分布极为了解。"',
        type: 'quote',
        markable: true,
        clueId: 'P01',
      },
      {
        id: 'n8-4',
        text: '陈队还透露，嫌疑人在酒店内全程佩戴口罩，未暴露面部特征；车辆停在监控死角，仅拍到无牌车尾；包裹物表面未留下指纹。这些行为都表明嫌疑人有预谋、有准备，反侦察训练有素。',
        type: 'text',
        markable: true,
        clueId: 'P01',
      },
      {
        id: 'n8-5',
        text: '在被问及案件侦办进度时，陈队表示："目前我们已经掌握了大量有价值的线索，正在逐一排查。我们相信，在广大市民的配合下，很快就能将嫌疑人绳之以法。"',
        type: 'text',
        markable: false,
      },
      {
        id: 'n8-6',
        text: '陈队最后强调，请市民不要恐慌，警方将全力保障市民安全。同时，也提醒广大女性市民，近期尽量避免单独前往偏僻地区。',
        type: 'text',
        markable: false,
      },
    ],
    relatedArticles: ['news-4', 'news-7'],
    searchKeywords: ['陈队', '专案组', '反侦察', '监控', '嫌疑人', '天网', '路网', '口罩', '指纹'],
    clueIds: ['P01'],
  },
];

export function getNewsArticleById(id: string): NewsArticle | undefined {
  return NEWS_ARTICLES.find((a) => a.id === id);
}