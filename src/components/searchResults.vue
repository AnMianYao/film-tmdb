<template>
  <div class="main">
    <div class="results">
      <ul @click='getURL'>
        <li v-for="item in resource.results" class="item" :data-search="item.type+'&'+item.id">
          <div class="imgContainer"><img :src="item.src"></div>
          <div>
            <header>
              <h3>{{item.title}}<strong>{{item.score}}</strong></h3>
              <span class="type">{{item.type}}</span>
            </header>
            <p>{{item.overview}}</p>

          </div>

        </li>

      </ul>
    </div>
  </div>
</template>

<script>
  import ajax from '../common/js/tmdb';
  import base from  '../common/js/base'

  export default {
    data () {
      return {
        popular:{
          popularPerson:{
            selected:true,
            content:[]
          },
          popularMovie:{
            selected:false,
            content:[]
          },
          popularTV:{
            selected:false,
            content:[]
          }
        },
        keyword:"",
        loading:false,
        upArrow:false
      }
    },
    mounted(){
      this.fetchData();
    },
    props:["fetchData","resource"],
    methods:{
      getURL(event){
       let target=event.target;
       let name=target.nodeName.toLowerCase();
       if (name!=="li"){
         target=base.getParent(target,"li");
       }
       let info=target.getAttribute("data-search").split("&");
       let type=info[0];
       let id=info[1];
       let location={path:'/'+"layout/"+type+'/'+id};
       this.$router.push(location);
      },


    }
  }
</script>

<style lang="css">
  @import '../common/css/searchResult.css';
  @import '../common/css/main.css';

</style>
