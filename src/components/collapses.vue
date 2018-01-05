<template>
  <ul class="collapsible" @click="unfold">
    <li v-for="(key,index) in itemDisplay" :class="actives[index]">
      <div class="collapsible-header">
        <span>{{key}}</span>
        <i class="material-icons">more_horiz</i>
      </div>
      <div class="collapsible-body">
        <span>{{items[key]}}</span>
      </div>
    </li>
  </ul>
</template>

<script>
  import base from '../common/js/base'
  export default {
    data(){
      return{
        itemDisplay:["overview","category","company"],
        actives:["","",""],
        collapses:this.items
      }
    },
    props:["items"],
    methods:{
      unfold:function (event) {
        let target=event.target;
        target=base.getParent(target,"li");
        let ul=Array.from(target.parentNode.childNodes);
        let index=ul.findIndex((n)=> n===target);
        let self=this;

        let arrary=[];
        for (let i=0;i<this.actives.length;i++){
          if (i===index){
            if (self.actives[i]===""){
              arrary.push("active");
            }else {
              arrary.push("");
            }
          }else {
            arrary.push("");
          }
        }
        this.actives=arrary;


      }
    }
  }
</script>

<style>
  .collapsible{
    margin: 0.5rem 0 1rem 0;
    list-style: none;
    border: none;
    box-shadow:none;
    -webkit-box-shadow:none;
  }
  .collapsible span{
    text-align: justify;
  }
  .collapsible >li{
    -webkit-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
    -webkit-transition: margin 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    transition: margin 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  .collapsible >li.active{
    -webkit-box-shadow: 0 5px 11px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15);
    box-shadow: 0 5px 11px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15);
    transform: scale(1.1);
    transition: all .5s ease;
    margin: 16px 0;
  }
  .collapsible >li div.collapsible-header{
    background-color: transparent;
    text-transform: capitalize;
    font-size: 1.2em;
    line-height: 1.5;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    padding: 1rem;
  }
  .collapsible >li div.collapsible-body {
    display: none;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 2rem;
  }
  .collapsible >li.active div.collapsible-body{
    display: block;
    transition: display 1s ease;
  }
</style>
