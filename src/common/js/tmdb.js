
const gender={
  1:"female",
  2:"man"
};
const sortBy={"Popular descending order":"popularity.asc", "Popular ascending order":"popularity.desc",
  "Release date Descending":"release_date.asc","Release date ascending":"release_date.desc",
  "Title(A-Z)":"original_title.asc","Title(Z-A)":"original_title.desc",
  "Score ascending order":"vote_average.asc","Score descending order":"vote_average.desc"};
let movieDB={};
function getType (arrary) {

  if (!arrary || arrary.length==0 ){
    return [];
  }
  var types=[];

  for (var i=0,len=arrary.length;i<len;i++){
    types.push(movieDB.common.genres[arrary[i]]);
  }
  return types;

}
function getKey (arrary,key) {
  var results =[];
  if (!(arrary && key)){
    return false;
  }
  arrary.forEach(function (t) {
    results.push(t[key]);
  });
  return results;
}

movieDB.common={
  api_key: "dcc18672beb28dd5960858c5c3e3b174",
  base_uri: "https://api.themoviedb.org/3/",
  images_uri: "https://image.tmdb.org/t/p/",
  images:{
    backdrop_sizes: ["w300", "w780", "w1280", "original"],
    poster_sizes: ["w92", "w154", "w185", "w342", "w500", "w780", "original"],
    profile_sizes: ["w45", "w185", "h632", "original"]
  },
  genres: {12: "Adventure", 14: "Fantasy", 16: "Animation", 18: "Drama", 27: "Horror", 28: "Action",
    35: "Comedy", 36: "History", 37: "Western", 53: "Thriller", 80: "Crime", 99: "Documentary",
    878: "Science Fiction", 9648: "Mystery", 10402: "Music", 10749: "Romance",
    10751: "Family", 10752: "War", 10770: "TV Movie"}
};
movieDB.getURL=function (option,url) {
  if (!url) {
    return false;
  }
  return movieDB.common.images_uri + option + url;
};
movieDB.search=function (searchType,keyword,_language,_page) {
  let language=_language||"en-US"||"zh-CN";
  let page=_page||1;
  let url=movieDB.common.base_uri+"search/"+searchType+"?api_key="+movieDB.common.api_key+"&language="+language+"&query="+keyword+"&page="+page+"&include_adult=false";

  let dataFilter=function(_data) {
    let Data=_data;
    let data=Data["results"];
    let results=[];
    for(let i=0;i<data.length;i++){
      let type=data[i]["media_type"];
      type=type?type:searchType;

      switch (type){
        case "movie":

          results.push({
            id:data[i].id,
            title:data[i]["title"],
            type:type,
            src:movieDB.getURL(movieDB.common.images.poster_sizes[2],data[i]["poster_path"]),
            time:data[i]["release_date"],
            overview:data[i].overview,
            score:data[i]["vote_average"],
            selected:false
          });
          break;
        case "person":

          let know=data[i]["known_for"];
          let knowFor=[];
          if (know){
            know.forEach(function (item) {
              knowFor.push({
                title:item["title"],
                id:item.id,
                type:item["media_type"],
                originalTitle:item["original_title"]
              })
            });
          }
          results.push({
            title:data[i]["name"],
            id:data[i].id,
            src:movieDB.getURL(movieDB.common.images.profile_sizes[2],data[i]["profile_path"]),
            time:knowFor.join(", "),
            type:type,
            selected:false
          });
          break;
        case "tv":
          results.push({
            id:data[i].id,
            type:type,
            title:data[i]["name"],
            src:movieDB.getURL(movieDB.common.images.poster_sizes[2],data[i]["poster_path"]),
            time:data[i]["first_air_date"],
            overview:data[i].overview,
            score:data[i]["vote_average"],
            selected:false
          })
      }
    }

    return{
      page:Data.page,
      totalPage:Data["total_pages"],
      results :results
    };

  };
  return {
    url:url,
    dataFilter:dataFilter
  };
};

