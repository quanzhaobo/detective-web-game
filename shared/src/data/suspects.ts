export interface Suspect {
  id: string;
  name: string;
  age: number;
  occupation: string;
  origin: string;
  residence: string;
  height: string;
  handedness: string;
  vehicle: string;
  profile: string;
  interrogation: DialogueLine[];
  contradictions: string[];
}

export interface DialogueLine {
  speaker: 'player' | 'suspect' | 'narrator';
  text: string;
}

export const SUSPECTS: Suspect[] = [
  {
    id: 'A',
    name: '张运来',
    age: 38,
    occupation: '南郊山茶种植园货车司机',
    origin: '本地人',
    residence: '本市城北',
    height: '176cm',
    handedness: '左手',
    vehicle: '本地牌照轻型货车',
    profile: '本地户籍，在南郊山茶种植园担任货运司机已有8年。每日驾车往返种植园与市区批发市场运输山茶花及相关产品。熟悉环城高速路况。离异，独居。性格内向，邻居反映其平时少与人来往。',
    interrogation: [
      { speaker: 'narrator', text: '审讯室内，张运来坐在铁椅上，双手放在桌面，表情平静。' },
      { speaker: 'player', text: '张运来，你每天开车经过环城高速，对那几条匝道的路况熟悉吗？' },
      { speaker: 'suspect', text: '当然熟，天天跑那条条路。不过我都是白天跑的，晚上基本不出门。' },
      { speaker: 'player', text: '3月12日、3月30日、4月17日这三天晚上，你在哪里？' },
      { speaker: 'suspect', text: '在家啊，我晚上一般不出门。你们可以去查我小区的门禁记录。' },
      { speaker: 'player', text: '你认识这三名女性吗？（展示受害人照片）' },
      { speaker: 'suspect', text: '不认识。我在种植园开车，平时接触的都是花农和批发商。' },
      { speaker: 'narrator', text: '【系统提示】门禁记录核实：3月12日和4月17日晚张运来确有进出小区记录。3月30日记录缺失。' },
    ],
    contradictions: [
      '身高176cm，与监控中178cm有偏差',
      '惯用左手，与法医刀痕分析（惯用右手）矛盾',
      '驾驶本地牌照轻型货车，非深色SUV',
      '声称性侵未遂——但尸检明确无性侵痕迹',
    ],
  },
  {
    id: 'B',
    name: '李文彬',
    age: 34,
    occupation: '城南社区卫生服务站医生',
    origin: '南方籍（湖南），入赘本地',
    residence: '本市南郊新区',
    height: '178cm',
    handedness: '右手',
    vehicle: '深色SUV（外地牌照）',
    profile: '湖南籍，医科大学毕业后入赘本地妻子家庭，定居南郊新区。在城南社区卫生服务站担任全科医生已有6年。日常佩戴口罩（职业习惯）。邻居评价：为人温和，但妻子反映其性格偏执、控制欲强。拥有一辆深色SUV，挂妻子老家的外地牌照。',
    interrogation: [
      { speaker: 'narrator', text: '审讯室内，李文彬坐姿端正，双手交叉放在胸前，眼神平静但有一丝警惕。' },
      { speaker: 'player', text: '李医生，你在卫生服务站工作几年了？平时工作中会用到医用酒精和手术器械吗？' },
      { speaker: 'suspect', text: '六年了。医用酒精、手术器械这些都是日常用品，每天都在用。' },
      { speaker: 'player', text: '你的车是什么型号？平时开得多吗？' },
      { speaker: 'suspect', text: '一辆黑色丰田RAV4，我太太老家那边的牌照。平时上下班开，偶尔周末去南郊那边转转。' },
      { speaker: 'player', text: '3月12日、3月30日、4月17日这三天你在做什么？' },
      { speaker: 'suspect', text: '正常上班下班。下班后在家陪太太。你可以问我太太。' },
      { speaker: 'player', text: '你认识这三名女性吗？（展示受害人照片）' },
      { speaker: 'suspect', text: '……没见过。她们看起来不像是我服务站的病人。' },
      { speaker: 'narrator', text: '【系统提示】李文彬在回答最后一个问题时，手指不自觉地收紧了。其妻子证实了部分不在场证明，但无法覆盖深夜时段。' },
    ],
    contradictions: [
      '【无明显矛盾——各项特征与犯罪画像高度吻合】',
    ],
  },
  {
    id: 'C',
    name: '赵刚',
    age: 42,
    occupation: '城北农贸市场屠宰工',
    origin: '本地人',
    residence: '本市城北老城区',
    height: '180cm',
    handedness: '左手',
    vehicle: '无车',
    profile: '本地户籍，在城北农贸市场从事猪肉屠宰工作超过20年。刀工精湛，对骨骼关节结构非常熟悉。身高体壮，性格暴躁，曾因打架被治安拘留两次。离异，无固定伴侣。无车，日常骑电动车出行。',
    interrogation: [
      { speaker: 'narrator', text: '审讯室内，赵刚显得不耐烦，不停地抖腿。' },
      { speaker: 'player', text: '赵刚，你的刀工很好，对骨骼关节的结构应该很了解吧？' },
      { speaker: 'suspect', text: '那是，杀了二十年的猪，什么骨头没见过。不过我可只杀猪。' },
      { speaker: 'player', text: '这三个月里，你有没有在深夜出过远门？比如去环城高速附近？' },
      { speaker: 'suspect', text: '我骑电动车，去那么远干嘛？我晚上一般就在市场附近的棋牌室打牌，或者在家喝酒。' },
      { speaker: 'player', text: '你认识这三名女性吗？（展示受害人照片）' },
      { speaker: 'suspect', text: '不认识。我平时就在市场里，接触的都是买菜的大妈。' },
      { speaker: 'narrator', text: '【系统提示】棋牌室老板证实赵刚在3月12日和4月17日晚确实在打牌。3月30日晚未出现。赵刚无车，无驾照。' },
    ],
    contradictions: [
      '身高180cm，与监控178cm有偏差',
      '惯用左手，与法医刀痕分析矛盾',
      '无车无驾照——无法解释深色SUV和驾车抛尸',
      '声称情杀报复社会——但3名受害者互不相识',
      '酒精残留解释为"清理现场意外沾染"——但酒精残留呈现系统性均匀分布，非意外沾染特征',
    ],
  },
  {
    id: 'D',
    name: '周明',
    age: 29,
    occupation: '城东汽车修理厂技师',
    origin: '南方籍（广东），暂住本地',
    residence: '城东出租屋',
    height: '175cm',
    handedness: '右手',
    vehicle: '无固定车辆，偶尔借用厂里客户车',
    profile: '广东籍，来本市务工两年。在城东一家汽车修理厂担任技师，擅长发动机和底盘维修。暂住在修理厂附近的出租屋。性格孤僻，同事反映其很少说话。无固定车辆，偶尔借用客户车辆外出。',
    interrogation: [
      { speaker: 'narrator', text: '审讯室内，周明低着头，手指不停地敲击桌面。' },
      { speaker: 'player', text: '周明，你在修理厂工作多久了？对汽车结构应该很了解。' },
      { speaker: 'suspect', text: '两年了。修车是我的专业，发动机、底盘我都能搞。' },
      { speaker: 'player', text: '你对人体解剖有了解吗？比如关节结构之类的。' },
      { speaker: 'suspect', text: '……不了解。我只是修车的，又不是医生。' },
      { speaker: 'player', text: '3月12日、3月30日、4月17日这三天晚上你在哪里？' },
      { speaker: 'suspect', text: '在出租屋。我一个人住，没人能证明。' },
      { speaker: 'player', text: '你认识这三名女性吗？（展示受害人照片）' },
      { speaker: 'suspect', text: '不认识。我不怎么社交。' },
      { speaker: 'narrator', text: '【系统提示】修理厂同事反映周明确实很少社交，但偶尔深夜外出，去向不明。周明的出租屋内未发现异常物品。' },
    ],
    contradictions: [
      '身高175cm，与监控178cm有明显偏差',
      '汽修技师——无法解释解剖常识和医用酒精使用习惯',
      '声称熔喷布纤维是受害人自身携带——与法医报告中纤维附着在尸块表面的特征矛盾',
      '无固定车辆——与深色SUV的监控记录不符',
      '作案动机归为反社会人格——但18天固定周期更符合偏执型人格障碍特征',
    ],
  },
];
