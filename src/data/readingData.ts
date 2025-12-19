
import { ReadingItem } from '../types';

const BASE_URL = "https://lumiere-french.pages.dev/audio";

export const readingData: ReadingItem[] = [
  {
    id: "r-a1-1",
    title: "Ma vie à Paris",
    level: "A1",
    audioUrl: `${BASE_URL}/reading_01.mp3`,
    content_fr: "Bonjour ! Je m'appelle Thomas. J'habite à Paris depuis deux ans. Paris est une ville magnifique avec beaucoup d'histoire. Chaque matin, je me lève à sept heures. Je prends un petit-déjeuner typique : un café au lait et un croissant. Après, je marche un peu dans mon quartier. Je vais à l'université en métro parce que c'est rapide.\n\nJ'étudie l'histoire de l'art. C'est passionnant ! Les lumières de la ville sont très belles le soir. Paris est vraiment magique. Le week-end, je sors avec mes amis. Nous allons au café ou au musée du Louvre. J'aime aussi marcher près de la Seine. C'est très romantique.",
    content_zh: "你好！我叫托马斯。我在巴黎住了两年。巴黎是一座历史悠久的美丽城市。每天早上，我七点起床。我吃一份典型的早餐：一杯牛奶咖啡和一个羊角面包。之后，我在我的街区散会儿步。我坐地铁去大学，因为很快。",
    keywords: [
      { fr: "Habiter", ipa: "/a.bi.te/", zh: "居住" },
      { fr: "Typique", ipa: "/ti.pik/", zh: "典型的" }
    ]
  },
  {
    id: "r-a1-2",
    title: "La Cuisine Française",
    level: "A1",
    audioUrl: `${BASE_URL}/reading_02.mp3`,
    content_fr: "La cuisine est très importante en France. Les Français aiment manger et discuter à table. Le matin, on mange du pain avec du beurre et de la confiture. Le midi, on mange souvent au restaurant ou à la cantine. On prend une entrée, un plat et un dessert. C'est une tradition.",
    content_zh: "烹饪在法国非常重要。法国人喜欢在餐桌上边吃边聊。早上，人们吃抹了黄油和果酱的面包。中午，人们经常在餐馆或食堂吃饭。通常会有点前菜、主菜和甜点。这是一种传统。",
    // Fixed: Added missing keywords array to satisfy ReadingItem interface
    keywords: []
  }
];