movieDB.getMovieInfo=function (id,_language,_page) {


  let language=_language||"en-US"||"zh-CN";
  let page=_page||1;
  let detailUrl=movieDB.common.base_uri+"movie/"+id+"?api_key="+movieDB.common.api_key+"&language="+language;
  let creditsUrl=movieDB.common.base_uri+"movie/"+id+"/credits?api_key="+movieDB.common.api_key;
  let reviewsUrl=movieDB.common.base_uri+"movie/"+id+"/reviews?api_key="+movieDB.common.api_key+"&language="+language+"&include_image_language="+language+"&page="+page;
  let recommendationsUrl=movieDB.common.base_uri+"movie/"+id+"/recommendations?api_key="+movieDB.common.api_key+"&language="+language+"&page="+page;
  let videoUrl=movieDB.common.base_uri+'movie/'+id+'/videos?api_key='+movieDB.common.api_key+'&language='+language;
  let imageUrl=movieDB.common.base_uri+'movie/'+id+'/images?api_key='+movieDB.common.api_key;

  let detailFitler=function (_data) {
    let data=_data;
    let rowType=data["genres"];
    let rawCompany=data["production_companies"];


    let  brief={
      id:data.id,
      bgSrc:movieDB.getURL(movieDB.common.images.backdrop_sizes[3],data["backdrop_path"]),
      poster:movieDB.getURL(movieDB.common.images.poster_sizes[4],data["poster_path"]),
      title:data["title"],
      category:getKey(rowType,"name").join(",  "),
      time:data["release_date"].substr(0,4),
      score:data["vote_average"],
      overview:data["overview"],
      company:getKey(rawCompany,"name").join(",  "),
      type:"movie"
    };


    return brief;
  };
  let creditsFitler=function (_data) {
    let data=_data["cast"];
    let  credits=[];

    if (!data){
      return null;
    }
    data.forEach(function (t) {
      credits.push({
        character: t["character"],
        type:"person",
        id:t.id,
        name:t["name"],
        src:movieDB.getURL(movieDB.common.images.profile_sizes[3],t["profile_path"])
      })
    });
    credits=credits.slice(0,9);
    return credits;
  };
  let recommendationsFitler=function (_data) {
    let Data=_data;
    let data=Data["results"];

    if (!data){
      return null;
    }

    let  recommendations =[];
    data.forEach(function (t) {
      recommendations.push({
        src:movieDB.getURL(movieDB.common.images.backdrop_sizes[2],t["backdrop_path"]),
        id:t.id,
        type:"movie",
        title:t["title"]
      });
    });
    return recommendations;
  };
  let reviewsFitler=function (_data) {
    let Data=_data;
    let data=Data["results"];

    if (!data){
      return null;
    }

    let  reviews =[];
    data.forEach(function (t) {
      reviews.push({
        author:t["author"],
        content:t["content"],
        more: t["content"].length>300
      })
    });

    return reviews;
  };
  let videoFitler=function (_data) {
    let Data=_data;
    let data=Data["results"];

    if (!data){
      return null;
    }

    let  videos=[];
    data.forEach(function (t) {
      if (t.site==="YouTube"){
        videos.push({
          src:'https://www.youtube.com/embed/'+t.key+"?rel=0",
          name:t.name,
          show:false
        });
      }

    });
    if (videos.length>5){
      videos=videos.splice(0,5);
    }
    return videos;
  };
  let imageFitler=function (_data) {
    let data=_data;

    if (data.backdrops.length===0 && data.posters.length===0){
      return null;
    }

    let  images={
      backdrops:[],
      posters:[]
    };
    let index=0;
    let numB=Math.min(20,data.backdrops.length);
    if (data.backdrops.length>0){
      while (index<numB){
        let t=data.backdrops[index];
        let  scr=movieDB.getURL(movieDB.common.images.profile_sizes[3],t["file_path"]);
        if (images.backdrops.indexOf(scr)===-1){
          images.backdrops.push(scr);
        }
        index++;
      }
    }
    let numP=Math.min(20,data.posters.length);
    index=0;
    if (data.posters.length>0){
      while (index<numP){
        let t=data.posters[index];
        let  scr=movieDB.getURL(movieDB.common.images.profile_sizes[3],t["file_path"]);
        if (images.posters.indexOf(scr)===-1){
          images.posters.push(scr);
        }
        index++;
      }
    }

    return images;
  };

  return{
    url:[detailUrl,creditsUrl,recommendationsUrl,reviewsUrl,videoUrl,imageUrl],
    filter:[detailFitler,creditsFitler,recommendationsFitler,reviewsFitler,videoFitler,imageFitler]
  }

};
movieDB.getPersonInfo=function (id,_language,_page) {
  let language=_language||"en-US"||"zh-CN";
  let page=_page||1;
  let detailUrl=movieDB.common.base_uri+"person/"+id+"?api_key="+movieDB.common.api_key+"&language="+language;
  let tageedImageUrl=movieDB.common.base_uri+"person/"+id+"/tagged_images?api_key="+movieDB.common.api_key+"&language="+language+"page="+page;
  let actingUrl=movieDB.common.base_uri+"person/"+id+"/combined_credits?api_key="+movieDB.common.api_key+"&language="+language;
  let imagesUrl=movieDB.common.base_uri+"person/"+id+"/images?api_key="+movieDB.common.api_key;

  let detailFilter=function (_data) {
    let data=_data;
    let detail={

      briefInfo:[
        ["birthday",data["birthday"]],
        ['placeOfBirth',data["place_of_birth"]],
        ['gender',gender[data["gender"]]],
        ['popularity',Math.round(data["popularity"])]
      ],
      id:data.id,
      name: data["name"],
      anotherName:data["also_known_as"].join(" or "),

      biography:data["biography"],


      src:movieDB.getURL(movieDB.common.images.profile_sizes[2],data["profile_path"]),
      imdbID:data["imdb_id"],
      homepage:data["homepage"]
    };
    return detail;
  };
  let taggedImageFilter=function (_data) {
    let data=_data;
    data=data["results"];
    let knowFor=[];
    let id=[];
    data.forEach(function (t) {
      if (id.indexOf(t.media.id)===-1){
        knowFor.push({
          id:t.media.id,
          type:t["media_type"],
          src:movieDB.getURL(movieDB.common.images.backdrop_sizes[3],t.media["backdrop_path"]),
          popularity:t.media["popularity"],
          title:t.media["title"]||t.media["name"]
        });
        id.push(t.media.id);
      }

    });

    knowFor.sort(function (item1, item2) {
      return item1.popularity-item2.popularity>0?-1:1;
    });

    knowFor=knowFor.slice(0,8);
    return knowFor;
  };

  let imagesFilter=function (_data) {
    let data=_data;
    data=data["profiles"];
    let images=[];
    data.forEach(function (t) {
      images.push(movieDB.getURL(movieDB.common.images.profile_sizes[3],t["file_path"]));

    });



    //images=images.slice(0,9);
    return images;
  };
  let actingFilter=function (_data) {
    let data=_data;
    data=data["cast"];
    let acting=[];

    data.forEach(function (t) {
      let type=t["media_type"];
      let rowDate;
      let title;
      if(type==="movie"){
        rowDate=t["release_date"];
        title=t["title"];
      }else if (type==="tv"){
        rowDate=t["first_air_date"];
        title=t["name"]
      }

      let date;
      if (rowDate){
        date=rowDate.substr(0,4) ;

      }

      let act={
        title:title,
        id:t.id,
        type:t["media_type"],
        score:t["vote_average"],
        src:movieDB.getURL(movieDB.common.images.backdrop_sizes[3],t["backdrop_path"])
      };
      acting.push(act);

    });
    return acting;
  };
  return{
    url:[detailUrl,tageedImageUrl,actingUrl,imagesUrl],
    filter:[detailFilter,taggedImageFilter,actingFilter,imagesFilter]
  }
};




