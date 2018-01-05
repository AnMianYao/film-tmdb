<template>
  <div class="myCarousel" @click="move" ref="carousel">


    <div v-for="(item,index) in items"  class="myCarousel-item" :class="init[index]" :key="item.src">
      <img v-bind:src="item.src" >
      <span to="/layout/person" class="character" v-bind:data-search="item.type+'&'+item.id" @click="getUrl">
        <strong>{{item.name}}</strong><br/>{{item.character}}
      </span>
    </div>

  </div>
</template>

<script>
  import  base from '../common/js/base'
  export default {
    data(){
      return{
        list:null
      }
    },
    computed:{
      init(){
        let length=this.items.length;
        let className=[];
        for (let i=0;i<length;i++){
          if (i===0){
            className.push("current");
          }else if (i<4){
            className.push("left"+i);
          }else if (i<length-3){
            className.push("");
          }else if (i<length){
            className.push("right"+(length-i))
          }
        }
        return className;
      }
    },
    props:["items","getUrl"],
    mounted(){
      this.initList();
    },
    updated:function () {

     this.initList()

    },
    methods:{
      move(event) {
        if (event.target.nodeName.toLowerCase()!=="span"){

          let target=base.getParentByClass(event.target,"myCarousel-item");

          let headIndex=this.list.indexOf(target);
          let head=this.list.getHead();
          let i=0;
          while (i<headIndex){
            head=head.next;
            i++;
          }
          this.animationClass(head);
        }


      },
      animationClass(head) {
        let current=head;
        let currentL=head.next;
        let currentR=head.prev;
        let size=this.list.getSize();
        let index=0;
        while (index<size){
          let classLens=current.element.classList.length;

          if (classLens>1){
            for (let index=1;index<classLens;index++){
              let change=current.element.classList[index] ;
              current.element.classList.remove(change)
            }
          }
          current=current.next;
          index++;
        }
        index=1;
        let  showNum=Math.min(Math.floor((size-1)/2),3)+1;
        while (index<showNum){
          currentL.element.classList.add("left"+index);
          currentL=currentL.next;
          index++
        }
        index=1;
        while (index<showNum){
          currentR.element.classList.add("right"+index);
          currentR=currentR.prev;
          index++
        }

        head.element.classList.add("current");

      },
      initList(){
        let carousel=this.$refs.carousel;

        let carousel_items=carousel.childNodes;


        function DoubleLinkedList(){
          let Node=function (element) {
            this.element=element;
            this.next=null;
            this.prev=null;
          };

          let length=0;
          let head=null;
          let tail=null;


          this.insert=function (position,element) {


            if (position>=0 && position<=length ){
              let node=new Node(element);
              let current=head;
              let prev,index=0;

              if (position===0){
                if (!head){
                  head=node;
                  tail=node;
                  tail.next=head;
                  head.prev=tail;
                }else {
                  node.next=current;
                  current.prev=node;
                  head=node;
                  node.prev=tail;
                }
              } else  if (position===length){
                current=tail;
                current.next=node;
                node.prev=current;
                tail=node;
                tail.next=head;
                head.prev=tail;
              }else {

                while (index++ <position){
                  prev=current;
                  current=current.next;
                }
                node.next=current;
                node.prev=prev;

                prev.next=node;
                current.prev=node;
              }
              length++;
              return true;
            }else {
              return false;
            }
          };

          this.removeAt=function (postion) {
            if (postion>-1 && postion<length){
              let current=head;
              let prev,index=0;

              if (postion===0){
                head=current.next;

                current.next.prev=tail;
                head=current.next;
              }else if (postion===length-1){
                current=tail;

                current.prev.next=head;
                head.prev=current.prev;
                tail=current.prev;
              }else {
                while (index++ <postion){
                  prev=current;
                  current=current.next;
                }
                prev.next=current.next;
                current.next.prev=prev;
              }
              length--;
              return true;
            }else {
              return false;
            }
          };

          this.indexOf=function (element) {
            let current=head,index=0;

            while (current){
              if (element===current.element){
                return index;
              }
              index++;
              current=current.next;
            }
          };

          this.remove=function (element) {
            let index=this.indexOf(element);
            return this.removeAt(index);
          };

          this.getHead=function () {
            return head;
          };

          this.getSize=function () {
            return length;
          };
          return this;
        }
        let list=new DoubleLinkedList();
        carousel_items.forEach(function (t, number) {
          list.insert(number,t);
        });


        this.list=list;
      }


    }

  }
</script>

<style>
  .myCarousel .myCarousel-item{
    width: 200px;
    height: 300px;
    position: absolute;
    visibility: hidden;
    left: 50%;
    top: 100px;
    margin-left: -100px;
    transition: transform 1s ease;
    z-index: -5;
  }
  .myCarousel .myCarousel-item img{
    width: 100%;
    height: auto;
  }
  .myCarousel .myCarousel-item img:not([src]){
    height: 90%;
    background-color: rgba(74, 202, 168,0.6);
    border: none;
  }
  .myCarousel .myCarousel-item span{
    color: #777777;
    display: block;
    width: 100%;
    text-align: center;
  }
  .myCarousel .myCarousel-item span strong{
    color: rgb(72, 117, 255);
    font-weight: 700;

  }

  .myCarousel{
    overflow: hidden;
    position: relative;
    width: 100%;
    height: 500px;
    -webkit-perspective: 500px;
    perspective: 500px;
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
    -webkit-transform-origin: 50% 50%;
    transform-origin: 50% 50%;


  }


  .myCarousel .myCarousel-item.current{
    z-index: 0;
    opacity: 1;
    display: block;
    transform:    translateZ(0px);
    visibility: visible;
  }
  .myCarousel .myCarousel-item.left1{
    transform: translateX(200px)  translateZ(-200px);
    z-index: -1;
    opacity: 0.6;
    display: block;
    visibility: visible;
  }
  .myCarousel .myCarousel-item.left2{
    transform:   translateX(400px) translateZ(-400px);
    z-index: -2;
    opacity: 0.2;
    display: block;visibility: visible;
  }
  .myCarousel .myCarousel-item.left3{
    transform: translateX(600px) translateZ(-600px);
    z-index: -3;
    opacity: 0.2;
    display: block;visibility: visible;
  }
  .myCarousel .myCarousel-item.right3{
    transform:  translateX(-600px) translateZ(-600px);
    z-index: -3;
    opacity: 0.2;
    display: block;visibility: visible;
  }

  .myCarousel .myCarousel-item.right2{
    transform:   translateX(-400px) translateZ(-400px);
    z-index: -2;
    opacity: 0.2;
    display: block;visibility: visible;
  }
  .myCarousel .myCarousel-item.right1{
    transform:  translateX(-200px) translateZ(-200px);
    z-index: -1;
    opacity: 0.6;
    display: block;visibility: visible;
  }



</style>
