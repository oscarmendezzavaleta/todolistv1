// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('todoList', ['ionic',"firebase"])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})


// La Fabrica
.factory("ToDos",function($firebaseArray){
  var toDosRef=new Firebase("https://todolist-be450.firebaseio.com/ToDos/tareas");
  return $firebaseArray(toDosRef);
})

.controller("TodoListCtrl",function($scope,ToDos,$ionicPopup,$ionicLoading){
  $ionicLoading.show({
    template:'Cargando la data...'
  });
  $scope.shouldShoDelete=false;
  $scope.shouldShoRecorder=false;
  $scope.ListCanSwipe=true;

  $scope.toDos=ToDos;

  $scope.toDos.$loaded().then(function(todo){
    $ionicLoading.hide();
  });


$scope.eliminar=function(item){
  $scope.toDos.$remove(item).then(function(ref){
ref.key()==item.$id;
console.log("ID:" + item.$id + "Fue Eliminado");
  })
}

 $scope.editar = function (toDo) {
    $scope.data = {
      "toDoEditado": toDo.name 
    };

      var myPopup = $ionicPopup.show({
        template: '<input type="text" ng-model="data.toDoEditado">',
        title: '¿Que vas a hacer?',
        scope: $scope,
        buttons: [
          { text: 'Cancelar' },
          {
            text: '<b>Guardar</b>',
            type: 'button-positive',
            onTap: function(e) {

              console.log($scope.data.toDoEditado);
              if (!$scope.data.toDoEditado) {
                console.log("No ingreso nada");
             
                e.preventDefault();
              } else {
                console.log("Ingreso " +  $scope.data.toDoEditado);

                toDo.name = $scope.data.toDoEditado;

                $scope.toDos.$save(toDo).then(function(ref) {
                  ref.key() === toDo.$id; // true
                  console.log("Editado registro " + toDo.$id);
                });

                return $scope.data.toDoEditado;
              }
            }
          }
        ]
      });
  }

  /** Funcion encargada de Agregar un ToDo */
  $scope.agregar = function() {

    $scope.data = {};

      var myPopup = $ionicPopup.show({
        template: '<input type="text" ng-model="data.toDoNuevo">',
        title: '¿Que vas a hacer?',
        scope: $scope,
        buttons: [
          { text: 'Cancelar' },
          {
            text: '<b>Guardar</b>',
            type: 'button-positive',
            onTap: function(e) {

              console.log($scope.data.toDoNuevo);
              if (!$scope.data.toDoNuevo) {
                console.log("No ingreso nada");
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                console.log("Ingreso " +  $scope.data.toDoNuevo);

                /** Se guadar en firebase */
                $scope.toDos.$add({
                  "name": $scope.data.toDoNuevo
                });

                return $scope.data.toDoNuevo;
              }
            }
          }
        ]
      });

  };
});

