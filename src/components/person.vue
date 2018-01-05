<template>
  <div class="person">
    <nav id="nav" @click="sectionChoose">
      <a v-for="item in navBar" class="icon" :class="item.class+ ' ' +item.active" :href="item.id">
        <span>{{item.name}}</span>
      </a>

    </nav>

    <div class="content">
      <section id="briefInfo" v-bind:class="navBar[0].active">
        <div>
          <h1>{{resource.detail.name}}
            <span class="icon favor" @click="addFavor"></span></h1>

          <ul>
            <li v-for="item in resource.detail.briefInfo">
              <strong>{{item[0]}}  :</strong>
            <p>{{item[1]}}</p></li>

          </ul>
        </div>
        <div class="imgContainer">
          <img @load="isLoading" :src="resource.detail.src"/>
        </div>

      </section>
      <section id="biography" v-bind:class="navBar[1].active" >

        <h1>Biography</h1>
        <div class="imgContainer">
          <img :src="resource.images[0]"/>
        </div>
        <p>{{resource.detail.biography}}</p>


      </section>
      <section id="images" v-bind:class="navBar[2].active" >
        <h1>Portfolio</h1>
        <p>You're looking at the portfolio of <b>{{resource.detail.name}}</b>.
          <span class="action">Hover</span> over the button to check all of  pictures of the album.
        </p>
        <album v-bind:imgs="resource.images"></album>
      </section>
      <section id="acting" v-bind:class="navBar[3].active">
        <h1>Actings</h1>
        <waterfall ref="acting" v-bind:water="resource.acting" v-bind:getUrl="getActingUrl"></waterfall>
      </section>
    </div>


  </div>
</template>

<script>
  import ajax from '../common/js/tmdb';
  import slider from './slider.vue';
  import images from './images.vue';
  import album from './album';
  import waterfall from './waterfall';
  export default {
    data(){
      return{
        loading:true,
        navBar:[
          {id:"#briefInfo",name:"About",class:"fa-home",active:"active"},
          {id:"#biography",name:"Biography",class:"fa-user",active:""},
          {id:"#images",name:"Portfolio",class:"fa-folder",active:""},
          {id:"#acting",name:"Acting",class:"fa-video-camera",active:""}
        ],
        sectionActive:[],
       /**
        *  resource:{
          acting:[],
          detail:{},
          tagged:[],
          images:["","","","","","","","",""],

        },
        **/
      }
    },

    components:{
      slider,images,album,waterfall
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': 'fetchData'
    },
    props:["fetchData","resource","addFavor"],
    mounted(){
      this.fetchData();
    },
    methods:{
      getUrl(type,id){

        window.localStorage.setItem("search",type+"&"+id);
        let location={path:'/'+"layout/"+type+"/"+id};
        this.$router.push(location);
      },
      getActingUrl(event){

        let target=event.target;
        let nodeName=target.nodeName.toLowerCase();
        if (nodeName==="h3" || nodeName==="img"){
          target=target.parentNode;
        }
        let info=target.getAttribute("data-search").split("&");
        let type=info[0];
        let id=info[1];
        let location={path:'/'+"layout/"+type+"/"+id};
        this.$router.push(location);
      },
      sectionChoose(event){
        let target=event.target;
        let oldIndex=this.navBar.findIndex((n)=> n.active==="active");
        if (target.nodeName.toLowerCase()==="a"){
          let lists=Array.from(target.parentNode.childNodes);
          let index=lists.findIndex((n)=>n===target);

          this.navBar[index].active="active";
          this.navBar[oldIndex].active="";
          if (index===3){
            this.$nextTick(function () {
              this.$refs.acting.waterFall();
            })
          }
        }
      },
      isLoading(){
        this.$emit("loadMsg",false)
      },


    }
  }
</script>

<style lang="css">
  @import '../common/css/main.css';
  @import '../common/css/person.css';

</style>
