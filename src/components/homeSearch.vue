<template>
  <div class="container">

    <div class="col s12 m9 l8 selection">
      <p v-for="item in searchType" v-bind:class="item.selected?'selected':''">{{item.type}}</p>
    </div>

    <nav class="col s12 m9 l8">
      <div class="nav-wrapper ">
        <form class="col s12 m9 l8 search">
          <div class="input-field  ">
            <input id="search" type="search" required class="card-panel">
            <label class="label-icon" for="search"><i class="material-icons search">search</i></label>
            <i class="material-icons" >close</i>
          </div>

          <ul class="hints collection hide">
          </ul>
        </form>
      </div>
    </nav>
  </div>
</template>

<script>
  import  top from './header.vue';

  export default {
  }
</script>


<style lang="css">
  @import '../common/css/home.css';

</style>
