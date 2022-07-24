// アンサー音を読み込む
/** アンサー音*/
const anser = new Audio('./tap.wav');
anser.volume=1.0;
const VIDEO_SIZE = {
    width: 640,
    height: 360,
  },
  CANVAS = {
    back: 0,
    layer: 1,
  },
  //状態
  GAME_MODE = {
    standby: 1,
    play: 2,
    playData: 3,
    end: 4,
    cancel: 5,
    wait: 9,
    state: null,
  },
  
  //タイミング判定名の定義
  JUDGE = {
    perfect: 0,
    excellent: 1,
    good: 2,
    normal: 3,
    miss: 4,
    empty:5,//判定なし
    //配列のサイズ??????
    size: 5,
    score: [],
    text: ["perfect", "excellent", "good", "normal", "miss", "empty"],
  },
  //バーの色
  BAR_COLOR = [
    "#ff007f",
    "#007fff",
    "#7f00ff",
    "#ffff00",
    "#00ff7f",
    "#ffadd6",
    "#add6ff",
    "#adffad",
    "#ffffad",
    "#d6adff",
  ],
  //キーボード入力
  KEY = [
    ["f", "j"],
    ["d", "f", "j", "k"],
    ["s", "d", "f", "j", "k", "l"],
    ["a", "s", "d", "f", "j", "k", "l", ";"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"],
  ];

let player; //YouTube
let isSP; //trueならスマホ
let isPortrait; //true縦向き
let ctx; //コンテキスト
let cvSize; //キャンバスサイズ
let rectRange; //矩形範囲
let inputRange; //入力範囲
let touchRange; //タッチ範囲
let notes; //譜面データ
let playData; //プレイデータ
let keyList; //キーリスト

let bar; //タイミングバー
class Bar {
  #width = rectRange.width - rectRange.rightSpace;
  #height = rectRange.height;
  constructor(i, color) {
    this.x = rectRange.width * i + rectRange.leftSpace;
    this.color = color;
  }
  draw(y) {
    ctx.layer.fillStyle = this.color;
    ctx.layer.fillRect(this.x, y, this.#width, this.#height);
  }
}

//スタンバイ状態
const setStandby = () => {
  player.stopVideo();

  setGameData();
  gameStandby();
};

//譜面データをセット
const setGameData = () => {
  notes = {
    lineSize: FILE.lineSize,//ライン数
    timing: FILE.timing,//入力タイミング
    line: FILE.line,//ライン
    index: 0,
    anserIndex:0,
    offset: 0,
    getSize() {
      return this.timing.length;
    },
    get isEnd() {
      return this.timing.length <= this.offset;
    },
  };
};

//wait
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//対象のctxをクリア
const clearCanvas = (ctx) => ctx.clearRect(0, 0, cvSize.width, cvSize.height);

//0埋め
const padZero = (value, digit) => value.toString().padStart(digit, "0");

//スタンバイ
const gameStandby = async () => {
  GAME_MODE.state = GAME_MODE.standby;

  //ラインを描画
  const drawLine = () => {
    ctx.back.lineWidth = 1;
    ctx.back.strokeStyle = "#ffffff77";
    ctx.back.beginPath();
    const size = notes.lineSize + 1;
    for (let i = 0; i < size; ++i) {
      let x = rectRange.width * i - 0.5;
      if (i === 0) ++x;
      ctx.back.moveTo(x, 0);
      ctx.back.lineTo(x, cvSize.height);
    }
    ctx.back.stroke();
  };

  //矩形を描画
  const drawBoxes = () => {
    const drawBox = (i) => {
      let x = rectRange.width * i + rectRange.leftSpace + 1,
        width = rectRange.width - rectRange.rightSpace;
      if (0 < i) x -= 1;
      ctx.back.strokeStyle = BAR_COLOR[i];
      ctx.back.strokeRect(x, rectRange.y + 0.5, width, rectRange.height);
      ctx.back.fillStyle = BAR_COLOR[i] + "55";
      ctx.back.fillRect(x, rectRange.y, width, rectRange.height);
    };
    ctx.back.lineWidth = 2;
    for (let i = 0; i < notes.lineSize; ++i) drawBox(i);
  };

  //判定枠に文字追加
  const drawAlphabet=()=>{
    ctx.back.font = "28pt sans-serif";
    ctx.back.fillStyle = "white";
    
    ctx.back.fillText("a",30,500);
    ctx.back.fillText("s",110,500);
    ctx.back.fillText("d",190,500);
    ctx.back.fillText("f",275,500);

    ctx.back.fillText("j",355,500);
    ctx.back.fillText("k",430,500);
    ctx.back.fillText("l",515,500);
    ctx.back.fillText(";",590,500);

  } 


  //テキストを描画
  const text = "TOUCH START";
  const drawText = () => {
    ctx.layer.font = "28pt sans-serif";
    ctx.layer.fillStyle = "white";
    //開始文字を黒く縁取り
    ctx.layer.fillText(text, (cvSize.width - ctx.layer.measureText(text).width) / 2, cvSize.height / 1.75);
    ctx.layer.fillStyle = "black";
    ctx.layer.strokeText(text, (cvSize.width - ctx.layer.measureText(text).width) / 2, cvSize.height / 1.75);
  };

  drawBoxes();
  drawLine();
  drawAlphabet();

  let b = false;
  while (GAME_MODE.state === GAME_MODE.standby) {
    clearCanvas(ctx.layer);
    if ((b = !b)) drawText();
    await sleep(500);
  }
};

//プレイデータを初期化
const initGame = () => {
  playData = {
    score: 0, //点数
    combo: 0, //コンボ
    maxCombo: 0, //MAXコンボ
    judge: null, //タイミング判定
    judgeCount: JUDGE.text.map(() => 0), //各タイミングの判定回数
    speed: 1.5, //落下速度
    isInput: false, //trueなら入力あり
    inputLine: null, //入力ライン
    over: false, //入力ラインを越えたか
    index: 0, //ずれ防止用入力対象
    setInput(line, over) {
      this.isInput = true;
      this.inputLine = line;
      this.over = over;
      this.index = notes.index;
    },
  };

  //ライン数分のバーを作成
  const barColor = BAR_COLOR.map((value) => value + "cc");
  const size = notes.getSize();
  bar = [];
  for (let i = 0; i < notes.lineSize; ++i) bar[i] = new Bar(i, barColor[i]);

 //PC用キーを設定
  keyList = KEY[notes.lineSize / 2 - 1];
};

//プレイ
const gamePlay = async () => {
  GAME_MODE.state = GAME_MODE.play;

  initGame();
  //+"77" 透明度追加
  const effectColor = BAR_COLOR.map((value) => value + "77");
  let drawCount = 0; //描画カウンター

  //入力ミス
  const setInputMiss = () => {
    playData.combo = 0;
    ++playData.judgeCount[(playData.judge = JUDGE.miss)];
  };

  //ノーツを描画
  const drawTimingBar = (current) => {
    // const current = (player.getCurrentTime() * 1000) | 0;
    for (let i = notes.offset, size = notes.getSize(); i < size; ++i) {
      const y = (current - notes.timing[i]) / playData.speed + rectRange.y - rectRange.height;
      //見えてないノーツは消す
      if (y < 0) { break; }

      
      bar[notes.line[i]].draw(y);
      if (i == notes.index && inputRange.bottom[JUDGE.normal] < y) {
        setInputMiss();
        drawCount = 30;
        notes.index = i + 1;
      }
      if (cvSize.height < y) notes.offset = i + 1;
    }
  };
/**
 * アンサー音を鳴らす
 * @param {number} current 曲が始まってからの経過時間
 */
  const soundControll = (current) =>{
    while(current>=notes.timing[notes.anserIndex]){
      anser.currentTime=0;
      anser.play();
      notes.anserIndex++;
    }
  }
  //判定を描画
  const drawJudge = () => {
    if (drawCount <= 0) return;
    ctx.layer.font = "32pt sans-serif";
    //判定によって文字色変更
    switch(playData.judge){
      case 0:ctx.layer.fillStyle = "yellow";
      break;
      case 1:ctx.layer.fillStyle = "red";
      break;
      case 2:ctx.layer.fillStyle = "orage";
      break;
      case 3:ctx.layer.fillStyle = "green";
      break;
      case 4:ctx.layer.fillStyle = "blue";
      break;
    }
    //判定を画面に描画
    ctx.layer.fillText(
      JUDGE.text[playData.judge],
      (cvSize.width - ctx.layer.measureText(JUDGE.text[playData.judge]).width) >> 1,
      cvSize.height / 2 + drawCount
    );
    //黒く縁取り
    ctx.layer.fillStyle = "black";
    ctx.layer.strokeText(
      JUDGE.text[playData.judge],
      (cvSize.width - ctx.layer.measureText(JUDGE.text[playData.judge]).width) >> 1,
      cvSize.height / 2 + drawCount
    );

    if (1 < playData.combo) {
      let text = playData.combo + " Combo";
      //白文字
      ctx.layer.fillStyle = "white";
      ctx.layer.fillText(
        text,
        (cvSize.width - ctx.layer.measureText(text).width) >> 1,
        cvSize.height / 1.75 + drawCount
      );
      //黒く縁取り
      ctx.layer.fillStyle = "black";
      ctx.layer.strokeText(
        text,
        (cvSize.width - ctx.layer.measureText(text).width) >> 1,
        cvSize.height / 1.75 + drawCount
      );
    }
    --drawCount;
  };

  //入力エフェクトを描画
  const drawInputEffect = () => {
    ctx.layer.fillStyle = effectColor[playData.inputLine];
    ctx.layer.fillRect(
      rectRange.width * playData.inputLine + rectRange.leftSpace,
      0,
      rectRange.width - rectRange.rightSpace,
      cvSize.height
    );
  };

  //タイミング判定
  const judge = () => {
    if (playData.isInput) {
      if (playData.judge !== JUDGE.empty) {

        notes.offset = ++notes.index;
        
        ++playData.judgeCount[playData.judge];
        if (playData.maxCombo < ++playData.combo) {
          playData.maxCombo = playData.combo;
        }
      }
      if (playData.over && notes.index === playData.index) notes.offset = ++notes.index;
      drawInputEffect();
      playData.isInput = false;
      drawCount = 30;
    }
  };

  //プレイデータを描画
  const drawPlayData = () => {
    clearCanvas(ctx.back);
    clearCanvas(ctx.layer);
    let digit = 10;
    //ノーツ数から最大の点数を計算する
    let max_point=notes.getSize()*500;

    let ScoreRate=point/max_point*100;
    while (true) {
      if (notes.getSize() < digit) {
        digit = String(digit - 1).length;
        break;
      }
      digit *= 10;
    }
    playrank(ScoreRate);

    ctx.layer.font = "24pt sans-serif";
    ctx.layer.fillStyle = "white";
    const mesure = ctx.layer.measureText(
        JUDGE.text[JUDGE.excellent] + " : " + padZero(playData.judgeCount[JUDGE.excellent], digit)
      ),
      right = (cvSize.width - mesure.width) / 2,
      textHeight = mesure.actualBoundingBoxAscent + mesure.actualBoundingBoxDescent + 8,
      list = [...JUDGE.text, "combo"],
      data = [...playData.judgeCount, playData.maxCombo];
    for (let [i, text] of list.entries()) {
      text += " : " + padZero(data[i], digit);
      const x = i === JUDGE.excellent ? right : cvSize.width - right - ctx.layer.measureText(text).width;
      ctx.layer.fillText(text, x-200, cvSize.height / 2 + textHeight * i+110);
    }
    //白文字
    ctx.layer.fillText("ScoreRate:"+ScoreRate.toFixed(2).toString()+"%", cvSize.width/2-100, cvSize.height / 2 + textHeight);
    //黒く縁取り
    ctx.layer.fillStyle = "black";
    ctx.layer.strokeText("ScoreRate:"+ScoreRate.toFixed(2).toString()+"%", cvSize.width/2-100, cvSize.height / 2 + textHeight);

  };

  //プレイ終了
  const gameEnd = () => {
    GAME_MODE.state = GAME_MODE.playData;
    player.stopVideo();

    drawPlayData();
    setTimeout(() => {
      notes = playData = bar = null;
      GAME_MODE.state = GAME_MODE.end;
    }, 1000);
  };

  player.playVideo();

  while (GAME_MODE.state === GAME_MODE.play) {
    const current = (player.getCurrentTime() * 1000) | 0;
    clearCanvas(ctx.layer);
    judge();
    if(playData.judge!=JUDGE.empty){
      drawJudge();
    }
    drawTimingBar(current);
    soundControll(current);
    if (notes.isEnd) {
      //sleepでリザルト画面までの時間延ばす
      await sleep(1000);
      gameEnd();
    }
    await sleep(16);
  }
};
// perfect: 0,
// excellent: 1,
// good: 2,
// normal: 3,
// miss: 4,
//入力情報をセット

let point=0;
const setInput = (line) => {
  const y =
    (((player.getCurrentTime() * 1000) | 0) - notes.timing[notes.index]) / playData.speed + rectRange.y;
  playData.setInput(line, inputRange.over < y);
  playData.judge = JUDGE.empty;
  if (line === notes.line[notes.index]) {
    for (let i = 0; i < JUDGE.size; ++i) {
      if (inputRange.top[i]-20 < y && y < inputRange.bottom[i]+20) {
        playData.judge = i;
        switch(playData.judge){
          // 判定によって点数を加算
          case 0:point+=500;
            break;
          case 1:point+=300;
            break;
          case 2:point+=200;
            break;
          case 3:point+=100;
            break;
          case 4:point-=100;
            break;
        }
        break;
      }
    }
  }
};

//タッチ
const touch = (e) => {
  if (touchRange.top < e.pageY && e.pageY < cvSize.height) {
    for (let i = 0; i < notes.lineSize; ++i) {
      if (touchRange.getLeft(i) < e.pageX && e.pageX < touchRange.getRight(i)) {
        setInput(i);
        break;
      }
    }
  }
};

const controller = {};
// ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"],
//キーボード
const push = (kb) => {
  // for (let [i, key] of keyList.entries()) {
    // if (key === kb) {
      switch(event.key){
        case'a':setInput(0);
        break;
        case's':setInput(1);
        break;
        case'd':setInput(2);
        break;
        case'f':setInput(3);
        break;
        case'j':setInput(4);
        break;
        case'k':setInput(5);
        break;
        case'l':setInput(6);
        break;
        case';':setInput(7);
        break;
      }
      
      // break;
    // }
  // }
};

// 同時押し用入力
document.addEventListener('keydown', (event) => {
  console.log(`keydown:${event.code}`);
  controller[event.code] = true;
});

//入力
const input = (isTouch={}, e) => {
  
  switch (GAME_MODE.state) {
    case GAME_MODE.standby:
      gamePlay();
      break;
    case GAME_MODE.play:
      isTouch ? touch(e.changedTouches[0]) : push(e.key);
      break;
    
      case GAME_MODE.end:

      setGameData();
      retry();
      break;
  }
};

window.onload = () => {
  document.documentElement.addEventListener("touchstart", (e) => input(true, e));
  document.onkeydown = (e) => {
    if (e.repeat) return;
    input(false, e);
  };
};

//ランク表示
const playrank=(ScoreRate)=>{
  ctx.layer.font = "64pt sans-serif";
  let Rank;
  if(ScoreRate==100){
    Rank="SSS";
  }else if(ScoreRate>=99){
    Rank="SS";
  }else if(ScoreRate>=97){
    Rank="S";
  }else if(ScoreRate>=90){
    Rank="AA";
  }else if(ScoreRate>=80){
    Rank="A";
  }else if(ScoreRate>=60){
    Rank="B";
  }else if(ScoreRate>=50){
    Rank="C";
  }else{
    Rank="D";
  }
  // 白文字
  ctx.layer.fillStyle = "white";
  ctx.layer.fillText(Rank, cvSize.width/2, cvSize.height / 2);
  // 黒く縁取り
  ctx.layer.fillStyle = "black";
  ctx.layer.strokeText(Rank, cvSize.width/2, cvSize.height / 2 );

}


const retry=()=>{
  //ポイントと最大ポイントの初期化
  point=0;
  max_point=0;
  gameStandby();
}