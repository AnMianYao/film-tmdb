
let movieDB={};
let gender={
    1:"female",
    2:"man"
};
let sortBy={"Popular descending order":"popularity.asc", "Popular ascending order":"popularity.desc",
    "Release date Descending":"release_date.asc","Release date ascending":"release_date.desc",
    "Title(A-Z)":"original_title.asc","Title(Z-A)":"original_title.desc",
    "Score ascending order":"vote_average.asc","Score descending order":"vote_average.desc"};

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
movieDB.search=function (type,keyword,_language,_page) {
  let language=_language||"en-US"||"zh-CN";
  let page=_page||1;
  let url=movieDB.common.base_uri+"search/"+type+"?api_key="+movieDB.common.api_key+"&language="+language+"&query="+keyword+"&page="+page+"&include_adult=false";

  let dataFilter=function(_data) {
    let Data=_data;
    let data=Data["results"];

    let person=[];
    let movie=[];
    let tv=[];

    for(let i=0;i<data.length;i++){
      let type=data[i]["media_type"];

      switch (type){
        case "movie":

          movie.push({
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
          person.push({
            title:data[i]["name"],
            id:data[i].id,
            src:movieDB.getURL(movieDB.common.images.profile_sizes[2],data[i]["profile_path"]),
            time:knowFor.join(", "),
            type:type,
            selected:false
          });
          break;
        case "tv":
          tv.push({
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
      results :{
        person:person,
        movie:movie,
        tv:tv
      }
    };

  };
  return {
    url:url,
    dataFilter:dataFilter
  };
}
movieDB.multiSearch=function (keyword,_language,_page) {
    let language=_language||"en-US"||"zh-CN";
    let page=_page||1;
    let url=movieDB.common.base_uri+"search/multi?api_key="+movieDB.common.api_key+"&language="+language+"&query="+keyword+"&page="+page+"&include_adult=false";


  return {
    url:url,
    dataFilter:dataFilter
  };

};
movieDB.movieSearch=function (keyword,callback,_language,_page,_regions,_year) {

  $.ajax({
    type:"GET",
    url:url,
    dataType:"text",
    data:{},


    success:function (data) {
      /**
       * data 返回结果为数组
       * id
       * media_type
       */
      callback(data);


    },
    error : function(XMLHttpRequest, textStatus, errorThrown) {
      console.log(XMLHttpRequest.status);
      console.log(XMLHttpRequest.readyState);
      console.log(textStatus);

    }
  })
  let language=_language||"en-US"||"zh-CN";
  let page=_page||1;
  let regions=_regions?"&region="+regions:"";
  let year=_year?"&year="+year:"";
  let url=movieDB.common.base_uri+"search/movie?api_key="+movieDB.common.api_key+"&language="+language+"&query="+keyword+"&page="+page+"&include_adult=false"+regions+year;
    $.ajax({
        type:"GET",
        url:url,
        dataType:"text",
        data:{},

        dataFilter:function (_data) {
          let Data=JSON.parse(_data);
          let data=Data["results"];

          let movie=[];
            console.log(data);

            data.forEach(function (item) {
                movie.push({
                  id:item.id,
                  title:item["title"],
                  type:"movie",
                  src:movieDB.getURL(movieDB.common.images.poster_sizes[2],item["poster_path"]),
                  time:item["release_date"],
                  overview:item.overview,
                  score:item["vote_average"],
                  selected:false
                });
            });

            return{
                page:Data.page,
                totalPage:Data["total_pages"],
                results :{
                    movie:movie

                }
            };
        },
        success:function (data) {
            /**
             * data 返回结果为数组
             * id
             * media_type
             */

            console.log(data);
            callback(data);

        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
           console.log(XMLHttpRequest.status);
           console.log(XMLHttpRequest.readyState);
            console.log(textStatus);

        }
    })

};
movieDB.personSearch=function (keyword,callback,_language,_page,_regions) {
  let language=_language||"en-US"||"zh-CN";
  let page=_page||1;
  let regions=_regions?"&region="+_regions:"";

  let url=movieDB.common.base_uri+"search/person?api_key="+movieDB.common.api_key+"&language="+language+"&query="+keyword+"&page="+page+"&include_adult=false"+regions;
    $.ajax({
        type:"GET",
        url:url,
        dataType:"text",
        data:{},

        dataFilter:function (_data) {
          let Data=JSON.parse(_data);
          let data=Data["results"];

          let person=[];
            console.log(data);

            data.forEach(function (item) {
              let know=item["known_for"];
              let knowFor=[];

                if (know){
                    know.forEach(function (index) {
                        knowFor.push({
                            title:index["title"],
                            id:index.id,
                            type:index["media_type"],
                            originalTitle:index["original_title"]
                        });
                    });
                }
                person.push({
                    title:item["name"],
                    id:item.id,
                    type:"person",
                    popularity:item["popularity"],
                    src:movieDB.getURL(movieDB.common.images.profile_sizes[2],item["profile_path"]),
                    time:knowFor.join(", "),
                    selected:false
                });
            });

            return{
                page:Data.page,
                totalPage:Data["total_pages"],
                results :{
                    person:person
                }
            };
        },
        success:function (data) {
            /**
             * data 返回结果为数组
             * id
             * media_type
             */

            console.log(data);
            callback(data);

        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
           console.log(XMLHttpRequest.status);
           console.log(XMLHttpRequest.readyState);
            console.log(textStatus);

        }
    })

};
movieDB.tvSearch=function (keyword,callback,_language,_page,_year) {
    let language=_language||"en-US"||"zh-CN";
    let page=_page||1;
    let year=_year?"&first_air_date_year"+year:"";
    let url=movieDB.common.base_uri+"search/tv?api_key="+movieDB.common.api_key+"&language="+language+"&query="+keyword+"&page="+page+"&include_adult=false"+year;
    $.ajax({
        type:"GET",
        url:url,
        dataType:"text",
        data:{},

        dataFilter:function (_data) {
          let Data=JSON.parse(_data);
          let data=Data["results"];

          let tv=[];
            console.log(data);

            data.forEach(function (item) {
                tv.push({
                  id:item.id,
                  type:"tv",
                  title:item["name"],
                  src:movieDB.getURL(movieDB.common.images.poster_sizes[2],item["poster_path"]),
                  time:item["first_air_date"],
                  overview:item.overview,
                  score:item["vote_average"],
                  selected:false
                });
            });

            return{
                page:Data.page,
                totalPage:Data["total_pages"],
                results :{
                    tv:tv

                }
            };
        },
        success:function (data) {
            /**
             * data 返回结果为数组
             * id
             * media_type
             */

            console.log(data);
            callback(data);

        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);

        }
    })

};


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

movieDB.getPersonInfo=function (id,callback,_language,_page) {
  let language=_language||"en-US"||"zh-CN";
  let page=_page||1;
  let detailUrl=movieDB.common.base_uri+"person/"+id+"?api_key="+movieDB.common.api_key+"&language="+language;
  let tageedImageUrl=movieDB.common.base_uri+"person/"+id+"/tagged_images?api_key="+movieDB.common.api_key+"&language="+language+"page="+page;
  let actingUrl=movieDB.common.base_uri+"person/"+id+"/combined_credits?api_key="+movieDB.common.api_key+"&language="+language;
  let imagesUrl=movieDB.common.base_uri+"person/"+id+"/images?api_key="+movieDB.common.api_key;



    $.when(
        $.ajax({
            type:"GET",
            url:detailUrl,
            dataType:"text",
            dataFilter:function (_data) {
              let data=JSON.parse(_data);
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
            }

        }),
        $.ajax({
            type:"GET",
            url:tageedImageUrl,
            dataType:"text",
            dataFilter:function (_data) {
              let data=JSON.parse(_data);
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
            }
        }),
        $.ajax({
            type:"GET",
            url:actingUrl,
            dataType:"text",
            dataFilter:function (_data) {
              let data=JSON.parse(_data);
               data=data["cast"];
              let acting={};

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

                       if (!acting[date]){
                           acting[date]=[];
                       }

                     let act={
                           title:title,
                           id:t.id,
                           type:t["media_type"],
                           score:t["vote_average"],
                           src:movieDB.getURL(movieDB.common.images.backdrop_sizes[3],t["backdrop_path"])
                       };
                       acting[date].push(act);

                   }

                });
                let key=Object.keys(acting).sort((n,m)=> m-n);
                key=key.splice(0,5);
                let newacting={};
                key.forEach(function (t,index) {
                  newacting[t]={
                    selected:false,
                    actings:acting[t]
                  };
                  if (index===0){
                    newacting[t].selected=true;
                  }
                });
                return newacting;
            }
        }),
        $.ajax({
        type:"GET",
        url:imagesUrl,
        dataType:"text",
        dataFilter:function (_data) {
          let data=JSON.parse(_data);
          data=data["profiles"];
          let images=[];
          data.forEach(function (t) {
            images.push(movieDB.getURL(movieDB.common.images.profile_sizes[3],t["file_path"]));

          });



          //images=images.slice(0,9);
          return images;
        }
      })
    ).then(function (resp1,resp2,resp3,resp4) {

      let person={
            detail:resp1[0],
            tagged:resp2[0],
            acting:resp3[0],
            images:resp4[0]
        };
        console.log(person);
        callback(person);
    })


};


movieDB.getMovieInfo=function (id,callback,_language,_page) {


  let language=_language||"en-US"||"zh-CN";
  let page=_page||1;
  let detailUrl=movieDB.common.base_uri+"movie/"+id+"?api_key="+movieDB.common.api_key+"&language="+language;
  let creditsUrl=movieDB.common.base_uri+"movie/"+id+"/credits?api_key="+movieDB.common.api_key;
  let reviewsUrl=movieDB.common.base_uri+"movie/"+id+"/reviews?api_key="+movieDB.common.api_key+"&language="+language+"&include_image_language="+language+"&page="+page;
  let recommendationsUrl=movieDB.common.base_uri+"movie/"+id+"/recommendations?api_key="+movieDB.common.api_key+"&language="+language+"&page="+page;
  let videoUrl=movieDB.common.base_uri+'movie/'+id+'/videos?api_key='+movieDB.common.api_key+'&language='+language;
  let imageUrl=movieDB.common.base_uri+'movie/'+id+'/images?api_key='+movieDB.common.api_key;


    $.when(
        $.ajax({
                type:"GET",
                url:detailUrl,
                dataType:"text",
                data:{},
                dataFilter:function (_data) {
                    let data=JSON.parse(_data);
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
                }
        }),
        $.ajax({
            type:"GET",
            url:creditsUrl,
            dataType:"text",
            dataFilter:function (_data) {
                let data=JSON.parse(_data)["cast"];
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
            }
        }),
        $.ajax({
            type:"GET",
            url:recommendationsUrl,
            dataType:"text",
            dataFilter:function (_data) {
                let Data=JSON.parse(_data);
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
            }
        }),
        $.ajax({
        type:"GET",
        url:reviewsUrl,
        dataType:"text",
        dataFilter:function (_data) {
            let Data=JSON.parse(_data);
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
        }
    }),
        $.ajax({
                type:"GET",
                url:videoUrl,
                dataType:"text",
                dataFilter:function (_data) {
                    let Data=JSON.parse(_data);
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
                }
            }),
        $.ajax({
                type:"GET",
                url:imageUrl,
                dataType:"text",
                dataFilter:function (_data) {
                    let data=JSON.parse(_data);


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
                }
            }),

    ).then(function (resp1,resp2,resp3,resp4,resp5,resp6) {
        let movie={
          brief:resp1[0],
          credits:resp2[0],
          recommendations:resp3[0],
          reviews:resp4[0],
          videos:resp5[0],
          images:resp6[0]

        };
        callback(movie);
    })


};

movieDB.getTVInfo=function (id,callback,_language,_page) {
  let language=_language||"en-US"||"zh-CN";
  let page=_page||1;
  let detailUrl=movieDB.common.base_uri+"tv/"+id+"?api_key="+movieDB.common.api_key+"&language="+language;
  let creditsUrl=movieDB.common.base_uri+"tv/"+id+"/credits?api_key="+movieDB.common.api_key+"&language="+language;
  let recommendationsUrl=movieDB.common.base_uri+"tv/"+id+"/recommendations?api_key="+movieDB.common.api_key+"&language="+language+"&page="+page;
  let imageUrl=movieDB.common.base_uri+'tv/'+id+'/images?api_key='+movieDB.common.api_key;
  let videoUrl=movieDB.common.base_uri+'tv/'+id+'/videos?api_key='+movieDB.common.api_key+'&language='+language;




  $.when(
        $.ajax({
                type:"GET",
                url:detailUrl,
                dataType:"text",
                data:{},
                dataFilter:function (_data) {
                  let data=JSON.parse(_data);
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
                    if (t.air_date){
                      t.time=t.air_date.substr(0,4);
                    }
                    t.time=null;
                    t.air_date=null;
                    t.src=movieDB.getURL(movieDB.common.images.poster_sizes[3],t['poster_path']);
                    t['poster_path']=null;
                  });

                    return detail;
                }
        }),
        $.ajax({
            type:"GET",
            url:creditsUrl,
            dataType:"text",
            dataFilter:function (_data) {
              let data=JSON.parse(_data)["cast"];
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
            }
        }),
        $.ajax({
            type:"GET",
            url:recommendationsUrl,
            dataType:"text",
            dataFilter:function (_data) {
              let Data=JSON.parse(_data);
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
            }
        }),
        $.ajax({
        type:"GET",
        url:imageUrl,
        dataType:"text",
        dataFilter:function (_data) {
          let data=JSON.parse(_data);


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
        }
      }),
        $.ajax({
        type:"GET",
        url:videoUrl,
        dataType:"text",
        dataFilter:function (_data) {
          let Data=JSON.parse(_data);
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
        }
      }),

    ).then(function (resp1,resp2,resp3,resp4,resp5) {
      let tv={
            detail:resp1[0],
            credits:resp2[0],
            recommendations:resp3[0],
            images:resp4[0],
            videos:resp5[0]

        };
        console.log(tv);
        callback(tv);
    })


};

