angular.module('ionicApp.controllers', [])


.controller('SignInCtrl', function($scope, $state,$firebaseAuth) {
  checklogin($scope, $state,$firebaseAuth);
  $scope.user = {};
  var auth = $firebaseAuth();
  $scope.signIn = function(user) {
    console.log('Sign-In', user);
    // $state.go('tabs.home');
    console.log($firebaseAuth);
    var username = $scope.user.username;
    var password = $scope.user.password;
    auth.$signInWithEmailAndPassword(username,password).then(function(user){
      console.log(user);
      checklogin($scope, $state,$firebaseAuth);
    },function(err){
      console.log(err);
    })
  };
  $scope.register = function(user) {
    console.log('Sign-In', user);
    // $state.go('tabs.home');
    console.log($firebaseAuth);
    var username = $scope.user.username;
    var password = $scope.user.password;
    auth.$createUserWithEmailAndPassword(username,password).then(function(user){
      console.log(user);
      checklogin($scope, $state,$firebaseAuth);
    },function(err){
      console.log(err);
    })
  };

})

.controller('HomeTabCtrl', function($scope,$firebaseAuth,$firebaseArray) {
  $scope.isnew = false;
  var date = new Date();
  var keluarharian = date.getDate()+""+(date.getMonth()+1)+""+date.getFullYear();
  var keluarbulanan = (date.getMonth()+1)+""+date.getFullYear();
  var keluartahunan = date.getFullYear();

  $scope.pengeluaran = {};

  var uid= firebase.auth().currentUser.uid;


  var pengeluaranharianRef = firebase.database().ref().child("users").child(uid).child("keluar/harian/"+keluarharian);
  var pengeluaranharianObj = $firebaseArray(pengeluaranharianRef);

  var pengeluaranbulananRef = firebase.database().ref().child("users").child(uid).child("keluar/bulanan/"+keluarbulanan);
  var pengeluaranbulananObj = $firebaseArray(pengeluaranbulananRef);

  var pengeluarantahunanRef = firebase.database().ref().child("users").child(uid).child("keluar/tahunan/"+keluartahunan);
  var pengeluarantahunanObj = $firebaseArray(pengeluarantahunanRef);


  $scope.newPengeluaran = function(){



    // var bulanantotal = parseInt(total) + $scope.pengeluaran.jumlah;
    // var tahunantotal = parseInt(total) + $scope.pengeluaran.jumlah;
      if(pengeluaranharianObj.$resolved){
        var totalhariansekarang = 0;
        if(typeof pengeluaranharianObj["total"]!='undefined'){
          totalhariansekarang = pengeluaranharianObj["total"];
        }
        console.log(pengeluaranharianObj.total);
        pengeluaranharianObj.$add($scope.pengeluaran);
        var hariantotal = parseInt(totalhariansekarang) + $scope.pengeluaran.jumlah;
        pengeluaranharianRef.update({total:hariantotal});
        console.log(pengeluaranharianObj);
      }


      pengeluaranbulananObj.$add($scope.pengeluaran);
      pengeluarantahunanObj.$add($scope.pengeluaran);

  }
});

function checklogin($scope,$state,$firebaseAuth){
  var auth = $firebaseAuth();
  auth.$onAuthStateChanged(function(user) {
     if (user) {
       console.log(user);
       $state.go('tabs.home');
     } else {
       $state.go('/sign-in');
       console.log("gagal kadal");
     }
   });
}
