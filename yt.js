//APIリファレンスを参照
//https://developers.google.com/youtube/iframe_api_reference?hl=ja

const tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";

const firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
  isSP = window.innerWidth < VIDEO_SIZE.width; //画面の幅が640未満ならスマホ
  player = new YT.Player("player", {
    width: isSP ? VIDEO_SIZE.width / 2 : VIDEO_SIZE.width, //スマホならサイズを半分にする
    height: isSP ? VIDEO_SIZE.height / 2 : VIDEO_SIZE.height, //スマホならサイズを半分にする
    videoId: "eImN9Ov-tJg",
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
    playerVars: {
      controls: 0,
      showinfo: 0,
    },
  });
}

function onPlayerReady(e) {
  setFirst();
  setStandby();
}

function onPlayerStateChange(e) {}