movieDB.getDiscover=function (callback,obj,page,language ) {
    var page=page||1;
    var language=language||"en-US"||"zh-CN";
    var obj=obj||{};

    var sortBy=obj.sortBy?+"&sort_by="+obj.sortBy:"";
    var year=obj.year?"&year="+obj.year:"";
    var withGenres=obj.type?"with_genres="+obj.type:"";

    var url=this.common.base_uri+"discover/movie?"+"api_key="+this.common.api_key+"&language="+language+sortBy+"&include_adult=false&include_video=false&page="+withGenres+page+year;

    console.log(url)

    $.ajax({
        type:"GET",
        url:url,
        dataType:"text",
        dataFilter:function (data) {
            var Data=JSON.parse(data);
            var data=Data["results"];

            if (!data){
                return null;
            }

            var  discovery=[];
            data.forEach(function (t) {
                discovery.push({
                    backdrop:t["backdrop_path"],
                    poster:t["poster_path"],
                    movieType:getType(t["genre_ids"]),
                    id:t.id,
                    type:"movie",
                    title:t["title"],
                    score:t["vote_average"],
                    releaseDate:t["release_date"],
                    overview:t["overview"],
                    popularity:t["popularity"]
            });
            });
            return discovery;
        },
        success:function (data) {
            /**
             * data 返回结果为数组
             * id
             * media_type
             */
           console.log(data);
           callback(data);

        },
        error:function () {
            alert("failed!")
        }

    });
};


