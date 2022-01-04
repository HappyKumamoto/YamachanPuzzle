
   
let screen_w = window.innerWidth;
let screen_h = window.innerHeight;

const KAMIFUBUKI = 150;
const COLORS =
//["#33FF66","#FFFF00", "#FF990","#FF0000","#6600FF","#1E90FF","#FFFFE0",];
["#F5A4B8","#BEC14B","#DED5C0","#F8D400","#BBD33E","#A85EAC","#D64464","#336699", "#90EE90","FA8072"];
//鴇色(とき),鶸色(ひわ),象牙色,ジョンブリアン,シャトルーズグリーン,パープル,ローズ,divに設定した色

function rand(min , max){//minとmaxの間で整数の乱数を求める
    return(Math.floor(
        Math.random() * (max-min+1)+min));
}

class Kam {
    constructor(){
        this.elm = document.createElement("div");//divタグの中にその都度作る
        document.body.appendChild(this.elm);  //Element要素を足していく

        this.sty = this.elm.style;

        this.x = rand(0,screen_w);//紙の位置
        this.y = rand(0,screen_h);

        this.vx = rand(-10,10);//横方向の動き
        this.vy = rand(5,10);  //たて方向

        this.ang = 0;//回転角度初期値
        this.spd = rand(15,40);//回転する角度。早めと遅め
        this.rX  = rand(0,10)/10;//0〜1まで0.2刻み。それぞれの軸で
        this.rY  = rand(0,10)/10;
        this.rZ  = rand(0,10)/10;

        this.sty.position = "fixed";
        
        this.sty.width = "37px";//紙一枚の設定
        this.sty.height = "14px";
        this.sty.borderRadius = "5px";//角丸に

        this.sty.backgroundColor = COLORS[//色をランダムに
            rand(0,COLORS.length-1)];

    }

    update(){
        this.x += this.vx;
        this.y += this.vy;
        if(this.y >= screen_h){//画面下端まで降りたら上から繰り返し
            this.x = rand(0,screen_w);
            this.y = -20;
        }

        this.ang += this.spd;
        this.sty.left = this.x + "px";
        this.sty.top =  this.y + "px";
        this.sty.transform = "rotate3D(" +this.rX + "," + this.rY + ","
            + this.rZ + "," + this.ang + "deg)";
    }
}

let kami = [];//紙吹雪を枚数分作る
for (let i = 0 ; i<KAMIFUBUKI ; i++)
    kami.push(new Kam());

function mainLoop(){
    for (let i = 0; i<KAMIFUBUKI; i++)
    kami[i].update();
}
setInterval(mainLoop, 50);