movieDB.getTVInfo=function (id,_language,_page) {
  let language=_language||"en-US"||"zh-CN";
  let page=_page||1;
  let detailUrl=movieDB.common.base_uri+"tv/"+id+"?api_key="+movieDB.common.api_key+"&language="+language;
  let creditsUrl=movieDB.common.base_uri+"tv/"+id+"/credits?api_key="+movieDB.common.api_key+"&language="+language;
  let recommendationsUrl=movieDB.common.base_uri+"tv/"+id+"/recommendations?api_key="+movieDB.common.api_key+"&language="+language+"&page="+page;
  let imageUrl=movieDB.common.base_uri+'tv/'+id+'/images?api_key='+movieDB.common.api_key;
  let videoUrl=movieDB.common.base_uri+'tv/'+id+'/videos?api_key='+movieDB.common.api_key+'&language='+language;

  let detailFilter=function (_data) {
    let data=_data;
    let rowType=data["genres"];
    let rawCompany=data["production_companies"];
    let rowCountry=data["production_countries"];

    let getKey=function (arrary,key) {
      let results =[];
      if (!(arrary && key)){
        return false;
      }
      arrary.forEach(function (t) {
        results.push(t[key]);
      });
      return results;
    };

    let  detail={
      id:data.id,
      title:data["name"],
      tvType:getKey(rowType,"name"),
      bgSrc:movieDB.getURL(movieDB.common.images.backdrop_sizes[3],data["backdrop_path"]),
      posterSrc:movieDB.getURL(movieDB.common.images.poster_sizes[3],data["poster_path"]),
      firstAirDate:data["first_air_date"].substr(0,4),
      score:data["vote_average"],
      overview:data["overview"],
      popularity:data["popularity"].toFixed(2),
      company:getKey(rawCompany,"name"),
      productionCountries:getKey(rowCountry,"name"),
      seasons:data["seasons"],
      type:"tv"

    };
    detail.seasons.forEach(function (t) {
      t.time=null;
      if (t.air_date){
        t.time=t.air_date.substr(0,4);
      }
      t.air_date=null;
      t.src=movieDB.getURL(movieDB.common.images.poster_sizes[3],t['poster_path']);
      t['poster_path']=null;
    });

    return detail;
  };
  let creditsFilter=function (_data) {
    let data=_data["cast"];
    let  credits=[];

    if (!data){
      return null;
    }
    data.forEach(function (t) {
      credits.push({
        character: t["character"],
        gender:gender[t["gender"]],
        order:t["order"],
        id:t.id,
        type:"person",
        name:t["name"],
        show:true,
        src:movieDB.getURL(movieDB.common.images.profile_sizes[3],t["profile_path"])
      })
    });
    credits=credits.sort((n,m)=>n.order-m.order);
    credits.forEach(function (t,index) {
      if (index>=6){
        t.show=false;
      }
    });
    return credits;
  };
  let recommendationsFilter=function (_data) {
    let Data=_data;
    let data=Data["results"];

    if (!data){
      return null;
    }

    let  recommendations =[];

    data.forEach(function (t) {
      recommendations.push({
        src:movieDB.getURL(movieDB.common.images.backdrop_sizes[2],t["backdrop_path"]),
        id:t.id,
        type:"tv",
        title:t["name"]
      });
    });
    return recommendations;
  };
  let imageFilter=function (_data) {
    let data=_data;
    if (data.backdrops.length===0 && data.posters.length===0){
      return null;
    }
    let  images={
      backdrops:[],
      posters:[]
    };
    let index=0;
    let numB=Math.min(20,data.backdrops.length);
    if (data.backdrops.length>0){
      while (index<numB){
        let t=data.backdrops[index];
        let scr=movieDB.getURL(movieDB.common.images.profile_sizes[3],t["file_path"]);
        if (images.backdrops.indexOf(scr)===-1){
          images.backdrops.push(scr);
        }
        index++;
      }
    }
    let numP=Math.min(numB,data.posters.length);
    if (data.posters.length>0){
      while (index>numB-numP){
        let t=data.posters[index];
        let  scr=movieDB.getURL(movieDB.common.images.profile_sizes[3],t["file_path"]);
        if (images.posters.indexOf(scr)===-1){
          images.posters.push(scr);
        }
        index--;
      }
    }

    return images;
  };
  let videoFilter=function (_data) {
    let Data=_data;
    let data=Data["results"];

    if (!data){
      return null;
    }

    let  videos=[];
    data.forEach(function (t) {
      if (t.site==="YouTube"){
        videos.push({
          src:'https://www.youtube.com/embed/'+t.key+"?rel=0",
          name:t.name,
          show:false
        });
      }

    });
    if (videos.length>5){
      videos=videos.splice(0,5);
    }
    return videos;
  };

  return{
    url:[detailUrl,creditsUrl,recommendationsUrl,imageUrl,videoUrl],
    filter:[detailFilter,creditsFilter,recommendationsFilter,imageFilter,videoFilter]
  }
};