movieDB.getPopularPerson=function(callback,_page,_language){
    let language=_language||"en-US"||"zh-CN";
    let page=_page||1;
    let url=movieDB.common.base_uri+"person/popular?api_key="+movieDB.common.api_key+"&language="+language+"&page="+page;
    $.ajax({
        type:"GET",
        url:url,
        dataType:"text",
        data:{},

        dataFilter:function (_data) {
            let Data=JSON.parse(_data);
            let data=Data["results"];

            let popularPerson=[];

            data.forEach(function (item) {
                popularPerson.push({
                    name:item["name"],
                    id:item.id,
                    type:"person",
                    src:movieDB.getURL(movieDB.common.images.profile_sizes[2],item["profile_path"])

                });
            });

            return popularPerson.slice(0,10)
        },
        success:function (data) {
            /**
             * data 返回结果为数组
             * id
             * media_type
             */

            callback(data);

        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);

        }
    })

};
movieDB.getPopularMovie=function(callback,_page,_language){
  let language=_language||"en-US"||"zh-CN";
  let page=_page||1;
  let url=movieDB.common.base_uri+"movie/popular?api_key="+movieDB.common.api_key+"&language="+language+"&page="+page;

    $.ajax({
        type:"GET",
        url:url,
        dataType:"text",
        data:{},

        dataFilter:function (_data) {
          let Data=JSON.parse(_data);
          let data=Data["results"];

          let popularMovie=[];

            data.forEach(function (item) {
                popularMovie.push({
                    id:item.id,
                    title:item["title"],
                    type:"movie",
                    src:movieDB.getURL(movieDB.common.images.poster_sizes[3],item["poster_path"]),


                });
            });

            return popularMovie.slice(0,10);
        },
        success:function (data) {
            /**
             * data 返回结果为数组
             * id
             * media_type
             */

            console.log(data);
            callback(data);

        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);

        }
    })

};
movieDB.getPopularTV=function(callback,_page,_language){
  let language=language||"en-US"||"zh-CN";
  let page=page||1;
  let url=movieDB.common.base_uri+"tv/popular?api_key="+movieDB.common.api_key+"&language="+language+"&page="+page;
    $.ajax({
        type:"GET",
        url:url,
        dataType:"text",
        data:{},

        dataFilter:function (_data) {

          let Data=JSON.parse(_data);
          let data=Data["results"];

          let popularTV =[];

            data.forEach(function (item) {
                popularTV.push({
                    id:item.id,
                    title:item["name"],
                    type:"tv",
                    src:movieDB.getURL(movieDB.common.images.poster_sizes[3],item["poster_path"])
                });
            });
            return popularTV.slice(0,10)
        },
        success:function (data) {
            /**
             * data 返回结果为数组
             * id
             * media_type
             */

            console.log(data);
            callback(data);

        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);

        }
    })

};

