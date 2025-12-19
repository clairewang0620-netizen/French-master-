import { ReadingItem } from '../types';

const AUDIO_BASE = "/audio/reading";

export const readingData: ReadingItem[] = [
  {
    id: "r-a1-1",
    title: "Ma vie à Paris",
    level: "A1",
    audioUrl: `${AUDIO_BASE}/reading_1.mp3`,
    content_fr: "Bonjour ! Je m'appelle Thomas. J'habite à Paris depuis deux ans. Paris est une ville magnifique avec beaucoup d'histoire. Chaque matin, je me lève à sept heures. Je prends un petit-déjeuner typique : un café au lait et un croissant. Après, je marche un peu dans mon quartier. Je vais à l'université en métro parce que c'est rapide.\n\nJ'étudie l'histoire de l'art. C'est passionnant ! Les lumières de la ville sont très belles le soir. Paris est vraiment magique. Le week-end, je sors avec mes amis. Nous allons au café ou au musée du Louvre. J'aime aussi marcher près de la Seine. C'est très romantique.",
    content_zh: "你好！我叫托马斯。我在巴黎住了两年。巴黎是一座历史悠久的美丽城市。每天早上，我七点起床。我吃一份典型的早餐：一杯牛奶咖啡和一个羊角面包。之后，我在我的街区散会儿步。我坐地铁去大学，因为很快。\n\n我学习艺术史。这太迷人了！夜晚城市的灯光非常美丽。巴黎真的很神奇。周末，我和朋友们一起出去。我们去咖啡馆或卢浮宫。我也喜欢在塞纳河边散步。这非常浪漫。",
    keywords: [
      { fr: "Habiter", ipa: "/a.bi.te/", zh: "居住" },
      { fr: "Typique", ipa: "/ti.pik/", zh: "典型的" },
      { fr: "Magnifique", ipa: "/ma.ɲi.fik/", zh: "壮丽的" }
    ]
  },
  {
    id: "r-a1-2",
    title: "La Cuisine Française",
    level: "A1",
    audioUrl: `${AUDIO_BASE}/reading_2.mp3`,
    content_fr: "La cuisine est très importante en France. Les Français aiment manger et discuter à table. Le matin, on mange du pain avec du beurre et de la confiture. Le midi, on mange souvent au restaurant ou à la cantine. On prend une entrée, un plat et un dessert. C'est une tradition. \n\nLes fromages français sont célèbres dans le monde entier. Il existe plus de mille sortes de fromages ! Le vin est aussi une partie importante de la culture gastronomique. Pour les Français, le repas est un moment de partage et de convivialité. On ne mange pas vite, on prend le temps.",
    content_zh: "烹饪在法国非常重要。法国人喜欢在餐桌上边吃边聊。早上，人们吃抹了黄油和果酱的面包。中午，人们经常在餐馆或食堂吃饭。通常会有点前菜、主菜和甜点。这是一种传统。\n\n法国奶酪享誉全球。有超过一千种奶酪！葡萄酒也是美食文化的重要组成部分。对于法国人来说，用餐是分享和欢乐的时刻。人们吃得不快，而是慢慢享受。",
    keywords: [
      { fr: "Cuisine", ipa: "/kɥi.zin/", zh: "烹饪/厨房" },
      { fr: "Important", ipa: "/ɛ̃.pɔʁ.tɑ̃/", zh: "重要的" },
      { fr: "Tradition", ipa: "/tʁa.di.sjɔ̃/", zh: "传统" }
    ]
  },
  {
    id: "r-a2-1",
    title: "Le Voyage en Bretagne",
    level: "A2",
    audioUrl: `${AUDIO_BASE}/reading_3.mp3`,
    content_fr: "L'été dernier, je suis allé en Bretagne avec ma famille. C'est une région située dans le nord-ouest de la France. Le paysage est sauvage et la mer est d'un bleu profond. Nous avons visité de petits villages de pêcheurs avec des maisons en pierre.\n\nLa gastronomie bretonne est délicieuse. Nous avons mangé des crêpes et des galettes. Les galettes sont faites avec de la farine de sarrasin. C'est salé ! Nous avons aussi goûté le cidre local. Même s'il a plu un peu, c'était un voyage inoubliable.",
    content_zh: "去年夏天，我和家人一起去了布列塔尼。这是位于法国西北部的一个地区。风景原始，海水呈深蓝色。我们参观了一些有着石头房子的渔村。\n\n布列塔尼的美食非常美味。我们吃了薄饼和咸味薄饼（galettes）。咸味薄饼是用荞麦粉做的。它是咸的！我们还品尝了当地的苹果酒。虽然下了一点雨，但这仍然是一次难忘的旅行。",
    keywords: [
      { fr: "Sauvage", ipa: "/so.vaʒ/", zh: "原始的/荒野的" },
      { fr: "Pêcheur", ipa: "/pɛ.ʃœʁ/", zh: "渔夫" },
      { fr: "Inoubliable", ipa: "/i.nu.bli.abl/", zh: "难忘的" }
    ]
  },
  // Add 17 more articles following the same structure to reach 20...
];
