//譜面データが入ったファイル
//今回は変数
let BPM=240;
let i=60/BPM*1000;
const FILE = {
    lineSize: 8,
    
    timing: [
        i*2.5,i*2.5,
        i*3.5,i*4,
        i*5,i*5,
        i*6,
        i*7,i*7.5,i*8,
        i*8.5,i*9,i*9.5,i*10,
        i*10.5,i*11,i*11.5,i*12,
        i*12.5,i*12.75,i*13,
        i*13.5,i*13.5,
        i*14,
        i*14.5,i*15,i*15.5,i*16,
        i*16.5,i*17,i*17.5,
        i*18,i*18.5,
        i*19.5,
        i*20,
        i*21,i*21,
        i*22,i*22,
        i*23,i*23.5,i*24,
        i*24.5,i*25,i*25.5,i*26,
        i*26.5,i*27,i*27,
        i*28,i*28.5,i*29,
        i*29.5,i*29.5,
        i*30.5,i*30.5,i*31,i*31,
        i*31.5,i*31.5,i*32,i*32,
        i*32.5,i*32.75,i*33,i*33.25,
        i*33.5,i*33.75,i*34,i*34.25,
        i*34.5,i*34.5,
        i*35.5,i*36,
        i*36.5,i*37,i*37.5,
        i*38,i*38.5,i*39,i*40,
        i*40.5,i*41,i*41.5,i*41.5,
        i*42.5,i*43,i*43.5,
        i*44,i*44.125,i*44.25,i*44.375,
        i*45,i*45.125,i*45.25,i*45.375,
        i*46,i*46.125,i*46.25,i*46.375,
        i*47,i*47.125,i*47.25,i*47.375,
        i*48,i*48.125,i*48.25,i*48.375,
        i*48.5,i*48.625,i*48.75,i*48.875,
        i*49,i*49.125,i*49.25,i*49.375,
        i*49.5,
        i*50.5,
        i*51.5,i*52,i*52,
        i*53,i*53.5,i*53.5,
        i*54.5,
        i*55.5,i*56,
        i*57,i*57.5,
        i*58.5,i*58.5,
        i*59.5,i*59.5,
        i*60,i*60,
        i*62,
        i*62.5,i*63,i*63.5,i*64,i*64.5,i*65,i*65.5,
        i*66.5,i*66.5,

        i*67.5,i*68,
        i*68.5,i*69,i*69.5,
        i*70,i*70.5,i*71,
        
        i*72,i*72.5,i*73,i*73.5,i*73.5,
        
        i*74.5,i*75,i*75.5,

        i*76,i*76.125,i*76.25,i*76.375,
        i*77,i*77.125,i*77.25,i*77.375,
        i*78,i*78.125,i*78.25,i*78.375,

        i*78.5,i*78.625,i*78.75,i*78.875,i*79,
        i*79.75,i*79.75,
        i*80.5,i*80.625,i*80.75,i*80.875,i*81,

        i*82.5,i*83,i*83.5,i*83.5,
        i*84,i*84.5,i*85,i*85,
        i*85.5,i*85.5,
        
        i*86.5,i*86.5,
        i*87.5,i*88,i*88,
        i*89,i*89.5,i*89.5,

        i*90.5,i*91,i*91.5,i*92,
        i*92.5,i*93,i*93.5,i*94,
        
        i*94.5,i*94.5,i*95,i*95,
        i*95.5,i*95.5,i*96,i*96,
        i*96.5,i*96.5,i*97,i*97,
        i*97.5,i*97.5,i*98,i*98,
    ],
    line: [
        3,4,
        4,3,
        2,5,
        1,
        7,6,5,
        0,0,1,1,
        4,3,5,2,
        6,1,6,
        6,1,
        1,1,1,6,
        5,5,2,
        4,3,
        4,
        2,5,
        1,6,
        3,4,
        0,1,2,
        7,7,6,6,
        3,1,7,
        6,6,6,1,6,
        3,4,2,5,
        1,6,0,7,
        7,0,6,1,5,2,4,3,4,3,
        6,6,
        2,5,2,
        7,2,5,2,
        6,6,2,6,
        4,3,4,
        3,2,1,0,
        4,5,6,7,
        3,2,1,0,
        4,5,6,7,
        3,2,1,0,
        4,5,6,7,
        3,2,1,0,
        4,
        3,
        6,1,6,
        1,1,6,
        4,4,
        3,3,4,
        3,7,
        1,5,
        0,4,
        6,
        1,5,5,5,5,5,5,
        1,5,
        1,1,
        5,2,5,
        0,5,2,
        5,1,1,5,1,
        3,4,3,
        4,5,6,7,
        3,2,1,0,
        4,5,6,7,
        0,4,0,4,0,
        2,5,
        7,3,7,3,7,
        4,3,2,5,
        3,4,2,5,
        1,6,
        3,4,
        5,2,5,
        1,1,6,
        4,4,3,3,
        5,5,2,2,

        3,4,3,4,
        2,5,2,5,
        1,6,1,6,
        0,7,0,7,
    ],
  };
  