movieDB.login=function (username,password,callback) {
    var requestUrl="https://api.themoviedb.org/3/authentication/token/new?api_key=dcc18672beb28dd5960858c5c3e3b174";

    $.ajax({
        type:"GET",
        url:requestUrl,
        dataType:"text",
        dataFilter:function (data) {

            var data=JSON.parse(data);

            return data["request_token"]
        },
        success:function (data) {

            var sessionUrl="https://api.themoviedb.org/3/authentication/session/new?api_key=dcc18672beb28dd5960858c5c3e3b174&request_token="+data;

            var loginUrl="https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=dcc18672beb28dd5960858c5c3e3b174&username="+username+"" +
                "&password="+password+"&request_token="+data;

           $.ajax({
               type:"GET",
               url:loginUrl,
               dataType:"text",
               success:function () {
                   $.ajax({
                       type:"GET",
                       url:sessionUrl,
                       dataType:"text",
                       dataFilter:function (data) {
                           var data=JSON.parse(data);
                           return data["session_id"]
                       },
                       success:function (data) {
                           console.log(data);

                          callback(data)
                       },
                       error:function() {
                           Materialize.toast($("<span>Login failed </span>"), 2000);
                       }
                   });
               },
               error:function(XMLHttpRequest, textStatus, errorThrown) {
                   Materialize.toast($("<span>Login failed </span>"), 2000);
               }
           });
        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);

        }
    })
};

