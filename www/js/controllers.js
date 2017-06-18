angular.module('ionicApp.controllers', [])


.controller('SignInCtrl', function($scope, $state,$firebaseAuth,Auth) {
  checklogin($scope, $state,$firebaseAuth);

  $scope.user = {};
  var auth = $firebaseAuth();
  $scope.signIn = function(user) {

    var username = $scope.user.username;
    var password = $scope.user.password;
    Auth.$signInWithEmailAndPassword(username,password).then(function(user){
      console.log(user);
      console.log(user.uid);
      checklogin($scope, $state,$firebaseAuth);
    },function(err){
      alert("Failed: "+err.message);
    })
  };
  $scope.register = function(user) {
    console.log('Sign-In', user);
    // $state.go('tabs.home');
    console.log($firebaseAuth);
    var username = $scope.user.username;
    var password = $scope.user.password;
    Auth.$createUserWithEmailAndPassword(username,password).then(function(user){
      console.log(user);
      var kasRef = firebase.database().ref().child("users").child(user.uid).child("kassekarang");
      kasRef.set(0).then(function(scalbck){
        console.log(scalbck);
      },function(err){
        console.log(err);
      })
      checklogin($scope, $state,$firebaseAuth);
    },function(err){
      alert("Failed: "+err.message);
    })
  };

})

