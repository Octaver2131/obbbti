import { PersonalityResult } from '../types';

const personalityDescriptions: Record<string, { name: string; description: string }> = {
  "INTJ-A": {
    name: "凯文·卡斯兰娜",
    description: "以千年执念铸就冰冷计划，舍弃一切情感与温柔，唯独将余生的执念与救赎，全部寄予唯一的信念。",
  },
  "INTJ-T": {
    name: "奥托·阿波卡利斯",
    description: "穷尽五百年权谋与罪孽，看透世间法则与生死，步步皆是算计，唯独放不下心底那份跨越轮回的遗憾与悔恨。",
  },
  "INTP-A": {
    name: "梅比乌斯",
    description: "沉迷生命与禁忌的终极研究，漠视世俗伦理与生死离别，在无尽实验中追寻真理，早已与自身的疯狂坦然共生。",
  },
  "INTP-T": {
    name: "维尔薇",
    description: "人格分裂背负多重自我，擅长创造与解构一切，在艺术与逻辑之间反复内耗，永远纠结于完美与自我的矛盾夹缝。",
  },
  "ENTJ-A": {
    name: "幽兰黛尔",
    description: "生来背负圣芙蕾雅与沙尼亚特的使命，以绝对的实力与领导力统领战场，纵使前路艰险，也会坚定守护身后的一切。",
  },
  "ENTJ-T": {
    name: "塞西莉亚·沙尼亚特",
    description: "身为沙尼亚特一族的纯白圣女，被宿命与枷锁层层束缚，温柔的外表下，藏着常年隐忍的无奈与身不由己的挣扎。",
  },
  "ENTP-A": {
    name: "千劫",
    description: "挣脱一切规则与束缚，以冲突与自由为生，性情骜不羁，看透虚伪的世道，只为随心所欲活好自己的人生。",
  },
  "ENTP-T": {
    name: "苏",
    description: "拥有看透宿命的双眼，温柔悲悯看透所有悲剧结局，无力改写苍生命运，只能独自背负众生的苦难默默内耗。",
  },
  "INFJ-A": {
    name: "爱莉希雅",
    description: "自始源诞生的粉色妖精，背负逐火之蛾的宿命，看透世界终焉，依旧以温柔拥抱众生，用明媚掩盖文明落幕的悲伤。",
  },
  "INFJ-T": {
    name: "符华",
    description: "沉睡苏醒跨越万年神州，背负背叛、罪孽与无尽离别，以孤独为常态，习惯独自承受所有伤痛，在岁月里不断自我否定。",
  },
  "INFP-A": {
    name: "格蕾修",
    description: "生于乐土的纯粹画师，以画笔描摹世间温柔，内心干净纯粹不受黑暗侵染，在破碎的世界里坚守独属于自己的理想与美好。",
  },
  "INFP-T": {
    name: "希儿·芙乐艾",
    description: "从小活在恐惧与分裂之中，双生人格互相拉扯，极度渴求陪伴与安稳，过往的创伤深埋心底，时刻深陷不安与自卑。",
  },
  "ENFJ-A": {
    name: "伊甸",
    description: "旧文明最后的优雅歌者，见证同伴落幕与时代消亡，收敛所有悲伤，以包容与温柔治愈众人，做所有人坚实的精神依靠。",
  },
  "ENFJ-T": {
    name: "雷电芽衣",
    description: "背负家族覆灭与律者宿命，常年压抑自我欲望，习惯性牺牲与迁就，将痛苦独自消化，温柔外壳下藏满疲惫与委屈。",
  },
  "ENFP-A": {
    name: "帕朵菲莉丝",
    description: "身处乐土的混乱乱世，看透生存的艰难与残酷，选择以乐观洒脱直面苦难，随性自在，在绝境中也能寻得细碎的快乐。",
  },
  "ENFP-T": {
    name: "罗莎莉亚·阿琳",
    description: "依赖妹妹相依为命，外表活泼冲动爱逞强，内心极度畏惧孤独与分离，敏感脆弱，一举一动都藏着不安与牵挂。",
  },
  "ISTJ-A": {
    name: "布洛妮娅",
    description: "历经孤儿院的苦难与战场的磨砺，理智克制恪守规则，以冷静的思维扛起责任，用理性构筑壁垒，守护身边的每一位同伴。",
  },
  "ISTJ-T": {
    name: "莉莉娅·阿琳",
    description: "身负绝症与实验的枷锁，性格内敛谨慎，时刻顾虑他人感受，行事小心翼翼，常年在宿命的压力下焦虑度日。",
  },
  "ISFJ-A": {
    name: "德丽莎·阿波卡利斯",
    description: "看似幼稚任性，实则背负阿波卡利斯的血脉与学园的责任，嘴硬心软，拼尽全力守护圣芙蕾雅与身边珍视之人。",
  },
  "ISFJ-T": {
    name: "八重樱",
    description: "被困神社与诅咒的一生，因至亲的悲剧深陷愧疚，常年压抑情感，被过往枷锁束缚，在自责与孤独中默默煎熬。",
  },
  "ESTJ-A": {
    name: "丽塔·洛丝薇瑟",
    description: "身为完美的执行者与侍从，行事严谨高效，恪守秩序与本分，历经无数杀伐，依旧保持优雅，冷静掌控所有局面。",
  },
  "ESTJ-T": {
    name: "米丝忒琳",
    description: "被天命规则与家族使命强行捆绑，被迫顺从既定命运，内心抗拒却无从反抗，长久的高压生活，让身心时刻紧绷焦虑。",
  },
  "ISTP-A": {
    name: "无量塔·姬子",
    description: "不拘世俗规矩，习惯独自扛下风雨，行事利落果决，坦然接纳遗憾与不完美，从容清醒地行走于崩坏之下。",
  },
  "ISTP-T": {
    name: "科斯魔",
    description: "沉默寡言的孤独战士，背负同伴的遗愿前行，习惯封闭内心不善倾诉，外表冷漠强悍，独处时满是孤独与自我怀疑。",
  },
  "ISFP-A": {
    name: "卡萝尔·佩珀",
    description: "性格热烈自由，热爱冒险与生活，不纠结过往遗憾与未知未来，接纳自身所有不完美，以松弛的心态拥抱每一个当下。",
  },
  "ISFP-T": {
    name: "瑟莉姆",
    description: "厌倦束缚偏爱慵懒独处，心思敏感细腻，情绪极易受外界影响，看似摆烂佛系，实则十分在意他人的看法与评价。",
  },
  "ESTP-A": {
    name: "识之律者",
    description: "挣脱天命束缚，性情张扬直率，蔑视规矩与教条，行事随心所欲，不惧世人眼光，活成独一无二、无拘无束的自己。",
  },
  "ESTP-T": {
    name: "西琳",
    description: "自幼遭受无尽折磨与囚禁，满心伤痕极度缺爱，暴戾只是伪装，内心脆弱敏感，一生都在渴求温暖与真心的陪伴。",
  },
  "ESFP-A": {
    name: "琪亚娜·卡斯兰娜",
    description: "从人造兵器蜕变为终焉之人，跨越毁灭与伤痛，挣脱命运操控，以阳光与坚强治愈一切，用笑容撑起整片世界。",
  },
  "ESFP-T": {
    name: "李素裳",
    description: "出身神州名门，身怀侠客之志，好胜倔强渴望认可，年少意气青涩敏感，在意他人目光，常会因挫败陷入迷茫与失落。",
  },
  "ESFJ-A": {
    name: "夜枭",
    description: "常怀共情之心维系羁绊，习惯照顾周遭同伴，在乱世之中以善意待人，将温情藏于日常的守护之中。",
  },
  "ESFJ-T": {
    name: "安娜·沙尼亚特",
    description: "身负沙尼亚特一族的温柔血脉，敏感细腻且善解人意，总在迁就他人、忽略自我，默默用陪伴治愈身边人的伤痛。",
  },
};

export function getPersonalityResult(type: string): PersonalityResult {
  const info = personalityDescriptions[type] || {
    name: '未知类型',
    description: '正在分析中...',
  };

  return {
    type,
    name: info.name,
    description: info.description,
    dimensions: {
      EI: {
        label: type.includes('E') ? '外向 (E)' : '内向 (I)',
        percentage: 0,
      },
      SN: {
        label: type.includes('S') ? '实感 (S)' : '直觉 (N)',
        percentage: 0,
      },
      TF: {
        label: type.includes('T') ? '思考 (T)' : '情感 (F)',
        percentage: 0,
      },
      JP: {
        label: type.includes('J') ? '判断 (J)' : '感知 (P)',
        percentage: 0,
      },
      AT: {
        label: type.includes('-A') ? '自信稳定 (A)' : '敏感动荡 (T)',
        percentage: 0,
      },
    },
  };
}