movieDB.getMyFavoriteMovie=function (id,callback) {
    var url="https://api.themoviedb.org/3/account/{account_id}/favorite/movies?api_key=dcc18672beb28dd5960858c5c3e3b174&session_id="+id+"" +
        "&language=en-US&sort_by=created_at.asc&page=1";

    $.ajax({
        type:"GET",
        url:url,
        dataType:"text",
        dataFilter:function (data) {

            var data=JSON.parse(data);
            var page=data.page;
            var totalPage=data["total_pages"];
            var results =data["results"];

            var movie=[];

            results.forEach(function (item) {
                movie.push({
                    id:item.id,
                    type:"movie",
                    title:item["title"],
                    originalTitle:item["original_title"],
                    movieType:getType(item["genre_ids"]),
                    backdrop:item["backdrop_path"],
                    poster:item["poster_path"],
                    releaseDate:item["release_date"],
                    score:item["vote_average"],
                    originalLanguage:item["original_language"],
                    overview:item["overview"]
                });
            });

            return{
                page:page,
                totalPage:totalPage,
                results :{
                    movie:movie

                }
            };
        },
        success:function (data) {
            callback(data);
        }
    }) ;
};
movieDB.getMyFavoriteTV=function (id,callback) {
    var url="https://api.themoviedb.org/3/account/{account_id}/favorite/tv?api_key=dcc18672beb28dd5960858c5c3e3b174&session_id="+id+"" +
        "&language=en-US&sort_by=created_at.asc&page=1";
    $.ajax({
        type:"GET",
        url:url,
        dataType:"text",
        dataFilter:function (data) {

            var data=JSON.parse(data);
            var page=data.page;
            var totalPage=data["total_pages"];
            var results =data["results"];

            var tv=[];

            results.forEach(function (item) {
                tv.push({
                    id:item.id,
                    type:"tv",
                    title:item["name"],
                    originalTitle:item["original_name"],
                    tvType:getType(item["genre_ids"]),
                    backdrop:item["backdrop_path"],
                    poster:item["poster_path"],
                    firstAirDate:item["first_air_date"],
                    score:item["vote_average"],
                    originalCountry:item["origin_country"],
                    popularity:item["popularity"],
                    overview:item["overview"]
                });
            });

            return{
                page:page,
                totalPage:totalPage,
                results :{
                    tv:tv

                }
            };
        },
        success:function (data) {
            callback(data);
            console.log(data)

        }
    }) ;
};
movieDB.getURL=function (option,url) {
  if (!url) {
    return "../common/imgs/home_bg.jpg";
  }
  return movieDB.common.images_uri + option + url;
};

export default {movieDB};

