/**
 * 人物资料：嫌疑人全量信息。
 *
 * 关于 clueIds：可标记内容块承载哪些有效线索，**由数据层显式声明**。
 * 早期实现是页面侧按关键词猜（`blockText.includes('酒精')`），一旦某段落
 * 同时命中两个关键词，靠后的线索就会被永久遮蔽（P02 曾因此不可达）。
 * 现在改为一处声明、支持一段多线索，页面只负责渲染。
 */

export interface ReviewEntry {
  text: string;
  /** 该条目承载的有效线索 ID，可多选 */
  clueIds?: string[];
}

export interface TimelineEntry {
  date: string;
  event: string;
  verifiable: boolean;
}

export interface CharacterProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  origin: string;
  occupation: string;
  workplace: string;
  residence: string;
  height: string;
  handedness: string;
  vehicle: string;
  familyStatus: string;
  personality: string;
  /** 【职业信息】区块（职业 · 单位 · 性格）承载的线索 */
  occupationClueIds?: string[];
  neighborReviews: ReviewEntry[];
  colleagueReviews: ReviewEntry[];
  spouseReview: ReviewEntry | null;
  timeline: TimelineEntry[];
  suspectId: 'A' | 'B' | 'C' | 'D' | null;
}

export const PROFILES: CharacterProfile[] = [
  {
    id: 'profile-a',
    name: '张运来',
    age: 38,
    gender: '男',
    origin: '鹤城本地',
    occupation: '货车司机',
    workplace: '南郊山茶种植园',
    residence: '鹤城市城北老城区',
    height: '176cm',
    handedness: '左手',
    vehicle: '轻型货车（本地牌照）',
    familyStatus: '离异，独居',
    personality: '性格内向，少与人来往',
    // 工作单位在南郊山茶种植园 —— 花粉溯源会把活动区域指向这里
    occupationClueIds: ['E05'],
    neighborReviews: [
      {
        text: '老张平时不怎么说话，见面最多点个头。他一个人住，晚上基本不出门，客厅灯10点就灭了。',
      },
      {
        text: '他干货运的，经常早出晚归，但总的来说是个老实人。',
      },
    ],
    colleagueReviews: [
      {
        text: '张师傅在种植园开了8年车了，技术没得说。他对环城高速的路况非常熟悉，哪个匝道口有摄像头、哪个没有，他都一清二楚。',
      },
      {
        text: '他平时就是开车送货，接触的都是花农和批发商。性格比较闷，不太爱跟人打交道。',
      },
    ],
    spouseReview: null,
    timeline: [
      {
        date: '3月12日晚',
        event: '小区门禁记录显示当晚20:15有进出记录。声称在家看电视。',
        verifiable: true,
      },
      {
        date: '3月30日晚',
        event: '小区门禁记录缺失。声称在家，但无人能证实。',
        verifiable: false,
      },
      {
        date: '4月17日晚',
        event: '小区门禁记录显示当晚21:30有进出记录。声称在家。',
        verifiable: true,
      },
    ],
    suspectId: 'A',
  },
  {
    id: 'profile-b',
    name: '李文彬',
    age: 34,
    gender: '男',
    origin: '湖南籍，入赘本地',
    occupation: '全科医生',
    workplace: '城南社区卫生服务站',
    residence: '南郊新区XX小区',
    height: '178cm',
    handedness: '右手',
    vehicle: '黑色丰田RAV4（湖南牌照，妻子老家注册）',
    familyStatus: '已婚（入赘），妻子为本地人',
    personality: '为人温和，但性格偏执、较真，控制欲强',
    neighborReviews: [
      {
        text: '李医生人挺温和的，见面都会打招呼。就是有时候感觉他特别固执，跟他聊天的时候会发现他认准的事情很难改变。',
      },
      {
        // 深色 SUV + 178cm，对应监控中的同行男性外貌特征
        text: '他开一辆黑色SUV，有时候晚上会开车出去。问他去哪里，他说是散步。',
        clueIds: ['S03'],
      },
    ],
    colleagueReviews: [
      {
        // 同一段同时印证两件事：医用酒精渠道（F04）与解剖/医学职业背景（P02）。
        // 旧实现只返回第一个命中的关键词，P02 因此永远拿不到 —— 这正是本次修复的点。
        text: '李医生业务能力不错，全科诊疗、清创缝合都做得很好。平时诊室里总是备着75%医用酒精，说是对器械消毒要求高。就是性格有点偏执，做事特别较真，有强迫症似的。什么东西都要放在固定的位置，不按他的规矩来他就会不高兴。',
        clueIds: ['F04', 'P02'],
      },
      {
        // 薄荷味口罩 + 长期佩戴的职业习惯
        text: '他平时上班都戴口罩，说是职业习惯。用的口罩好像是薄荷味的，闻着挺舒服。',
        clueIds: ['F05'],
      },
    ],
    spouseReview: {
      text: '他控制欲比较强，有时候会突然变得很冷淡。深夜有时会独自外出，说是散步。我问他去哪，他也不说具体。',
    },
    timeline: [
      {
        date: '3月12日晚',
        event: '妻子称其在家。但妻子22点后已入睡，无法确认深夜行踪。',
        verifiable: false,
      },
      {
        date: '3月30日晚',
        event: '妻子称加班晚归。但服务站当天无加班记录。',
        verifiable: false,
      },
      {
        date: '4月17日晚',
        event: '妻子称在家看电视。邻居当晚未听到李家电视声。',
        verifiable: false,
      },
    ],
    suspectId: 'B',
  },
  {
    id: 'profile-c',
    name: '赵刚',
    age: 42,
    gender: '男',
    origin: '鹤城本地',
    occupation: '屠宰工',
    workplace: '城北农贸市场',
    residence: '鹤城城北老城区',
    height: '180cm',
    handedness: '左手',
    vehicle: '无车，日常骑电动车',
    familyStatus: '离异，无固定伴侣',
    personality: '性格暴躁，曾因打架被治安拘留两次',
    neighborReviews: [
      {
        text: '赵刚这个人脾气不好，喝多了酒就爱闹事。之前还跟人打过架，被拘留过。',
      },
      {
        text: '他在市场杀猪二十多年了，刀工确实好，但人缘不太好。',
      },
    ],
    colleagueReviews: [
      {
        text: '赵师傅刀工在市场上是数一数二的，杀猪分肉干净利索。他对猪的骨骼关节结构太熟悉了，闭着眼睛都能分开。',
      },
      {
        text: '他脾气不太好，有时候客人挑剔几句他就发火。不过干活确实认真。',
      },
    ],
    spouseReview: null,
    timeline: [
      {
        date: '3月12日晚',
        event: '棋牌室老板证实当晚在打牌。',
        verifiable: true,
      },
      {
        date: '3月30日晚',
        event: '声称在棋牌室打牌，但当晚未出现。无人能证实。',
        verifiable: false,
      },
      {
        date: '4月17日晚',
        event: '棋牌室老板证实当晚在打牌。',
        verifiable: true,
      },
    ],
    suspectId: 'C',
  },
  {
    id: 'profile-d',
    name: '周明',
    age: 29,
    gender: '男',
    origin: '广东籍，暂住本地',
    occupation: '汽修技师',
    workplace: '城东汽车修理厂',
    residence: '城东出租屋',
    height: '175cm',
    handedness: '右手',
    vehicle: '无固定车辆，偶尔借用厂里客户车',
    familyStatus: '未婚，独自租住',
    personality: '性格孤僻，很少说话',
    neighborReviews: [
      {
        text: '那个小伙子平时不怎么出门，也不太跟人说话。我有时候在楼道碰见他，他头都不抬。',
      },
      {
        text: '他晚上有时候会出去，很晚才回来。不知道去干什么。',
      },
    ],
    colleagueReviews: [
      {
        text: '周明技术不错，发动机和底盘维修都很擅长。就是对人不热情，下班就走了，从来不跟我们一起去吃饭。',
      },
      {
        text: '他有时候会借用厂里客户的车出去，说是试车。我们也没多想。',
      },
    ],
    spouseReview: null,
    timeline: [
      {
        date: '3月12日晚',
        event: '声称在出租屋，无人能证实。',
        verifiable: false,
      },
      {
        date: '3月30日晚',
        event: '声称在出租屋，无人能证实。',
        verifiable: false,
      },
      {
        date: '4月17日晚',
        event: '声称在出租屋，无人能证实。',
        verifiable: false,
      },
    ],
    suspectId: 'D',
  },
];

export function getProfileById(id: string): CharacterProfile | undefined {
  return PROFILES.find((p) => p.id === id);
}
