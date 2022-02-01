module.exports = {
  SEED_CLASSES: [
    { id: 1, name: '聲音表達基礎班第140期', image: 'https://i.imgur.com/ZlQZFZ3.jpeg' },
    { id: 2, name: '聲音表達基礎班第141期', image: 'https://i.imgur.com/bHkQBPN.jpeg' },
    { id: 3, name: '聲音表達基礎班第142期', image: 'https://i.imgur.com/ZlQZFZ3.jpeg' },
  ],
  SEED_HOMEWORKS: [
    {
      name: '斷句練習',
      description: '錄音作業 1 : 斷句練習\r\n ​     請先為以下這篇文章加上標點符號，然後錄音。\r\n\r\n      可以用手機的錄音APP直接錄音，也可以用電腦外接麥克風錄音。\r\n\r\n      請將錄好的音檔上傳到 Hahow 本課程作業專區。\r\n\r\n錄音稿 :\r\n《麻衣相法·聲音篇》裡有一段關於「貴人之聲」的說明，它是這樣說的：「氣出於聲，聲發為韻，有聲無韻俗骨骼，有韻有聲貴人胎，故貴人之聲出於丹田，與心氣相通。」\r\n\r\n王者原型的聲音，要有貴氣。怎樣的聲音聽起來有貴氣? 首先要「出於丹田，與心氣相通」，「出於丹田」，就是用底氣說話，一口氣吸進去，就往下腹部走，再用下腹部的力量把氣往上推，經過胸腔共鳴，再從口腔送出去，這樣的說話方式，就叫做「有底氣」。「與心氣相通」，就是前面說的「內外合一」，就是誠懇、真心誠意。\r\n\r\n有了呼吸和共鳴的良好基礎，聽起來貴氣的聲音還來自「有韻有聲」。在用底氣說話的基礎上，聲音就會渾厚、清楚、宏亮，而且還有餘韻。有這樣聲音品質的人，身心都很健康，這也是王者必備的生理條件。\r\n\r\n貴氣還有一個條件，就是「慢」，相書上也說「聲慢者貴」。有貴氣的聲音不會是連珠炮，也不會叨叨絮絮，有話好好說，讓對方有時間聽清楚、有時間理解你的說話內容。',
      expiredTime: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: '強調練習',
      description: '錄音作業 1 : 強調練習\r\n請加入本單元所教的聲音強調技巧，來讀以下這篇文章，並錄音。\r\n可以用手機的錄音APP直接錄音，也可以用電腦外接麥克風錄音。\r\n請將錄好的音檔上傳到 Hahow 本課程作業專區。\r\n\r\n錄音稿 :\r\n\r\n生活是最好的練習場，對聲音學習來說更是如此。聲音要沉穩圓潤，心性必不能急躁衝動；聲音要清朗優揚，心性必不能陰鬱封閉。棄絕人世跑去山上修行是一種選擇，在浮華世界裡專心地走自己的路也是一種修行。\r\n\r\n並不是只有關在教室或錄音室裡才是學，生活中的人、事、物都可以對聲音學習有所啟發，可以用來練習聲音的素材俯拾皆是，像是在不打擾他人的前提下變換共鳴腔唸招牌、朗讀報章雜誌，或者模仿新聞播報、廣告、戲劇對白等，都是日常練功的方式。\r\n\r\n「唯有真實的情感，才有真正的感動！」認清自己的角色定位、所處情境，該說什麼話、該用什麼樣的聲音表情來說較為恰當，不只是演員或配音員的功課，更是每個人在生活中必修的學分，感受越豐富、情感越真實，這些技巧用起來就越遊刃有餘、越能感動自己，也感動別人。',
      expiredTime: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  file: {
    fieldname: 'voiceFile',
    originalname: '20191128 天下文化有聲書-華夏論述-李仕堡 二版 demo.mp3',
    encoding: '7bit',
    mimetype: 'audio/mpeg',
    destination: 'seeders/sample',
    filename: 'd774431f09fef76d8e411990277dee8d',
    path: 'seeders/sample/d774431f09fef76d8e411990277dee8d',
    size: 6257893
  },
  SEED_ATTENDCLASSES: [
    {
      UserId: 1,
      ClassId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      UserId: 1,
      ClassId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      UserId: 1,
      ClassId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
}
