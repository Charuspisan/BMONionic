angular.module('BMON').controller('manageLocationsCtrl', ["$scope", "$firebaseObject", "$ionicPopup", "$timeout", function($scope, $firebaseObject, $ionicPopup, $timeout) {

var t0 = performance.now();

var refLocations = new Firebase("https://project-3351723142096034396.firebaseio.com/locations"); 
refLocations.on('value', function(snapshot) {
  console.log("Value changed on Location");
  infoLacatList = snapshot.val();
        var t1 = performance.now();
        console.log("Init on " + ((t1 - t0)/1000) + " seconds.")
        //alert("Snap data from firebase by " + ((t1 - t0)/1000) + " seconds.");  
  initLocaList(infoLacatList);
});
  
var infoLacatList, infoProvList

  function initLocaList(){
    $("#showProv").empty();
    var provList = Object.keys(infoLacatList);
    $.when(
        provList.forEach(function(prov, index){
            $("#showProv").append("<span class='provWrapper' data-prov='"+prov+"'>"+prov+"&nbsp;&nbsp;<input type='text' value=''><button class='editProv' data-prov='"+prov+"'>Edit</button><button class='deleteProv' data-prov='"+prov+"'>Delete</button></span>");

            var objArea = Object.keys(infoLacatList[prov]);
            //console.log(objArea);

            objArea.forEach(function(area, index){
              $("span[data-prov='"+prov+"']").append("<span class='areaWrapper' data-area='"+prov+area+"'>"+area+"&nbsp;&nbsp;<input type='text' value=''><button class='editArea' data-prov='"+prov+"'data-area='"+area+"'>Edit</button></span>");

                var objPin = Object.keys(infoLacatList[prov][area]);
                console.log(prov+" : "+area+" : "+objPin);

                objPin.forEach(function(pin, index){
                  $("span[data-area='"+prov+area+"']").append("<span class='areaWrapper' data-pin='"+prov+area+pin+"'>"+pin+"&nbsp;&nbsp;<input type='text' value=''><button class='editPin' data-prov='"+prov+"'data-area='"+area+"'data-pin='"+pin+"'>Edit</button></span>");
                    var objLatLng = Object.keys(infoLacatList[prov][area][pin]);
                    objLatLng.forEach(function(coordinate, index){
                      var valLatLng = infoLacatList[prov][area][pin][coordinate];  
                      $("span[data-pin='"+prov+area+pin+"']").append("<span class='areaWrapper' data-coordinate='"+prov+area+pin+coordinate+"'>"+coordinate+" : "+valLatLng+"&nbsp;&nbsp;<input type='text' value=''><button class='editPosit' data-prov='"+prov+"'data-area='"+area+"'data-pin='"+pin+"'data-coor='"+coordinate+"'>Edit</button></span>");
                    })

                })  
            })
          $("span[data-prov='"+prov+"']").append("<div class='addAreaForm'><input type='text' placeholder='Area Name' data-name='areaName'><input type='text' placeholder='Pin Name' data-name='pinName'><input type='text' placeholder='Lat' data-name='latName'><input type='text' placeholder='Long' data-name='lngName'><button class='addAreaBT' data-prov='"+prov+"'>Add Area</button></div>");
        }) 
      ).done(function(){
        delayBT();
        $(".modal").hide();
      })
  }

    var prov, area, pin, lat, lng
    
    $("#addProvBT").on("click", function(){
      addProvinceOnProv();
    });
    
    function addProvinceOnProv (){
      prov=$("#inputProvOnProv").val();
      area=$("#inputAreaOnProv").val();
      pin=$("#inputPinOnProv").val();
      lat=$("#inputLatOnProv").val();
      lng=$("#inputLngOnProv").val();
      //console.log(prov);
      refLocations.child(prov+'/'+area+'/'+pin+'/').set({
        lat:lat,
        lng:lng
      }).catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error;
              console.log(errorMessage);
              alert(errorMessage);
              // ...
            });
    }
  
  function addArea(prov, area, pin, lat, lng){
      console.log("add area "+prov+" : "+area+" : "+pin+" : "+lat+" : "+lng);
      refLocations.child(prov+'/'+area+'/'+pin+'/').set({
        lat:lat,
        lng:lng
      }).catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error;
              console.log(errorMessage);
              alert(errorMessage);
              // ...
      });
  }

