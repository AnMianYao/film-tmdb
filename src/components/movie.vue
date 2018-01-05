<template>
  <div class="movie" v-bind:class="rightBarVisible">
    <section id="rightBar">
      <div class="top">
        <img  :src="resource.brief.bgSrc"/>
        <h1>{{resource.brief.title}}
          <span class="icon favor" @click="addFavor"></span>

        </h1>
      </div>
      <nav class="nav">
        <ul>
          <li v-for="item in navBar"><a :href="item.id" :class="item.active">{{item.name}}</a></li>
        </ul>
      </nav>
    </section>
    <div class="content">

      <section id="brief">
        <img @load="isLoading" :src="resource.brief.bgSrc"/>
        <div class="sectionContainer">
          <h3>brief Information</h3>
          <p>The movie—<i>{{resource.brief.title}}</i> release at
            <strong>{{resource.brief.time}}</strong>.
            It had scored the <b>{{resource.brief.score}}</b> in <strong>TMDB.</strong>
          </p>
          <collapses :items="resource.brief"></collapses>
        </div>
      </section>

      <section id="credits">
        <div class="sectionContainer">
          <h3>credits</h3>
          <p>Hi. You're looking at credits of
            <span class="title">{{resource.brief.title}}</span>.
            The <span class="blue">blue one</span> is real name and
            <span class="black">black one</span> was his(or she) character</p>
          <carousel :items="resource.credits" :getUrl="getPerson"></carousel>
        </div>

      </section>

      <section id="images">
        <div class="sectionContainer">
          <h3>images</h3>
          <p>Here are the posters or backdrops of the movie—
            <i>{{resource.brief.title}}</i>.You can
            <span class="action">slide</span> the mouse or
            <span class="action">click</span> the button to view the images</p>
          <images v-bind:posters="resource.images.posters" v-bind:backdrops="resource.images.backdrops"></images>
        </div>
      </section>

      <section id="reviews" v-bind:class="resource.reviews.length>0?'':'hide'">
        <div class="sectionContainer">
          <h3>reviews</h3>
          <p>There are reviews of <b>{{resource.brief.title}}</b>.You can
            <span class="action">Click</span> on the button to see the review which was hidden.
          </p>
          <ul @click="readMore" >
            <li v-for="(item,index) in resource.reviews">
              <h4>{{item.author}}</h4>
              <span class="more" v-show="item.content.length>500" :data-index="index">read more</span>
              <p>{{item.content.slice(0,500)}}</p>

            </li>
          </ul>
        </div>
      </section>

      <section id="videos" v-bind:class="resource.videos.length>0?'':'hide'">
        <div class="sectionContainer">
          <h3>videos</h3>

          <v v-bind:videos="resource.videos"></v>
        </div>
      </section>

      <section id="recommendations" v-bind:class="resource.recommendations.length>0?'':'hide'">
        <div class="sectionContainer">
          <h3>recommendations</h3>

          <slider v-bind:items="resource.recommendations" :getUrl="getOtherUrl"></slider>
        </div>
      </section>
    </div>


    <div id="titleBar" @click="showRightBar"><i class="material-icons toggle menu">menu</i></div>
  </div>
</template>

<script>
  import ajax from '../common/js/tmdb';
  import  base from  '../common/js/base';
  import collapses from './collapses.vue';
  import carousel from './carousel.vue';
  import slider from './slider.vue';
  import images from './images.vue';
  import v from './video.vue';
  export default {
    data(){
      return{
        loading:true,
        rightBarVisible:"",
        navBars:this.navBar
      }
    },
    components:{
      slider,images,collapses,carousel,v
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': 'fetchData'
    },
    props:["fetchData","resource","navBar","section","addFavor"],
    mounted(){
      this.fetchData();
      this.windowScroll();
    },
    methods:{
      showRightBar(){

        if (this.rightBarVisible===""){
          this.rightBarVisible="rightBar-visible";
        }else {
          this.rightBarVisible=""
        }
      },

      getOtherUrl(event){

        let target=event.target;
        let info=target.getAttribute("data-search").split("&");
        let type=info[0];
        let id=info[1];

        window.localStorage.setItem("search",type+"&"+id);
        let location={path:'/'+"layout/"+type+"/"+id};
        this.$router.push(location);
      },
      getUrl(type,id){

        window.localStorage.setItem("search",type+"&"+id);
        let location={path:'/'+"layout/"+type+"/"+id};
        this.$router.push(location);
      },
      getPerson(event){
        let target=event.target;
        if (target.nodeName.toLowerCase()!=="span"){
          target=target.parentNode;
        }
        let info=target.getAttribute("data-search").split("&");
        let type=info[0];
        let id=info[1];
        this.getUrl(type,id)

      },
      isLoading(){
        this.$emit("loadMsg",false);
      },
      windowScroll(){
        let self=this;
        window.onscroll=function () {
          let scrollTop=document.body.scrollTop;

          let index;
          if (scrollTop<self.section[1]){
            index=0;
          }else if (scrollTop>self.section[1] && scrollTop<0.75*self.section[2] ){
            index=1
          }else  if (scrollTop>0.75*self.section[2] && scrollTop<0.75*self.section[3]){
            index=2;
          }else  if (scrollTop>0.75*self.section[3]&& scrollTop<0.75*self.section[4]){
            index=3;
          }else  if (scrollTop>0.75*self.section[4]&& scrollTop<0.75*self.section[5]){
            index=4;
          }else  if (scrollTop>0.75*self.section[5]){
            index=5;
          }
          self.navBars.forEach((t)=>t.active="");
          self.navBars[index].active="active";
        };
      },
      readMore(event){
        let target=event.target;
        if (target.nodeName.toLowerCase()==="span" && target.classList.contains("more")){
          target.style.display="none";
          let index=parseInt(target.getAttribute("data-index"));
          target.nextElementSibling.innerHTML=this.resource.reviews[index].content;
        }
      }
    }
  }
</script>

<style lang="css">
  @import '../common/css/main.css';
  @import '../common/css/movie.css';

</style>
