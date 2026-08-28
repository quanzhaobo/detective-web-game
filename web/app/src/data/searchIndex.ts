export interface SearchResultItem {
  title: string;
  url: string;
  snippet: string;
  site: 'forum' | 'news' | 'life';
  siteName: string;
}

// 搜索关键词到结果页面的映射表
export const SEARCH_INDEX: Record<string, SearchResultItem[]> = {
  // 通用案件搜索
  '失踪案': [
    { title: '市公安局关于近期女性失踪案的警情通报', url: '/news/article/news-1', snippet: '近日，我市连续发生多起女性失踪案件...三名失踪者均为外地来鹤城务工的年轻女性...', site: 'news', siteName: '鹤城新闻网' },
    { title: '【热议】环城高速又发现尸块了！第三个了！', url: '/forum/post/post-1', snippet: '今天早上上班路过环城高速南段，看到好几辆警车停在匝道口...听说是又发现尸块了！', site: 'forum', siteName: '清风推理论坛' },
    { title: '三个受害者的共同特征：都是外地来务工的年轻女性', url: '/forum/post/post-12', snippet: '整理了三个受害者的信息，发现了一些共同点：三人都是外地来鹤城务工的年轻女性...', site: 'forum', siteName: '清风推理论坛' },
  ],
  '碎尸案': [
    { title: '环城高速绿化带再现人体残块，警方封锁现场', url: '/news/article/news-2', snippet: '今日凌晨6时许，一名环卫工人在环城高速南段匝道绿化带内发现可疑包裹...', site: 'news', siteName: '鹤城新闻网' },
    { title: '【热议】环城高速又发现尸块了！第三个了！', url: '/forum/post/post-1', snippet: '前两次分别是3月15号和4月2号，这次是4月20号被发现的...尸块都是被黑色垃圾袋和保鲜膜包着的...', site: 'forum', siteName: '清风推理论坛' },
  ],
  '连环案': [
    { title: '专案组组长陈队：嫌疑人具有较强反侦察能力', url: '/news/article/news-8', snippet: '经过对三处抛尸现场和酒店监控的反复分析，我们可以确定嫌疑人具有极强的反侦察能力...', site: 'news', siteName: '鹤城新闻网' },
    { title: '关于凶手的作案周期，我发现一个规律……', url: '/forum/post/post-7', snippet: '作案周期完全固定为18天！第一起3月12日、第二起3月30日、第三起4月17日...', site: 'forum', siteName: '清风推理论坛' },
  ],

  // 酒店相关
  '如家酒店': [
    { title: '酒店监控披露：受害者失踪前与一名男性同行', url: '/news/article/news-7', snippet: '三名受害人在失踪前均与同一名男性在酒店出现...该男性全程佩戴黑色口罩...', site: 'news', siteName: '鹤城新闻网' },
    { title: '有没有人注意到如家酒店最近怪怪的？', url: '/forum/post/post-2', snippet: '最近这一个月酒店那边明显不对劲。大堂门口加了两个保安...好几拨警察进出...', site: 'forum', siteName: '清风推理论坛' },
    { title: '如家快捷酒店（城郊店）', url: '/life/place/place-hotel', snippet: '连锁经济型酒店，位于城郊结合部。监控覆盖：大堂、走廊、电梯、停车场全覆盖...', site: 'life', siteName: '鹤城生活通' },
  ],
  '城郊酒店': [
    { title: '酒店监控披露：受害者失踪前与一名男性同行', url: '/news/article/news-7', snippet: '据视频侦查科介绍，通过对3名受害人失踪当天的监控录像逐帧分析...', site: 'news', siteName: '鹤城新闻网' },
    { title: '有没有人注意到如家酒店最近怪怪的？', url: '/forum/post/post-2', snippet: '我八卦一下——听说那三个失踪的姑娘，失踪前都在这家酒店出现过？', site: 'forum', siteName: '清风推理论坛' },
  ],

  // 抛尸地点
  '环城高速': [
    { title: '环城高速绿化带再现人体残块，警方封锁现场', url: '/news/article/news-2', snippet: '三次抛尸均选择在高速公路匝道绿化带，远离主路，且周边均无监控覆盖...', site: 'news', siteName: '鹤城新闻网' },
    { title: '我跑高速二十年，那些匝道口的监控死角我最清楚', url: '/forum/post/post-5', snippet: '环城高速虽然号称"天网全覆盖"，但实际上有些匝道口是有监控盲区的...', site: 'forum', siteName: '清风推理论坛' },
  ],
  '抛尸': [
    { title: '环城高速绿化带再现人体残块，警方封锁现场', url: '/news/article/news-2', snippet: '尸块被包裹在黑色垃圾袋中，外层缠绕保鲜膜，与之前两起案件的手法完全一致...', site: 'news', siteName: '鹤城新闻网' },
    { title: '我跑高速二十年，那些匝道口的监控死角我最清楚', url: '/forum/post/post-5', snippet: '凶手选择这三个地点抛尸，绝对不是巧合。他对环城高速的监控分布非常了解...', site: 'forum', siteName: '清风推理论坛' },
  ],
  '匝道': [
    { title: '【目击】案发当晚我在高速匝道口看到一辆黑色SUV', url: '/forum/post/post-3', snippet: '4月17号晚上大概凌晨1点多，我从南段匝道口下来的时候，看到一辆深色SUV...', site: 'forum', siteName: '清风推理论坛' },
    { title: '我跑高速二十年，那些匝道口的监控死角我最清楚', url: '/forum/post/post-5', snippet: '这三个匝道有一个共同特点：主路有摄像头，但匝道口拐弯处往外延伸50米左右，有一段是拍不到的...', site: 'forum', siteName: '清风推理论坛' },
  ],

  // 法医相关
  '法医': [
    { title: '法医专家：三名受害者均死于机械性窒息', url: '/news/article/news-3', snippet: '三名死者均为机械性窒息死亡。颈部可见扼压痕迹...死后12小时内被分尸...', site: 'news', siteName: '鹤城新闻网' },
    { title: '【科普】从分尸手法能看出什么？', url: '/forum/post/post-9', snippet: '切口整齐说明凶手不是胡乱砍的...关节分离精准，需要对人体骨骼结构有一定了解...', site: 'forum', siteName: '清风推理论坛' },
  ],
  '尸检': [
    { title: '法医专家：三名受害者均死于机械性窒息', url: '/news/article/news-3', snippet: '林法医介绍，三名死者均为机械性窒息死亡...死后12小时内被分尸...', site: 'news', siteName: '鹤城新闻网' },
  ],
  '死因': [
    { title: '法医专家：三名受害者均死于机械性窒息', url: '/news/article/news-3', snippet: '三名死者均为机械性窒息死亡。颈部可见扼压痕迹，舌骨大角骨折...', site: 'news', siteName: '鹤城新闻网' },
  ],
  '窒息': [
    { title: '法医专家：三名受害者均死于机械性窒息', url: '/news/article/news-3', snippet: '三名死者均为机械性窒息死亡。三人死因一致，手法相同，可以确定系同一人所为...', site: 'news', siteName: '鹤城新闻网' },
  ],

  // 鞋印相关
  '鞋印': [
    { title: '现场鞋印曝光：42码运动鞋，驾车特征明显', url: '/news/article/news-6', snippet: '该鞋印为42码男士运动鞋...磨损特征高度符合常年驾车踩离合和刹车的习惯...', site: 'news', siteName: '鹤城新闻网' },
  ],
  '脚印': [
    { title: '现场鞋印曝光：42码运动鞋，驾车特征明显', url: '/news/article/news-6', snippet: '鞋印纹线中检出微量泥沙和花粉残留...花粉鉴定结果一旦出炉，将可能成为锁定凶手活动范围的关键证据...', site: 'news', siteName: '鹤城新闻网' },
  ],

  // 口罩相关
  '口罩': [
    { title: '口罩品牌确认了！是XX牌的薄荷味口罩', url: '/forum/post/post-11', snippet: '这个口罩不是那种临时买来用的，它是正常在售的长期产品...很多人长期买这个牌子...', site: 'forum', siteName: '清风推理论坛' },
    { title: '有人在城郊如家酒店见过这个男的没？', url: '/forum/post/post-4', snippet: '全程戴着黑色口罩，从来没摘过...正常人谁会进了酒店还一直戴口罩不摘？', site: 'forum', siteName: '清风推理论坛' },
  ],
  '薄荷味': [
    { title: '口罩品牌确认了！是XX牌的薄荷味口罩', url: '/forum/post/post-11', snippet: '市面上有薄荷味的口罩品牌不多...最火的是"清呼吸"这个牌子...', site: 'forum', siteName: '清风推理论坛' },
  ],

  // 车辆相关
  'SUV': [
    { title: '【目击】案发当晚我在高速匝道口看到一辆黑色SUV', url: '/forum/post/post-3', snippet: '深色SUV从匝道口旁边的小路窜出来，开得特别快...车尾好像没挂牌照...', site: 'forum', siteName: '清风推理论坛' },
    { title: '酒店监控披露：受害者失踪前与一名男性同行', url: '/news/article/news-7', snippet: '离开时驾驶一辆深色SUV...监控仅拍到车尾画面，且车尾未见牌照...', site: 'news', siteName: '鹤城新闻网' },
  ],
  '黑色车': [
    { title: '【目击】案发当晚我在高速匝道口看到一辆黑色SUV', url: '/forum/post/post-3', snippet: '深色SUV，应该是黑色或者深灰色...车尾确实没看到牌照...', site: 'forum', siteName: '清风推理论坛' },
  ],

  // 花粉/植物
  '花粉': [
    { title: '破案了！花粉是关键线索！', url: '/forum/post/post-6', snippet: '如果是山茶花的花粉，那事情就非常有趣了...鹤城市范围内，山茶花只有南郊那个种植园有规模化种植...', site: 'forum', siteName: '清风推理论坛' },
    { title: '现场鞋印曝光：42码运动鞋，驾车特征明显', url: '/news/article/news-6', snippet: '鞋印纹线中检出微量泥沙和花粉残留...花粉鉴定结果一旦出炉...', site: 'news', siteName: '鹤城新闻网' },
  ],
  '山茶': [
    { title: '破案了！花粉是关键线索！', url: '/forum/post/post-6', snippet: '山茶花只有南郊那个山茶种植园有规模化种植...凶手鞋底携带山茶花粉...', site: 'forum', siteName: '清风推理论坛' },
    { title: '南郊山茶种植园', url: '/life/place/place-plantation', snippet: '本地区唯一的山茶花规模化种植地，占地约200亩。靠近环城高速南段...', site: 'life', siteName: '鹤城生活通' },
  ],
  '种植园': [
    { title: '南郊山茶种植园', url: '/life/place/place-plantation', snippet: '本地区唯一的山茶花规模化种植地，占地约200亩。从业人数约30人...', site: 'life', siteName: '鹤城生活通' },
    { title: '破案了！花粉是关键线索！', url: '/forum/post/post-6', snippet: '南郊种植园靠近环城高速南段，距离那个抛尸点才2公里左右...', site: 'forum', siteName: '清风推理论坛' },
  ],

  // 包裹物
  '垃圾袋': [
    { title: '物证溯源有突破：包裹材料为本地市场流通品', url: '/news/article/news-5', snippet: '黑色加厚垃圾袋和透明保鲜膜均为无品牌通用型产品...在本市城南万家达批发市场多家商户均有销售...', site: 'news', siteName: '鹤城新闻网' },
    { title: '批发市场卖的那种黑色垃圾袋，家家户户都能买到', url: '/forum/post/post-8', snippet: '那个黑色加厚垃圾袋，60cm×80cm规格的，我们家就有卖...一个月能卖出去几百卷...', site: 'forum', siteName: '清风推理论坛' },
  ],
  '保鲜膜': [
    { title: '物证溯源有突破：包裹材料为本地市场流通品', url: '/news/article/news-5', snippet: '黑色加厚垃圾袋和透明保鲜膜均为无品牌通用型产品...', site: 'news', siteName: '鹤城新闻网' },
  ],

  // 批发市场
  '批发市场': [
    { title: '万家达批发市场', url: '/life/place/place-market', snippet: '城南大型综合批发市场，涵盖日用百货、食品、家居用品等品类...', site: 'life', siteName: '鹤城生活通' },
    { title: '批发市场卖的那种黑色垃圾袋，家家户户都能买到', url: '/forum/post/post-8', snippet: '万家达在城南，离南郊新区不远。来我们这进货的很多都是南郊那边的小商户...', site: 'forum', siteName: '清风推理论坛' },
  ],

  // 嫌疑人搜索
  '张运来': [
    { title: '张运来 - 人物资料', url: '/life/profile/profile-a', snippet: '南郊山茶种植园货车司机，38岁，本地人，驾驶轻型货车，惯用左手...', site: 'life', siteName: '鹤城生活通' },
    { title: '南郊山茶种植园', url: '/life/place/place-plantation', snippet: '本地区唯一的山茶花规模化种植地，张运来在此担任货运司机...', site: 'life', siteName: '鹤城生活通' },
  ],
  '李文彬': [
    { title: '李文彬 - 人物资料', url: '/life/profile/profile-b', snippet: '城南社区卫生服务站全科医生，34岁，湖南籍入赘本地，驾驶黑色SUV，惯用右手...', site: 'life', siteName: '鹤城生活通' },
    { title: '城南社区卫生服务站', url: '/life/place/place-clinic', snippet: '社区基层医疗机构，李文彬在此担任全科医生...', site: 'life', siteName: '鹤城生活通' },
  ],
  '李医生': [
    { title: '李文彬 - 人物资料', url: '/life/profile/profile-b', snippet: '城南社区卫生服务站全科医生，34岁，湖南籍入赘本地...', site: 'life', siteName: '鹤城生活通' },
  ],
  '赵刚': [
    { title: '赵刚 - 人物资料', url: '/life/profile/profile-c', snippet: '城北农贸市场屠宰工，42岁，本地人，惯用左手，无车...', site: 'life', siteName: '鹤城生活通' },
    { title: '城北农贸市场', url: '/life/place/place-market2', snippet: '城北最大的农贸市场，赵刚在此从事猪肉屠宰和销售工作...', site: 'life', siteName: '鹤城生活通' },
  ],
  '赵屠夫': [
    { title: '赵刚 - 人物资料', url: '/life/profile/profile-c', snippet: '城北农贸市场屠宰工，42岁...在市场杀猪二十多年，刀工精湛...', site: 'life', siteName: '鹤城生活通' },
  ],
  '周明': [
    { title: '周明 - 人物资料', url: '/life/profile/profile-d', snippet: '城东汽车修理厂技师，29岁，广东籍暂住本地，惯用右手...', site: 'life', siteName: '鹤城生活通' },
    { title: '城东汽车修理厂', url: '/life/place/place-garage', snippet: '综合汽车维修厂，周明在此担任技师，擅长发动机和底盘维修...', site: 'life', siteName: '鹤城生活通' },
  ],

  // 机构/地点
  '卫生服务站': [
    { title: '城南社区卫生服务站', url: '/life/place/place-clinic', snippet: '社区基层医疗机构，为周边居民提供全科诊疗服务。备有75%医用酒精...', site: 'life', siteName: '鹤城生活通' },
  ],
  '社区医院': [
    { title: '城南社区卫生服务站', url: '/life/place/place-clinic', snippet: '社区基层医疗机构，位于南郊新区。服务范围：全科诊疗、清创缝合、基础外科...', site: 'life', siteName: '鹤城生活通' },
  ],
  '农贸市场': [
    { title: '城北农贸市场', url: '/life/place/place-market2', snippet: '城北最大的农贸市场，设有鲜肉区、蔬菜区、水产区等...', site: 'life', siteName: '鹤城生活通' },
  ],
  '汽修厂': [
    { title: '城东汽车修理厂', url: '/life/place/place-garage', snippet: '综合汽车维修厂，提供发动机、底盘、钣金喷漆等服务...', site: 'life', siteName: '鹤城生活通' },
  ],
  '南郊': [
    { title: '南郊山茶种植园', url: '/life/place/place-plantation', snippet: '鹤城市城南新区以南8公里，靠近环城高速南段...', site: 'life', siteName: '鹤城生活通' },
    { title: '破案了！花粉是关键线索！', url: '/forum/post/post-6', snippet: '南郊确实就那一个种植园...是本地区唯一的山茶花规模化种植地...', site: 'forum', siteName: '清风推理论坛' },
  ],

  // 心理/周期
  '作案周期': [
    { title: '关于凶手的作案周期，我发现一个规律……', url: '/forum/post/post-7', snippet: '作案周期完全固定为18天！从第一起作案到第二起：间隔18天，从第二起到第三起：间隔18天...', site: 'forum', siteName: '清风推理论坛' },
  ],
  '周期': [
    { title: '关于凶手的作案周期，我发现一个规律……', url: '/forum/post/post-7', snippet: '每18天是一个周期，他可能在这个周期内完成某种"仪式"...', site: 'forum', siteName: '清风推理论坛' },
  ],
  '心理侧写': [
    { title: '三个受害者的共同特征：都是外地来务工的年轻女性', url: '/forum/post/post-12', snippet: '无性侵但有周期...在犯罪心理学上更符合偏执型人格障碍的特征...', site: 'forum', siteName: '清风推理论坛' },
  ],
  '人格障碍': [
    { title: '关于凶手的作案周期，我发现一个规律……', url: '/forum/post/post-7', snippet: '固定周期作案是典型的仪式化行为，常见于偏执型人格障碍...', site: 'forum', siteName: '清风推理论坛' },
  ],

  // 陈队/专案组
  '陈队': [
    { title: '专案组组长陈队：嫌疑人具有较强反侦察能力', url: '/news/article/news-8', snippet: '陈队表示：经过对三处抛尸现场和酒店监控的反复分析，我们可以确定嫌疑人具有极强的反侦察能力...', site: 'news', siteName: '鹤城新闻网' },
    { title: '警方呼吁市民提供线索，设立举报热线', url: '/news/article/news-4', snippet: '专案组组长陈队就近期连环女性失踪案向社会公开征集线索...', site: 'news', siteName: '鹤城新闻网' },
  ],
  '专案组': [
    { title: '专案组组长陈队：嫌疑人具有较强反侦察能力', url: '/news/article/news-8', snippet: '在今日的专案组工作进展通报会上，专案组组长陈队接受了本报记者专访...', site: 'news', siteName: '鹤城新闻网' },
    { title: '市公安局关于近期女性失踪案的警情通报', url: '/news/article/news-1', snippet: '市公安局已成立专案组，由刑侦支队陈队担任组长...', site: 'news', siteName: '鹤城新闻网' },
  ],

  // 分尸手法
  '分尸': [
    { title: '【科普】从分尸手法能看出什么？', url: '/forum/post/post-9', snippet: '切口整齐说明凶手不是胡乱砍的...关节分离精准，需要对人体骨骼结构有一定了解...', site: 'forum', siteName: '清风推理论坛' },
  ],
  '解剖': [
    { title: '【科普】从分尸手法能看出什么？', url: '/forum/post/post-9', snippet: '关节分离精准需要了解韧带附着点和关节囊结构，这确实是解剖学的基础知识...', site: 'forum', siteName: '清风推理论坛' },
  ],

  // 补充同义词
  '规律': [
    { title: '关于凶手的作案周期，我发现一个规律……', url: '/forum/post/post-7', snippet: '作案周期完全固定为18天！从第一起作案到第二起：间隔18天...', site: 'forum', siteName: '清风推理论坛' },
  ],
  '时间线': [
    { title: '关于凶手的作案周期，我发现一个规律……', url: '/forum/post/post-7', snippet: '第一起3月12日、第二起3月30日、第三起4月17日...时间线惊人一致...', site: 'forum', siteName: '清风推理论坛' },
  ],
  '杀人案': [
    { title: '市公安局关于近期女性失踪案的警情通报', url: '/news/article/news-1', snippet: '近日，我市连续发生多起女性失踪案件...三名失踪者均为外地来鹤城务工的年轻女性...', site: 'news', siteName: '鹤城新闻网' },
    { title: '【热议】环城高速又发现尸块了！第三个了！', url: '/forum/post/post-1', snippet: '今天早上上班路过环城高速南段，看到好几辆警车停在匝道口...听说是又发现尸块了！', site: 'forum', siteName: '清风推理论坛' },
  ],
};

