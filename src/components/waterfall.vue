<template>
    <div class="waterfall" ref="waterfall" @click="getUrl">
      <div class="col"></div>
      <div class="col"></div>
      <div class="col"></div>


      <div class="items">
        <div class="box"  v-for="item in water" :data-search="item.type+'&'+item.id">
          <img :src="item.src"/>
          <h3>{{item.title}}</h3>
        </div>
      </div>


    </div>
</template>

<script>

  export default {
      data(){
          return{
            items:this.water,
            cols:[0,0,0]
          }
      },
      props:["water","getUrl"],
      methods:{
        createBox(item,col){
          let div=document.createElement("div");
          div.setAttribute("data-search",item.type+'&'+item.id);
          div.setAttribute("class","box");
          let img=document.createElement("img");
          img.setAttribute("src",item.src);
          img.style.display="block";
          img.style.width="100%";
          let h3=document.createElement("h3");
          h3.innerHTML=item.title;
          div.appendChild(img);

          div.appendChild(h3);
          col.appendChild(div);

          col=null;
        },
        waterFall(){
            let self=this;
            let parent=this.$refs.waterfall;
            let item=parent.lastElementChild;

            if (item.classList.contains('col')){
              return false;
            }
            let boxes=item.children;

            if(boxes.length===0){
              return false
            }
            boxes=Array.from(boxes);

            boxes.forEach(function (item) {
              let col=self.getMinCol(parent);
              col.appendChild(item);
            });
            parent.removeChild(item);
            parent=boxes=null
          },

        getMinCol(parent){
          let cols=parent.querySelectorAll(".col");

            let min=cols[0];
            for (let i=0,lens=this.cols.length;i<lens;i++){
              let col=cols[i];
              let height=col.offsetHeight;

              if (min.clientHeight>height){
                min=col;
              }
            }
            parent=null;
            return min;
        }
      }
    }
</script>

<style scoped>

  .waterfall .col{
    display: block;
    width: 30%;
    margin-left: 5%;
    float: left;
  }

  .waterfall .col:first-child{
    margin-left: 0%;
  }
  .waterfall:after{
    content:".";
    height:0;
    visibility:hidden;
    display:block;
    clear:both;
  }
  .waterfall .col .box{
    width: 100%;

  }
  .waterfall .box img{
    display: block;
    width: 100%;
  }
  .waterfall .box img:not([src]){
    height: 50%;
    background-color: rgba(74, 202, 168,0.6);
    border: none;
  }
  .waterfall .box h3{
    background: #ffffff;
    text-align: center;
    padding: 1em 0 1em 0;
    font-size: 0.8em;
  }


</style>
