<template>
 <div @click="magnify">
   <div id="cover" ref="cover"></div>
   <div class="gallery backdrops" v-show="backdrops.length>0" @mousewheel="rolling">
     <div class="icon Left" @click="moveLeft('backdrops')"><i class="material-icons medium valign-wrapper">chevron_left</i> </div>
     <div class="icon Right" @click="moveRight('backdrops')"><i class="material-icons medium">chevron_right</i> </div>
     <div class="overflowX">
       <img  v-for="img in backdrops" class="materialboxed"  v-bind:src="img" >
     </div>
   </div>

   <div class="gallery posters" v-show="posters.length>0" @mousewheel="rolling">
     <div class="icon Left" @click="moveLeft('posters')"><i class="material-icons ">chevron_left</i> </div>
     <div class="icon Right" @click="moveRight('posters')" ><i class="material-icons">chevron_right</i> </div>
     <div class="overflowX">
       <img  v-for="img in posters" class="materialboxed"  v-bind:src="img" >
     </div>
   </div>
 </div>
</template>

<script>
  import base from '../common/js/base';
  export default {
    data(){
      return{}
    },
    props:['posters',"backdrops"],
    methods:{
      moveLeft(name){

        let cssName="section .gallery."+name+" >.overflowX";
        let overflowX=document.querySelector(cssName);
        if (!overflowX.childNodes){
          return false;
        }

        let children=Array.from(overflowX.childNodes);
        let step=overflowX.clientWidth;

        let totalWidth=0;
        children.forEach((n)=>totalWidth+=n.clientWidth);
        if (totalWidth<overflowX.clientWidth){
          return false;
        }
        const limit=totalWidth-step;
        let oldLeft=overflowX.offsetLeft;

        let left;
        if( oldLeft-step<-limit){
          left=-limit;
        }else {
          left =oldLeft-step
        }


        base.scrollLeftAnimate(overflowX,left,(left-oldLeft)/20)


      },
      moveRight(name){
        let cssName="section .gallery."+name+">.overflowX";
        let overflowX=document.querySelector(cssName);

        //let oldLeft=$(overflowX).position().left;
        let oldLeft=overflowX.offsetLeft;

        let step=overflowX.clientWidth/2;
        let left;
        if( oldLeft+step>=0){
          left=0;
        }else {
          left =oldLeft+step;
        }

        console.log([oldLeft,left,(left-oldLeft)/20])
        base.scrollLeftAnimate(overflowX,left,(left-oldLeft)/20)
      },
      rolling(event){
        event.preventDefault();
        if (!base.getParent(event.target,"section")){
          return;
        }
        let dir=event.wheelDelta;
        let overflowX=base.getParentByClass(event.target,"overflowX");
        if (!overflowX){
          return ;
        }
        let children=Array.from(overflowX.childNodes);

        let step=overflowX.clientWidth/2;
        let totalWidth=0;
        children.forEach((n)=>totalWidth+=n.clientWidth);

        if (totalWidth<overflowX.clientWidth){
          return false;
        }
        let left;
        let oldLeft=overflowX.offsetLeft;
        const limit=totalWidth-step*2;
        if (dir<0){

          left=oldLeft-step<-limit?-limit:oldLeft-step;
        }else if(dir>0){
          left=oldLeft+step>=0?0:oldLeft+step;
        }
        console.log(limit)
        base.scrollLeftAnimate(overflowX,left,(left-oldLeft)/20);

      },
      recovery(cover){
        cover.classList.remove("show");
        window.onmousewheel = document.onmousewheel=null;
        cover.innerHTML="";
      },
      magnify(event){
        let target=event.target;
        let cover=this.$refs.cover;
        if (target.nodeName.toLowerCase()!=="img"){
          this.recovery(cover);
        }else{
          if (target.parentNode===cover){
            this.recovery(cover);
          }else {
            cover.style.top=document.body.scrollTop+"px";
            cover.classList.add("show");
            let img=target.cloneNode();

            if (target.clientWidth>target.clientHeight){
              img.style.width="90%";
              img.style.height="auto";
            }else {
              img.style.height="90%";
              img.style.width="auto";
            }
            cover.appendChild(img);
            window.onmousewheel = document.onmousewheel=function (e) {
              e.preventDefault();
            };
          }


        }
      }

    }
  }
</script>

<style lang="css">

  div.gallery{
    position: relative;
    overflow-x: hidden;
  }

  div.gallery >.overflowX{
    margin-top: 40px;
    left: 0px;
    display: flex;
    flex-wrap: nowrap;
    position: relative;

  }
  .gallery>.overflowX .materialboxed{
    flex-shrink: 0;
    box-sizing: border-box;
  }

  .posters>.overflowX .materialboxed{
    width: 200px;
    height: 300px;
  }

  .backdrops>.overflowX .materialboxed{
    width: 300px;
    height: 200px;
  }
  .gallery >div.icon{
    z-index: 99;
    position: absolute;
    width: 100px;
    height: 100px;
    top: 50%;
    margin-top: -50px;
    display: flex;
    justify-content: space-between;
    background-color: rgba(255,255,255,0.5);
    border-radius: 50%;
  }
  .gallery >div.icon:hover{
    background-color: rgba(38, 166, 154, 0.5);
  }
  .gallery > div.icon >i{
    color: #fff;
    display: block;
    height: 58px;
    top: 21px;
    position: relative;
    font-size: 3.5em;
  }
  .gallery > div.Left{
    left: -55px;
    flex-direction: row-reverse;
  }
  .gallery > div.Right{
    right:  -55px;
  }
  div#cover{
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(27,34,38,1);
    z-index: 10000;
    display: none;
  }
  div#cover.show>img{
    display: block;

  }
  div#cover.show{
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

</style>
