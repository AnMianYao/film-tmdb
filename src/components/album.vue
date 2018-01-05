<template>
  <div class="album" @mouseover="albumMove" @mouseout="albumOut">
    <div class="imgBox" style="transform: translateX(0px)">
      <div class="imgContainer" v-for="item in imgs">
        <img :src="item"/>
      </div>
    </div>
    <span class="forward" ></span>
    <span class="backward"></span>
  </div>
</template>

<script>
    export default {
        name: "album",
      data(){
          return{
            timer:null
          }
      },
      props:["imgs"],
      methods:{
        albumMove(event){
          let target=event.target;
          let self=this;
          let box=target.parentNode.firstElementChild;
          let moveDirection;
          if (target.nodeName.toLowerCase()==="span"  && !!box && !!target){

            let limit=box.clientWidth-(box.firstElementChild.clientWidth+28)*box.childElementCount+14;
            limit=limit<0?limit:0;

            if (target.classList.contains("forward")){
              /**
               * move left
               * @type {number}
               */
              moveDirection=-1;
            }else {
              /**
               * move right
               * @type {number}
               */
              moveDirection=1;
            }


            this.timer=setInterval(function () {
              let translateX=parseInt(box.style.transform.slice(11,-3));
              translateX+=5*moveDirection;
              if(translateX>0){
                translateX=0;
                clearInterval(this.timer);
              }else if (translateX<limit){
                translateX=limit;
                clearInterval(this.timer);
              }
              box.style.transform="translateX("+translateX+"px)";
            },16);
          }



        },
        albumOut(event){
          let target=event.target;
          if (!!target && target.nodeName.toLowerCase()==="span"){
            clearInterval(this.timer);
          }else {
            return false;
          }

        }
      }
    }
</script>

<style>
   div.album{
    background-color: #f0f4f4;
    padding: 1.5em;
    position: relative;
    overflow-x: hidden;

  }
   .imgBox{
     white-space: nowrap;

  }
  .imgBox>div{
    width: 8em;
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    text-align: center;
    margin: 0 1.5em 0 0;
    white-space: normal;
    opacity: 1.0;
    -moz-transition: opacity 0.75s ease-in-out;
    -webkit-transition: opacity 0.75s ease-in-out;
    -ms-transition: opacity 0.75s ease-in-out;
    transition: opacity 0.75s ease-in-out;
  }
  .album >span{
    display: block;
    z-index: 99;
  }

  .album .forward, .album .backward {
    position: absolute;
    top: 50%;
    width: 6em;
    height: 12em;
    margin-top: -6em;
    cursor: pointer;

  }
  .album span.forward{
    right: 0em;
  }
  .album span.backward{
    left: 0em;
  }
  .album .backward:before {
    left: -3em;
  }
  .album .forward:before {
    right: -3em;
  }
  .album .forward:before, .album .backward:before {
    content: '';
    display: block;
    width: 6em;
    height: 6em;
    border-radius: 100%;
    background-color: rgba(72, 57, 73, 0.5);
    position: absolute;
    top: 50%;
    margin-top: -3em;
    -moz-transition: background-color 0.35s ease-in-out;
    -webkit-transition: background-color 0.35s ease-in-out;
    -o-transition: background-color 0.35s ease-in-out;
    -ms-transition: background-color 0.35s ease-in-out;
    transition: background-color 0.35s ease-in-out;
    -webkit-backface-visibility: hidden;
  }
  .album .forward:hover:before, .album .backward:hover:before{
    background-color: rgba(74,202,168,0.5);
  }
  .album  .forward:after {
    right: -0.25em;
  }
  .album  .backward:after {
    left: -0.25em;
    -moz-transform: scaleX(-1);
    -webkit-transform: scaleX(-1);
    -ms-transform: scaleX(-1);
    transform: scaleX(-1);
  }
  .album  .forward:after, .album  .backward:after {
    content: '';
    width: 3em;
    height: 3em;
    position: absolute;
    top: 50%;
    margin: -1.5em 0 0 0;
    background: url(../common/imgs/arrow.svg) no-repeat center center;
  }
</style>
