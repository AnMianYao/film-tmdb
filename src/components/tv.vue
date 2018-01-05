<template>
  <div id="wrapper">
    <div id="tvHeader">
      <img  class="bg" :src="resource.detail.bgSrc" @load="isLoading"/>
      <div class="inner">
       <div class="imgContainer"><img :src="resource.detail.posterSrc"  alt="" /></div>
        <h2>{{resource.detail.title}}</h2>
        <ul>
          <li @click="addFavor"><i class="fa fa-heart "></i>{{resource.detail.popularity}}</li>
          <li><i class="fa fa-magic "></i> {{resource.detail.score}} </li>
        </ul>
      </div>
    </div>

    <div id="main">
      <section id="detail">
        <h1>the overview of <strong>{{resource.detail.title}}</strong></h1>
        <p>{{resource.detail.overview}}</p>
      </section>

      <section id="credits">
        <h2>credits of the {{resource.detail.title}}</h2>
        <ul>
          <li v-for="item in resource.credits" :class="item.show?'':'hide'" :data-search="item.type+'&'+item.id" @click="getPersonUrl">
            <div class="imgContainer">
              <img :src="item.src">
            </div>
            <p>{{item.name}}<br/>
              {{item.character}}</p>
          </li>
        </ul>

       <a class="button" :class="resource.credits.length>6?'':'hide'" @click="showMoreCredits">read more</a>
      </section>

      <section id="season">
        <h2>the seasons of {{resource.detail.title}}</h2>
        <ul>
          <li v-for="item in resource.detail.seasons" class="carousel-item" :data-search="'tv'&item.id">
            <div class="imgContainer">
              <img :src="item.src">
              <p>season{{item.season_number}}<br/>
                {{item.time}}
              </p>
            </div>

          </li>

        </ul>

      </section>

      <section id="imgs">
        <h2>the images of {{resource.detail.title}}</h2>
        <images v-bind:posters="resource.images.posters" v-bind:backdrops=" resource.images.backdrops"></images>
      </section>

      <section id="videos">
        <h2>the videos of {{resource.detail.title}}</h2>
        <v v-bind:videos="resource.videos"></v>
      </section>

      <section id="recommendations">
        <h2>the recommendations of {{resource.detail.title}}</h2>
        <slider :items="resource.recommendations" :getUrl="getTVUrl"></slider>
      </section>
    </div>
  </div>
</template>

<script>
  import ajax from '../common/js/tmdb';
  import base from '../common/js/base';
  import images from './images.vue';
  import v from './video.vue';
  import slider from './slider.vue';

  export default {
    data(){
      return{
        loading:true
      }
    },
    computed: {
      randomClass(){
        let num=Math.random();
        if (0<num && num<0.333){
          return "caption center-align"
        }
        if (  num>0.333 && num<0.66){
          return "caption left-align"
        }
        if ( num>0.66 && num<1){
          return "caption right-align"
        }
      }

    },
    components:{
      images,v,slider
    },
    mounted(){
      this.fetchData();
    },
    props:["fetchData","resource","addFavor"],
    methods:{
      getUrl(type,id){
        window.localStorage.setItem("search",type+"&"+id);
        let location={path:'/'+"layout/"+type+"/"+id};
        this.$router.push(location);
        window.location.reload()
      },
      showMoreCredits(event){
        this.resource.credits.forEach((n)=>n.show=true);
        event.target.style.display="none";
      },
      getPersonUrl(event){
        let target=base.getParent(event.target,"li");
        let info=target.getAttribute("data-search").split("&");
        let type=info[0];
        let id=info[1];

        this.getUrl(type,id)
      },
      getTVUrl(event){
        let target=event.target;
        let info=target.getAttribute("data-search").split("&");
        let type=info[0];
        let id=info[1];
        this.getUrl(type,id);
      },
      isLoading(){
        this.$emit("loadMsg",false)
      }
    }
  }
</script>

<style lang="css">
  @import '../common/css/main.css';
  @import '../common/css/tv.css';

</style>
