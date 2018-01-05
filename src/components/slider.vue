<template>
  <div class="mySlider" >
    <ul class="mySliders" ref="sliderUl">
      <li v-for="item in items">
        <img :src="item.src" v-bind:data-search="item.type+'&'+item.id" @click="getUrl">
        <div :class="randomClass">
          <h3>{{item.title}}</h3>
        </div>
      </li>
    </ul>

    <ul class="indicators" ref="indicators" @click="choose">
      <li class="indicator-item" v-for="item in items"></li>
    </ul>
  </div>
</template>

<script>
  import base from "../common/js/base"
  export  default {
    data(){
      return{
        sliders:this.items,
        timer:null,
        lists:null,
        isData:null
      }
    },
    props:["items","getUrl"],
    computed:{
      randomClass(){
        let num=Math.random();
        if (0<num && num<0.333){
          return "center-align"
        }
        if (  num>0.333 && num<0.66){
          return "left-align"
        }
        if ( num>0.66 && num<1){
          return "right-align"
        }
      }
    },
    watch:{
      items:"fetchData"
    },
    mounted:function () {

    },
    methods:{
      fetchData(){
        let self=this;
        let DoubleLinkedList=base.DoubleLinkedList;
        let slidersUl=this.$refs.sliderUl.childNodes;
        let indicators=this.$refs.indicators.childNodes;
        this.$nextTick(function () {
          let list=new DoubleLinkedList();

          slidersUl.forEach(function (t, number) {
            let caption=t.lastChild;
            list.insert(number,t,indicators[number],caption);
          });

          this.lists=list;
          this.head=self.lists.getHead();
          this.update();
        })

      },
      update:function () {
        let self=this;
        if (this.timer){
          clearTimeout(self.timer);
        }

        this.head.element.classList.add("active");
        this.head.indicator.classList.add("active");
        this.head.caption.classList.add("active");

        this.timer=setTimeout(function () {
          self.head.element.classList.remove("active");
          self.head.indicator.classList.remove("active");
          self.head.caption.classList.remove("active");

          self.head=self.head.next;
          self.update();
        },5000);

      },
      choose:function (event) {
        let target=event.target;
        if (target.nodeName.toLowerCase()!=="li"){
          console.log('click blank space');
          return false;
        }
        let self=this;
        if (this.timer){
          clearTimeout(self.timer);
        }
        this.head.element.classList.remove("active");
        this.head.indicator.classList.remove("active");
        this.head.caption.classList.remove("active");

        this.head=this.lists.getNode(target,"indicator");
        this.update();


      },
    }
  }
</script>

<style>
  .mySlider ul {
    padding: 0;
    margin: 0;
    list-style: none;
  }
  .mySlider{
    position: relative;
    width: 100%;
  }
  .mySlider .mySliders{
    background-color: #9e9e9e;
    margin: 0;
    height: 400px;
  }
  .mySlider .mySliders li{
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: inherit;
    overflow: hidden;
  }
  .mySlider .mySliders li.active{
    display: block;
    opacity: 1;
    transform: translateX(0px) translateY(0px);
  }
  .mySlider .mySliders >li >img{
    height: 100%;
    width: 100%;
    background-size: cover;
    background-position: center;
  }

  .mySlider .mySliders >li >div.center-align{

    left:15%;
    top:-15%;
    transition: top 1s ease,left 1s ease;
    opacity: 0;

  }
  .mySlider .mySliders >li >div.left-align{

    left:50%;
    top: 15%;
    transition: top 1s ease,left 1s ease;
  }
  .mySlider .mySliders >li >div.right-align{

    left:-50%;
    top:15%;
    transition: top 1s ease,left 1s ease;
    opacity: 0;

  }
  .mySlider .mySliders >li.active >div.active{
    color: #fff;
    width:70%;
    position: absolute;
    background-color: rgba(141, 141, 141, 0.3);
    opacity: 1;
    left:15%;
    top:15% ;
    transition: top 1s ease,left 1s ease;
  }

  .mySlider .mySliders >li >div h3{
    color: inherit;
    font-size: 1.75em;
    line-height: 1.5em;
    margin: 0.65em;
    text-transform: capitalize;
  }
  .mySlider .mySliders >li >div.center-align >h3{
    text-align: center;
  }
  .mySlider .mySliders >li >div.left-align >h3{
    text-align: left;
  }
  .mySlider .mySliders >li >div.right-align >h3{
    text-align: right;
  }

  .mySlider .indicators{
    margin: 1em auto;
    display: flex;
    justify-content: space-around;
  }
  .mySlider .indicators .indicator-item {
    display: inline-block;
    position: relative;
    cursor: pointer;
    height: 16px;
    width: 16px;
    margin: 0 12px;
    background-color: #e0e0e0;
    -webkit-transition: background-color .3s;
    transition: background-color .3s;
    border-radius: 50%;
  }
  .mySlider .indicators .indicator-item.active{
    background-color: #4CAF50;
  }
</style>
