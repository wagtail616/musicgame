//読み込み時の一度しか使わない

let isFirst = false;

const setFirst = () => {
  if (isFirst) return;
  isFirst = true;
  setCanvasSize();
  setContext();
  setRange();
};

const setCanvasSize = () =>
  (cvSize = {
    width: isSP ? window.innerWidth - 16 : VIDEO_SIZE.width, //スマホならサイズを半分にする
    height: window.innerHeight,
  });

const setContext = () => {
  const canvas = {
    back: document.getElementById("back"),
    layer: document.getElementById("layer"),
  };
  ctx = {
    back: canvas.back.getContext("2d"),
    layer: canvas.layer.getContext("2d"),
  };
  const scale = window.devicePixelRatio;
  canvas.back.width = canvas.layer.width = cvSize.width * scale;
  canvas.back.height = canvas.layer.height = cvSize.height * scale;
  ctx.back.scale(scale, scale);
  ctx.layer.scale(scale, scale);
};

const setRange = () => {
  rectRange = {
    y: (cvSize.height - cvSize.height / 6) | 0,
    get width() {
      return cvSize.width / notes.lineSize;
    },
    height: (cvSize.height / 24) | 0,
    leftSpace: 5,
    get rightSpace() {
      return this.leftSpace * 2 + 1;
    },
  };

  const accurate = [
    cvSize.height / 80, //perfect
    cvSize.height / 40, //excellent
    cvSize.height / 25, //good
    cvSize.height / 18, //normal
  ];
  inputRange = {
    top: accurate.map((value) => (rectRange.y - value) | 0),
    bottom: accurate.map((value) => (rectRange.y + rectRange.height + value) | 0),
    over: (rectRange.y - cvSize.height / 14) | 0,
  };

  const center = (window.innerWidth - cvSize.width) / 2;
  touchRange = {
    top: cvSize.height / 2,
    getLeft(i) {
      return rectRange.width * i + center;
    },
    getRight(i) {
      return this.getLeft(i) + rectRange.width;
    },
  };
};