movieDB.favorite=function (id,type,_language) {
  let language=_language||"en-US"||"zh-CN";
  let detailUrl=movieDB.common.base_uri+type+"/"+id+"?api_key="+movieDB.common.api_key+"&language="+language;

  let movielFitler=function (_data) {
    let data=_data;

    return {
      id:data.id,
      src:movieDB.getURL(movieDB.common.images.poster_sizes[4],data["poster_path"]),
      title:data["title"],
      overview:data["overview"],
      type:"movie",
      time:data["release_date"].substr(0,4),
      popularity:data["popularity"].toFixed(2),
    };


  };
  let TVlFitler=function (_data) {
    let data=_data;

    return {
      id:data.id,
      title:data["name"],
      src:movieDB.getURL(movieDB.common.images.poster_sizes[3],data["poster_path"]),
      overview:data["overview"],
      type:"tv",
      popularity:data["popularity"].toFixed(2),
      time:data["first_air_date"].substr(0,4)
    };

  };
  let personFitler=function (_data) {
    let data=_data;
    return {
      id:data.id,
      title: data["name"],
      overview:data["biography"],
      src:movieDB.getURL(movieDB.common.images.profile_sizes[2],data["profile_path"]),
      popularity:data["popularity"].toFixed(2),
      type:"person"
    }

  };

  let result=[detailUrl];
  switch (type){
    case "movie":
      result.push(movielFitler);
      break;
    case "tv":
      result.push(TVlFitler);
      break;
    case "person":
      result.push(personFitler);
      break;
    default:
      break;
  }
  return result;
};


export default movieDB
