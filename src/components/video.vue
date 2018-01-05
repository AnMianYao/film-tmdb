<template>
  <div class="videoBox" >
    <div class="show">
      <div class="video-container">
        <iframe frameborder="0" allowfullscreen="allowfullscreen" v-bind:src="showVideo"></iframe>
      </div>
    </div>
    <div class="list" @click="videoChoose">
      <div class="video-container" v-for="video in videos" v-bind:class="video.show?'selected':''">
        <div class="cover"></div>
        <iframe frameborder="0" allowfullscreen="allowfullscreen" v-bind:src="video.src"></iframe>
      </div>
    </div>
  </div>
</template>

<script>
  import base from '../common/js/base'
  export default {
    data(){
      return{}
    },
    computed: {

      showVideo(){
        let index=this.videos.findIndex((n)=> n.show===true);
        if (index===-1){

          return this.videos[0].src
        }
        return this.videos[index].src+"&autoplay=1";
      }


    },
    props:['videos'],
    methods:{
      videoChoose(event){
        event.preventDefault();
       // let videoDiv=$(event.target).parents(".video-container")[0];
        let videoDiv=base.getParentByClass(event.target,"video-container");
        let listVideos=videoDiv.parentElement.childNodes;
        listVideos=Array.from(listVideos);
        let index=listVideos.findIndex((n)=>n===videoDiv);

        let oldIndex=this.videos.findIndex((n)=> n.show===true);
        if (oldIndex===-1){

          this.videos[index].show=true;
          return;
        }
        this.videos[oldIndex].show=false;
        this.videos[index].show=true;
        console.log([oldIndex,index]);
      },
    }
  }
</script>

<style lang="css">
   #videos .videoBox{
    padding: 1.75em;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    background-color: #000000;
  }

   #videos .videoBox>.show{
     width: 80%;
     flex-shrink: 0;

  }
   #videos .videoBox>.list{
     width: 17%;
  }
   #videos .videoBox  .video-container{
     position: relative;
     box-sizing: border-box;
     width: 100%;
     height: 0;
     padding-bottom: 56.25%;
     margin-top: 1em;
  }
   #videos .videoBox  .video-container:first-child{
     margin-top: 0em;
   }
   #videos .videoBox  .video-container iframe{
     position: absolute;
     left: 0;
     top: 0;
     display: block;
     width: 100%;
     height: 100%;
   }

  .videoBox>.list .video-container.selected iframe{

    border: 2px solid #66acb6;
    border-radius: 2px;
  }
  .videoBox>.list .video-container .cover{
    position: absolute;
    z-index: 99;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
  }

</style>
