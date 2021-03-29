let mouseMoved = 0; //从鼠标进入banner起向右移动的距离与屏幕宽度的比
let mouseIn; //鼠标进入banner时，鼠标左边部分宽度与屏幕宽度的比

const header = document.querySelector('header');
const canvas = document.querySelector('#canvas');
//各层图片
const day = document.querySelector('#day');
const sunset = document.querySelector('#sunset');
const snowball = document.querySelector('#snowball');
const night = document.querySelector('#night');
const fog = document.querySelector('#fog');
const treeDay = document.querySelector('#tree-day');
const treeSunset = document.querySelector('#tree-sunset');
const treeNight = document.querySelector('#tree-night');

header.addEventListener('mouseenter', ({clientX}) => mouseIn = clientX / innerWidth);
header.addEventListener('mousemove', ({clientX}) => mouseMoved = clientX / innerWidth - mouseIn);
header.addEventListener('mouseleave', () => {
  //鼠标离开banner时，慢慢复原到日落状态
  let start = Date.now();
  let mouseMovedBeforeReset = mouseMoved;
  let restore = setInterval(() => {
    let progress = (Date.now() - start) / 250;
    mouseMoved = mouseMovedBeforeReset * (1 - progress);
    if(progress >= 1) {
      mouseMoved = 0;
      clearInterval(restore);
    }
    computeStyles();
  }, 10);
});
const applyTransform = (translateX = 0, translateY = 0, rotate = 0, scale = 1) => `scale(${scale}) translate(${translateX}px, ${translateY}px) rotate(${rotate}deg)`;
function computeStyles() {
  //计算图片的位移、不透明度、旋转角度、缩放、模糊度。
  //document.querySelector('#debug').innerText = `鼠标进入：${mouseIn}  鼠标移动：${mouseMoved}`;
  
  //模糊度固定不变
  treeDay.style.filter = treeSunset.style.filter = 'blur(2px)';
  treeNight.style.filter = 'blur(5px)';
  
  //鼠标移动1个屏幕的宽度时，雪球转6deg，左移顺时针，右移逆时针，默认10deg
  const rotationOfSnowball = 10 - 6 * mouseMoved;
  
  //雪球、景和树的不透明度同步变化（虽然从B站上观测到不是这样，但作者懒得细究其变化关系）
  day.style.opacity = treeDay.style.opacity = 1;
  snowball.style.opacity = sunset.style.opacity = treeSunset.style.opacity = Math.min(Math.max(2.5 * mouseMoved +1, 0), 1);
  night.style.opacity = treeNight.style.opacity = Math.max(mouseMoved * 2.5, 0);
  
  //在夜景不透明后，雾才开始不透明
  fog.style.opacity = Math.max(0, mouseMoved * 3.75 - 1.5);
  
  //景位移
  const rangeOfMovement = innerWidth * 0.025 + 36.345; //可移动范围
  const movementOfScene = mouseMoved * -rangeOfMovement;
  
  //树移动得快点儿
  const movementOfTrees = movementOfScene * 1.5;
  
  //雪球位移
  const translateYOfSnowball = -10 * mouseMoved ** 2 - 60 * mouseMoved + 20;
  const translateXOfSnowball = movementOfScene * -2;
  
  //应用各transform属性
  fog.style.transform = day.style.transform = sunset.style.transform = night.style.transform = applyTransform(movementOfScene);
  treeDay.style.transform = treeSunset.style.transform = treeNight.style.transform = applyTransform(movementOfTrees);
  snowball.style.transform = applyTransform(translateXOfSnowball, translateYOfSnowball, rotationOfSnowball);
}
computeStyles();
header.addEventListener('mousemove', computeStyles);
addEventListener('resize', () => {
  let {height, width} = getComputedStyle(header);
  canvas.height = parseFloat(height);
  canvas.width = parseFloat(width);
});
dispatchEvent(new Event('resize'));


/**
	 * 定义<canvas>画布;
	 * @type {[type]}
	 */
 var width=window.innerWidth;//获取系统显示宽度;
 var height=window.innerHeight;//获取系统显示高度;
//  var canvas=document.querySelector("#canvas");
 var context=canvas.getContext("2d");
 var snowArray=[];//声明一个数组，用于存放创建出来的雪花对象；

 canvas.width=width;//设置画布的宽度为系统显示宽度;
 canvas.height=height;//设置画布的高度为系统显示高度;

 cartoon();          //调用动画;
 
 /**
  * 定义雪花类;
  */
 class Snowflake{
     constructor(){
         this.init();//构造函数，调用定义好的init()方法;
     }
     init(){
         this.position={   //雪花对象的位置;
             x:Math.random()*width,//x坐标随机;
             y:Math.random()*height,//y坐标随机;
         }
         this.speed=Math.random()*10;//雪花下落速度为0-10以内的随机数;
         this.r=Math.random()*6;//雪花的半径为0-6以内的随机数;
         this.transparency=Math.random();//设置雪花的透明度为随机;
         this.color={
             r1:"255",//雪花颜色随机;
             g:"255",
             b:"255",
         }
     }
     draw(){//雪花绘制方法;
         this.position.y++;//y坐标每次递增1像素;
         this.transparency-=0.01;//透明度每次递减0.01;
         if(this.transparency<=0){//透明度小于0，即雪花消失，重新绘制雪花;
             this.init();
         }
         context.beginPath();//开始一个新的图形绘制;
         context.fillStyle="rgba("+this.color.r1+","+this.color.g+","+this.color.b+","+this.transparency+")";//根据类模型绘制圆形雪花;
         context.arc(this.position.x,this.position.y,this.r,0,Math.PI*2);//填充雪花的颜色;
         context.fill();
     }	
 }

 for(var i=0;i<200;i++){
     var snow=new Snowflake();//实例化1000个雪花对象;
     snowArray.push(snow);//将雪花对象添加到数组中;
 }
 // var length=snowArray.length;

 /**
  * 定义动画效果;
  * @return {[type]} [description]
  */
 function cartoon(){
     context.clearRect(0,0,width,height);//动画完成一次进行清屏操作;
     for(var j=0;j<snowArray.length;j++){
         snowArray[j].draw();//将实例化好的每个雪花对象在画布上画出来;
     }
     requestAnimationFrame(cartoon);//递归调用动画效果;
 }


