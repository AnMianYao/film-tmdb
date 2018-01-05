<template>
  <div class="wrapper"  >
    <top v-bind:uparrow="upArrow" v-bind:loadMsg="loading" @upArrow="changeUpArrow"></top>

    <keep-alive>
      <router-view v-bind:fetchData="fetchData" v-bind:navBar="movieNavBar" v-bind:section="movieSectionTop"
                   v-bind:addFavor="addFavor" v-bind:resource="ajaxData" v-if="$route.meta.keepAlive" v-bind:loaded="loading"  @loadMsg="isLoading" />
    </keep-alive>
    <router-view v-bind:fetchData="fetchData"  v-bind:navBar="movieNavBar" v-bind:section="movieSectionTop"
                 v-bind:addFavor="addFavor" v-if="!$route.meta.keepAlive" v-bind:loaded="loading"
                 @loadMsg="isLoading" />
  </div>



</template>

<script>
  import top from './header.vue';
  import ajax from '../common/js/tmdb';
  export default {
    components:{
      top
    },
    data(){
      return{
        loading:true,
        upArrow:true,
        ajaxData:{
          acting:[],
          detail:{},
          tagged:[],
          brief:{
            bgSrc:"",
            category:"",
            company:"",
            id:"",
            overview:"",
            poster:"",
            score:"",
            time:"",
            title:"",
            type:"",
          },
          credits:[],
          images:{
            posters:[],
            backdrops:[],
          },
          recommendations:[{}],
          reviews:[],
          videos:[{src:"",show:"",name:""},{src:"",show:"",name:""},{src:"",show:"",name:""},{src:"",show:"",name:""},{src:"",show:"",name:""}]

        },
        movieNavBar:[{id:"#brief",name:"Brief",active:"active"},
          {id:"#credits",name:"Credits",active:""},
          {id:"#images",name:"Image",active:""},
          {id:"#reviews",name:"Reviews",active:""},
          {id:"#videos",name:"Videos",active:""},
          {id:"#recommendations",name:"Recommendations",active:""},
        ],
        movieSectionTop:[0,0,0,0,0,0],
      }
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': 'fetchData'
    },
    mounted(){
      let self=this;
      window.onscroll=function () {
        let scrollTop=document.body.scrollTop;
        self.upArrow=scrollTop>=200;

      };
    },
    methods: {
      changeUpArrow(msg) {

        this.upArrow = msg;
      },
      isLoading(msg) {

        this.loading = msg;
      },
      fetchData() {
        let type = this.$route.name;
        let path=this.$route.path;
        if (path.indexOf("layout")!==-1){
          let id = this.$route.params.id ||this.$route.params.keyword;
          this[type](type, id);
        }

      },
      getSectionOffsetTop(){
        let self=this;
        let div=document.querySelector(".content");
        let sections=div.querySelectorAll('section');
        sections.forEach(function (item,index) {
          self.movieSectionTop[index]=item.offsetTop;
        });
      },
      movie(_type, id) {
        let self = this;
        let type = _type.toString()[0].toUpperCase() + _type.toString().slice(1);
        let funcString = 'get' + type + 'Info';
        let func = ajax[funcString](id);
        let urls = func.url;
        let filters = func.filter;
        let ajaxs = urls.map(n => self.$ajax.get(n));
        this.$ajax.all(ajaxs)
          .then(self.$ajax.spread(function (detailResp, creditsResp, recommendationsResp, reviewsResp, videoResp, imageResp) {
            let data = [detailResp.data, creditsResp.data, recommendationsResp.data, reviewsResp.data, videoResp.data, imageResp.data];
            let keys = ['brief', 'credits', 'recommendations', 'reviews', 'videos', 'images'];
            data.forEach((n, index) => {
              let obj = filters[index](n);
              let key = keys[index];
              self.$set(self.ajaxData, key, obj);
            });

            self.$nextTick(self.getSectionOffsetTop);
            console.log(self.ajaxData)
          }));
      },
      person(_type, id) {
        let self = this;
        let type = _type.toString()[0].toUpperCase() + _type.toString().slice(1);
        let funcString = 'get' + type + 'Info';
        let func = ajax[funcString](id);

        let urls = func.url;
        let filters = func.filter;

        let ajaxs = urls.map(n => self.$ajax.get(n));
        this.$ajax.all(ajaxs)
          .then(self.$ajax.spread(function (detailResp, tageedImageResp, actingResp, imagesResp) {
            let data = [detailResp.data, tageedImageResp.data, actingResp.data, imagesResp.data];
            let keys = ['detail', 'tagged', 'acting', 'images'];
            let info = {};
            data.forEach((n, index) => {
              let obj = filters[index](n);
              let key = keys[index];
              info[key] = obj;
            });

            self.ajaxData = Object.assign({}, self.ajaxData, info);
            console.log(self.ajaxData)
          }));

      },
      tv(_type, id) {
        let self = this;
        let type = _type.toUpperCase();
        let funcString = 'get' + type + 'Info';
        let func = ajax[funcString](id);
        let urls = func.url;
        let filters = func.filter;
        let ajaxs = urls.map(n => self.$ajax.get(n));
        this.$ajax.all(ajaxs)
          .then(self.$ajax.spread(function (detailResp, tageedImageResp, actingResp, imagesResp, videosResp) {
            let data = [detailResp.data, tageedImageResp.data, actingResp.data, imagesResp.data, videosResp.data];
            let keys = ['detail', 'credits', 'recommendations', 'images', 'videos'];
            let info = {};
            data.forEach((n, index) => {
              let obj = filters[index](n);
              let key = keys[index];
              info[key] = obj;

            });
            self.ajaxData = Object.assign({}, self.ajaxData, info);
            console.log(self.ajaxData)
          }));
      },
      searchResults(name,keyword){
        let self=this;
        let type=window.localStorage.getItem("searchType");

        let obj=ajax.search(type,keyword);
        let url=obj.url;
        let filter=obj.dataFilter;
        this.$ajax({
          method:'get',
          url:url
        }).then(function (response) {
          let data=filter(response.data);
          console.log(data);
          self.ajaxData=Object.assign({}, self.ajaxData,data);
          self.loading=false;

        });
      },
      getFavor(){
        let self=this;
        return new  Promise(((resolve) => {
          self.$ajax.get('/api/user/favor',{
            params:{
              username:window.localStorage.getItem("user")
            }
          })
            .then(response=>{
              let data=response.data[0].favors;
              resolve(data);
            })
            .catch(err=>{
              console.log(err);
            });
        }));


      },
      postFavor(data){
        let config= {
          headers: {
            'Content-Type': 'application/json'
          }
        };

        this.$ajax.post('/api/user/favor',data,config)
          .then((response) => {
            console.log(response)
          })
          .catch(err=>{
            console.log(err)
          });
      },
      addFavor(){
        let type = this.$route.name;
        let id = this.$route.params.id;
        let item=type+"&"+id;
        let favors=this.getFavor();
        let self=this;
        favors.then((data)=>{
          if (data.length>0){
            data=data+"|";
          }
          if (data.indexOf(item)===-1){
            let favorData=data+item;

            self.postFavor({
              username:window.localStorage.getItem('user'),
              favors:favorData
            });

          }else {
            console.log("kakak")
          }
        })


      }
    }
  }
</script>

<style lang="css">
</style>