.controller('pemasukanCtrl', function($scope,$firebaseAuth,$firebaseArray,Auth,$state) {
  $scope.isNew = false;
  $scope.totalPengeluaranHariIni = 0;
  $scope.totalPengeluaranBulanIni = 0;
  $scope.totalPengeluaranTahunIni = 0;
  $scope.kasSekarang = 0;

  $scope.signOut = function(){
    Auth.$signOut();
    checklogin($scope, $state,$firebaseAuth);
    $state.go("signin");
  }



  var date = new Date();
  var keluarharian = date.getDate()+""+(date.getMonth()+1)+""+date.getFullYear();
  var keluarbulanan = (date.getMonth()+1)+""+date.getFullYear();
  var keluartahunan = date.getFullYear();

  $scope.pengeluaran = {};
  $scope.showDetailHarian = false;
  $scope.showDetailBulanan = false;
  $scope.showDetailTahunan = false;
  var uid= firebase.auth().currentUser.uid;
  var kasRef = firebase.database().ref().child("users").child(uid).child("kassekarang");
  kasRef.on("value",function(snapshot){
    console.log(snapshot.val());
      $scope.kasSekarang = snapshot.val();
      $scope.$apply();
  });
  var pengeluaranharianRef = firebase.database().ref().child("users").child(uid).child("masuk/harian/"+keluarharian);
  var pengeluaranharianObj = $firebaseArray(pengeluaranharianRef);
  $scope.pengeluaranharianObj = pengeluaranharianObj;
  
  var pengeluaranbulananRef = firebase.database().ref().child("users").child(uid).child("masuk/bulanan/"+keluarbulanan);
  var pengeluaranbulananObj = $firebaseArray(pengeluaranbulananRef);
  $scope.pengeluaranbulananObj = pengeluaranbulananObj;
  
  var pengeluarantahunanRef = firebase.database().ref().child("users").child(uid).child("masuk/tahunan/"+keluartahunan);
  var pengeluarantahunanObj = $firebaseArray(pengeluarantahunanRef);
  $scope.pengeluarantahunanObj = pengeluarantahunanObj;
  
  $scope.newPengeluaran = function(){
      pengeluaranharianObj.$add($scope.pengeluaran);
      pengeluaranbulananObj.$add($scope.pengeluaran);
      pengeluarantahunanObj.$add($scope.pengeluaran);

      $scope.totalPengeluaranHariIni = parseInt($scope.totalPengeluaranHariIni) + parseInt($scope.pengeluaran.jumlah);
      $scope.totalPengeluaranBulanIni = parseInt($scope.totalPengeluaranBulanIni) + parseInt($scope.pengeluaran.jumlah);
      $scope.totalPengeluaranTahunIni = parseInt($scope.totalPengeluaranTahunIni) + parseInt($scope.pengeluaran.jumlah);



       var ks = parseInt($scope.kasSekarang) + parseInt($scope.pengeluaran.jumlah);
       kasRef.set(ks);
      $scope.pengeluaran = {};
      $scope.isNew=!$scope.isNew;

  }

  pengeluaranharianObj.$loaded()
  .then(function(x) {
    // x === list; // true
    console.log(x);
    angular.forEach(pengeluaranharianObj, function(value, key) {
      console.log(value.jumlah)
      $scope.totalPengeluaranHariIni = $scope.totalPengeluaranHariIni + parseInt(value.jumlah);
    });
  })
  .catch(function(error) {
    console.log("Error:", error);
  });

  pengeluaranbulananObj.$loaded()
  .then(function(x) {
    // x === list; // true
    console.log(x);
    angular.forEach(pengeluaranbulananObj, function(value, key) {
      console.log(value.jumlah)
      $scope.totalPengeluaranBulanIni = $scope.totalPengeluaranBulanIni + parseInt(value.jumlah);
    });
  })
  .catch(function(error) {
    console.log("Error:", error);
  });

  pengeluarantahunanObj.$loaded()
  .then(function(x) {
    // x === list; // true
    console.log(x);
    angular.forEach(pengeluarantahunanObj, function(value, key) {
      console.log(value.jumlah)
      $scope.totalPengeluaranTahunIni = $scope.totalPengeluaranTahunIni + parseInt(value.jumlah);
    });
  })
  .catch(function(error) {
    console.log("Error:", error);
  });

  $scope.listpengeluaranhariini = pengeluaranharianObj;
  $scope.listpengeluaranbulanini = pengeluaranbulananObj;
  $scope.listpengeluarantahunini = pengeluarantahunanObj;
  $scope.detailHarian = function(){
    $scope.showDetailHarian = !$scope.showDetailHarian;
    console.log("kadalll");
  }
})
.controller('HomeTabCtrl', function($scope,$firebaseAuth,$firebaseArray,Auth,$state) {
  $scope.$on("$ionicView.beforeEnter", function(event) {

                    $scope.isNew = false;
                    $scope.totalPengeluaranHariIni = 0;
                    $scope.totalPengeluaranBulanIni = 0;
                    $scope.totalPengeluaranTahunIni = 0;
                    $scope.kasSekarang = 0
                    $scope.isloadingtotaltaharian = true;
                    $scope.isloadingtotaltabulanan = true;
                    $scope.isloadingtotaltahunan = true;
                    $scope.signOut = function(){
                      Auth.$signOut();
                      checklogin($scope, $state,$firebaseAuth);
                      $state.go("signin");
                    }



                    var date = new Date();
                    var keluarharian = date.getDate()+""+(date.getMonth()+1)+""+date.getFullYear();
                    var keluarbulanan = (date.getMonth()+1)+""+date.getFullYear();
                    var keluartahunan = date.getFullYear();

                    $scope.pengeluaran = {};
                    $scope.showDetailHarian = false;
                    $scope.showDetailBulanan = false;
                    $scope.showDetailTahunan = false;
                    var uid= firebase.auth().currentUser.uid;
                    var kasRef = firebase.database().ref().child("users").child(uid).child("kassekarang");
                    kasRef.on("value",function(snapshot){
                      console.log(snapshot.val());
                        $scope.kasSekarang = snapshot.val();
                        $scope.$apply();
                    });

                    var pengeluaranharianRef = firebase.database().ref().child("users").child(uid).child("keluar/harian/"+keluarharian);
                    var pengeluaranharianObj = $firebaseArray(pengeluaranharianRef);
                    $scope.pengeluaranharianObj = pengeluaranharianObj;

                    var pengeluaranbulananRef = firebase.database().ref().child("users").child(uid).child("keluar/bulanan/"+keluarbulanan);
                    var pengeluaranbulananObj = $firebaseArray(pengeluaranbulananRef);
                    $scope.pengeluaranbulananObj = pengeluaranbulananObj;

                    var pengeluarantahunanRef = firebase.database().ref().child("users").child(uid).child("keluar/tahunan/"+keluartahunan);
                    var pengeluarantahunanObj = $firebaseArray(pengeluarantahunanRef);
                    $scope.pengeluarantahunanObj = pengeluarantahunanObj;

                    $scope.newPengeluaran = function(){
                        pengeluaranharianObj.$add($scope.pengeluaran);
                        pengeluaranbulananObj.$add($scope.pengeluaran);
                        pengeluarantahunanObj.$add($scope.pengeluaran);

                        $scope.totalPengeluaranHariIni = $scope.totalPengeluaranHariIni + parseInt($scope.pengeluaran.jumlah);
                        $scope.totalPengeluaranBulanIni = $scope.totalPengeluaranBulanIni + parseInt($scope.pengeluaran.jumlah);
                        $scope.totalPengeluaranTahunIni = $scope.totalPengeluaranTahunIni + parseInt($scope.pengeluaran.jumlah);


                        var ks = $scope.kasSekarang - parseInt($scope.pengeluaran.jumlah);
                        kasRef.set(ks);


                        $scope.pengeluaran = {};
                        $scope.isNew=!$scope.isNew;

                    }

                    pengeluaranharianObj.$loaded()
                    .then(function(x) {
                      // x === list; // true
                      console.log(x);
                      angular.forEach(pengeluaranharianObj, function(value, key) {
                        console.log(value.jumlah)
                        $scope.totalPengeluaranHariIni = $scope.totalPengeluaranHariIni + parseInt(value.jumlah);
                        $scope.isloadingtotaltaharian = false;
                      });
                    })
                    .catch(function(error) {
                      console.log("Error:", error);
                    });

                    pengeluaranbulananObj.$loaded()
                    .then(function(x) {
                      // x === list; // true
                      console.log(x);
                      angular.forEach(pengeluaranbulananObj, function(value, key) {
                        console.log(value.jumlah)
                        $scope.totalPengeluaranBulanIni = $scope.totalPengeluaranBulanIni + parseInt(value.jumlah);
                        $scope.isloadingtotaltabulanan = false;
                      });
                    })
                    .catch(function(error) {
                      console.log("Error:", error);
                    });

                    pengeluarantahunanObj.$loaded()
                    .then(function(x) {
                      // x === list; // true
                      console.log(x);
                      angular.forEach(pengeluarantahunanObj, function(value, key) {
                        console.log(value.jumlah)
                        $scope.totalPengeluaranTahunIni = $scope.totalPengeluaranTahunIni + parseInt(value.jumlah);
                        $scope.isloadingtotaltahunan = false;
                      });
                    })
                    .catch(function(error) {
                      console.log("Error:", error);
                    });

                    $scope.listpengeluaranhariini = pengeluaranharianObj;
                    $scope.listpengeluaranbulanini = pengeluaranbulananObj;
                    $scope.listpengeluarantahunini = pengeluarantahunanObj;
                    $scope.detailHarian = function(){
                      $scope.showDetailHarian = !$scope.showDetailHarian;
                      console.log("kadalll");
                    }
  });
})
.controller("settingCtrl",function($scope,$state,Auth,$firebaseArray,$firebaseAuth){
  var uid=firebase.auth().currentUser.uid;
  var kasRef = firebase.database().ref().child("users").child(uid).child("kassekarang");
  $scope.kas = {};
  kasRef.on("value",function(snapshot){
    console.log(snapshot.val());
      $scope.kasSekarang = snapshot.val();
      if(!$scope.$$phase) {
        $scope.$apply();
          //$digest or $apply
        }
        $scope.kas = {};
  });

  $scope.setKas = function(kas){
    kasRef.set($scope.kas.kassekarang).then(function(snapshot){
      console.log("Berhasil Diubah");
    });
  }

  $scope.signOut = function(){
    Auth.$signOut();
    checklogin($scope, $state,$firebaseAuth);
    $state.go("signin");
  }


});

function checklogin($scope,$state,$firebaseAuth){
  var auth = $firebaseAuth();
  auth.$onAuthStateChanged(function(user) {
     if (user) {
       console.log(user);
       $state.go('tabs.home');
     } else {
       console.log("gagal kadal");
     }
   });
}