// 搜索建议（根据已访问内容推荐）
export function getSearchSuggestions(keyword: string, visitedPages: string[]): string[] {
  const suggestions: string[] = [];

  // 根据输入前缀匹配
  const allKeywords = Object.keys(SEARCH_INDEX);
  const matched = allKeywords.filter((k) => k.includes(keyword) && k !== keyword);
  suggestions.push(...matched.slice(0, 5));

  // 根据已访问页面推荐相关搜索
  const hasVisitedForum = visitedPages.some((p) => p.includes('/forum/'));
  const hasVisitedNews = visitedPages.some((p) => p.includes('/news/'));
  const hasVisitedLife = visitedPages.some((p) => p.includes('/life/'));

  if (hasVisitedForum && !hasVisitedNews) {
    suggestions.push('环城高速', '法医', '鞋印');
  }

  if (hasVisitedNews && !hasVisitedForum) {
    suggestions.push('如家酒店', 'SUV', '口罩');
  }

  if (hasVisitedForum && hasVisitedNews && !hasVisitedLife) {
    suggestions.push('张运来', '李文彬', '赵刚', '周明');
  }

  return [...new Set(suggestions)];
}

export function searchAll(keyword: string): SearchResultItem[] {
  const lowerKeyword = keyword.toLowerCase().trim();

  // 精确匹配
  if (SEARCH_INDEX[lowerKeyword]) {
    return SEARCH_INDEX[lowerKeyword];
  }

  // 模糊匹配
  const results: SearchResultItem[] = [];
  const seen = new Set<string>();

  for (const [key, items] of Object.entries(SEARCH_INDEX)) {
    if (key.includes(lowerKeyword) || lowerKeyword.includes(key)) {
      for (const item of items) {
        if (!seen.has(item.url)) {
          seen.add(item.url);
          results.push(item);
        }
      }
    }
  }

  return results;
}