function delayBT(){
  //setTimeout(function(){
      $(".editProv").on("click", function(){
        var provName = $(this).attr("data-prov");
        var NewProvName = $(this).prev('input').val();
        //console.log(provName + " : " + NewProvName);
        editProv(provName, NewProvName);
      });
      $(".deleteProv").on("click", function(){
          var provName = $(this).attr("data-prov");
          deleteProv(provName);
          console.log("Deleted "+provName);
      });
      $(".editArea").on("click", function(){
          var provName = $(this).attr("data-prov");
          var areaName = $(this).attr("data-area");
          var NewAreaName = $(this).prev('input').val();
          //console.log(provName + " : " + NewProvName);
          editArea(provName, areaName, NewAreaName);
      });
      $(".editPin").on("click", function(){
          var provName = $(this).attr("data-prov");
          var areaName = $(this).attr("data-area");
          var pinName = $(this).attr("data-pin");
          var NewPinName = $(this).prev('input').val();
          //console.log(provName + " : " + NewProvName);
          editPin(provName, areaName, pinName, NewPinName);
      });
      $(".editPosit").on("click", function(){
          var provName = $(this).attr("data-prov");
          var areaName = $(this).attr("data-area");
          var pinName = $(this).attr("data-pin");
          var positName = $(this).attr("data-coor");
          var NewPositName = $(this).prev('input').val();
          //console.log(provName + " : " + NewProvName);
          editPosit(provName, areaName, pinName, positName, NewPositName);
      });
  
      $(".addAreaBT").on("click", function(){
        var prov=$(this).attr("data-prov");
        var area=$(this).siblings('input[data-name="areaName"]').val();
        var pin=$(this).siblings('input[data-name="pinName"]').val();
        var lat=$(this).siblings('input[data-name="latName"]').val();
        var lng=$(this).siblings('input[data-name="lngName"]').val();
        addArea(prov, area, pin, lat, lng);
      });
  //},1000);
}  

function editProv(provName, newProvName){
  var child = refLocations.child(provName);
  $.when(
    child.once('value', function(snapshot) {
    refLocations.child(newProvName).set(snapshot.val())
    })
  ).done(function(){
    child.remove();
    console.log('editChild : '+newProvName); 
  }); 
}

  
function deleteProv(provName){
  var child = refLocations.child(provName);
  var txt;
  var r = confirm("Are you want to delete!");
  if (r == true) {child.remove();}
}

function editArea(provName, areaName, NewAreaName){
  var child = refLocations.child(provName+"/"+areaName);
  $.when(
    child.once('value', function(snapshot) {refLocations.child(provName).child(NewAreaName).set(snapshot.val())})
  ).done(function(){
      child.remove();
      console.log('editArea : '+NewAreaName);
    });    
}
  
function editPin(provName, areaName, pinName, NewPinName){
  var child = refLocations.child(provName+"/"+areaName+"/"+pinName);
  $.when(
      child.once('value', function(snapshot) {
      refLocations.child(provName).child(areaName).child(NewPinName).set(snapshot.val())
      })    
  ).done(function(){
      child.remove();
      console.log('editPin : '+NewPinName);    
  });
}
  
function editPosit(provName, areaName, pinName, positName, NewPositName){
  var child = refLocations.child(provName+"/"+areaName+"/"+pinName+"/"+positName);
  child.set(NewPositName);
  console.log('editPosit : '+positName+' : '+NewPositName);
}  


  }
]);















  
