<template>
  <div class="wrapper" @click="hintsHide">
    <top v-bind:loadMsg="loading" v-bind:uparrow="upArrow"></top>
    <div class="container">

      <div class="selection" @click="typeToChoose">
        <p v-for="item in searchType" v-bind:class="item.selected?'selected':''">{{item.name}}</p>
      </div>

      <nav>
        <div class="nav-wrapper ">
          <form class="search" @keyup="search" @keydown.enter="jump">
            <div class="input-field">
              <input id="search" type="search" required v-focus v-model.trim="keyword" autocomplete="off">
              <label class="label-icon" for="search"><i class="material-icons search">search</i></label>
            </div>

            <ul class="hints collection" v-bind:class="hintsDisplay?'':'hide'" @mouseover="mouseoverHints" @click="jump">

              <li v-for="item in resource" class="collection-item" v-bind:class="item.selected ?'selected':''"  v-bind:data-search="item.id+'&'+item.type">
                <img v-bind:src="item.src" class="circle"/>
                <span class="title">{{item.title}}</span>
                <p class="time">{{item.time}}</p>
                <a class="secondary-content type">{{item.type}}</a>
              </li>

            </ul>
          </form>
        </div>
      </nav>
    </div>
  </div>



</template>


<script>
  import  top from './header.vue';
  import  login from './login.vue';
  import ajax from '../common/js/tmdb';
  import base from '../common/js/base';
  export default {
    data () {
      return {
        searchType:[
          {type:"multi",
            name:"Multi",
            selected:true
          },
          {type:"movie",
            name:"Movie",
            selected:false
          },
          {type:"person",
            name:"Person",
            selected:false
          },
          {type:"tv",
            name:"TV shows",
            selected:false
          }
        ],
        resource:[],
        keyword:"",
        loading:false,
        upArrow:false,
        hintsDisplay:false,
        timer:null
      }
    },
    components:{
      top
    },
    methods:{

      hintsShow() {
        let searchType=this.searchType.filter(function (item) {
          return (item.selected===true);
        });
        let language =this.getLanguage();
       searchType=searchType[0].type;
       let keyword=this.keyword;
       let self=this;
       if (keyword){
         let obj=ajax.search(searchType,keyword,language);
         let url=obj.url;
         let filter=obj.dataFilter;
         this.$ajax({
           method:'get',
           url:url
         }).then(function (response) {
           let data=filter(response.data);
           self.resource=Object.assign([], self.resource,data.results);
           self.hintsDisplay=true;

         });
       }


      },
      upAndDown(event){
        let selectedIndex=this.resource.findIndex((n)=> n.selected===true);
        let hintUl=document.querySelector("ul.hints.collection");
        let hintLis=hintUl.querySelectorAll("li");
        let scrollTop;
        let show;
        let nextIndex;
        if (event.keyCode===40){

          /**
           * down
           */

          if (selectedIndex<0){
            nextIndex=selectedIndex+1;

          }else if (selectedIndex>=this.resource.length-1){
            nextIndex=0;
            this.resource[selectedIndex].selected=false;


          }else{
            nextIndex=selectedIndex+1;
            this.resource[selectedIndex].selected=false;

          }

        }else if (event.keyCode===38){

          /**
           * up
           */

          if (selectedIndex<0){
            nextIndex=this.resource.length-1;

          }else if (selectedIndex===0){
            nextIndex=this.resource.length-1;
            this.resource[selectedIndex].selected=false;


          }else if (selectedIndex<this.resource.length){
            nextIndex=selectedIndex-1;
            this.resource[selectedIndex].selected=false;
          }

        }

        this.resource[nextIndex].selected=true;
        show=this.resource[nextIndex].title;
        this.keyword=show;
        scrollTop=hintLis[nextIndex].offsetTop-350;
        let step=(scrollTop-hintUl.scrollTop)/25;
        base.scrollTopAnimate(hintUl,scrollTop,step);
      },

      jump(){
        let selectedIndex=this.resource.findIndex((n)=> n.selected===true);
        let location;
        if (selectedIndex!==-1){
          let type=this.resource[selectedIndex].type;
          let id=this.resource[selectedIndex].id;
          // window.localStorage.setItem("search",type+"&"+id);
          location={path:'/'+"layout/"+type+'/'+id};
        }else {
          location={path:'/'+"layout/searchResults/"+this.keyword};
          let searchType=this.searchType.filter(function (item) {
            return (item.selected===true);
          });
          window.localStorage.setItem("searchType",searchType[0].type);
        }

        this.$router.push(location);
        window.location.reload();

      },
      search(event) {
        /**
         * show hints container
         */

        if (event.keyCode===40 || event.keyCode===38){
          this.upAndDown(event);

        }else {
          this.hintsShow();
        }
      },
      mouseoverHints(event){
        let target =event.target;
        if (target.nodeName.toUpperCase()==="LI"){
          let oldSelectedIndex=this.resource.findIndex((n)=> n.selected===true);
          let hintUl=document.querySelector("ul.hints.collection");
          let hintLis=hintUl.querySelectorAll("li");
          hintLis=Array.from(hintLis);
          let nextSelectedIndex=hintLis.findIndex((n)=> n===target);
          if (oldSelectedIndex>-1){
            this.resource[oldSelectedIndex].selected=false;
          }
          if (nextSelectedIndex>-1 ){

            this.resource[nextSelectedIndex].selected=true;
            this.keyword=this.resource[nextSelectedIndex].title;
          }
        }



      },
      typeToChoose(event){
        let target =event.target;

        if (target.nodeName.toUpperCase()==="P"){
          let oldIndex=this.searchType.findIndex((n)=>n.selected===true);
          let selectionDiv=document.querySelector("div.selection");
          let selectionP=Array.from(selectionDiv.querySelectorAll("p"));
          let nextIndex=selectionP.findIndex((n)=> n===target);
          this.searchType[oldIndex].selected=false;
          this.searchType[nextIndex].selected=true;

        }
      },
      hintsHide(event){
        let search=document.querySelector("form.search");
        let isChild=base.contains(search,event.target);
        if (!isChild){
          this.hintsDisplay=false;
        }else {
          return;
        }
      },
      getLanguage(){
        /**
         * 根据首个字符判断中英文
         */
        let string=this.keyword.toString()[0];
        if (!string){
          return false;
        }
        if(string.match(/[^x00-xff]/ig) != null){
          this.language="en-US";
        }else {
          this.language="zh-CN";
        }
      }
    },
    directives:{
      focus:{
        inserted(el){
          el.focus();
        }
      }
    }
  }
</script>


<style lang="css">
  @import '../common/css/main.css';
  @import '../common/css/home.css';


</style>
