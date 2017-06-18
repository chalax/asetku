angular.module('ionicApp', ['ionic','ionicApp.controllers','firebase','ionicApp.services'])

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

  var config = {
    apiKey: "AIzaSyA7fi06i9Yga8aR5VmqVQqeCgo-gX98pdw",
    authDomain: "asetku-5e77d.firebaseapp.com",
    databaseURL: "https://asetku-5e77d.firebaseio.com",
    projectId: "asetku-5e77d",
    storageBucket: "asetku-5e77d.appspot.com",
    messagingSenderId: "1048403566031"
  };
  firebase.initializeApp(config);
  var defaultAuth = firebase.auth();
  $ionicConfigProvider.views.maxCache(0);
  $stateProvider
    .state('signin', {
      url: '/sign-in',
      templateUrl: 'templates/sign-in.html',
      controller: 'SignInCtrl'
    })
    .state('forgotpassword', {
      url: '/forgot-password',
      templateUrl: 'templates/forgot-password.html'
    })
    .state('tabs', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })
    .state('tabs.home', {
      url: '/home',
      views: {
        'home-tab': {
          templateUrl: 'templates/tabscontent/home.html',
          controller: 'HomeTabCtrl',
          resolve: {
            // controller will not be loaded until $requireSignIn resolves
            // Auth refers to our $firebaseAuth wrapper in the factory below
            "currentAuth": ["Auth", function(Auth) {
              // $requireSignIn returns a promise so the resolve waits for it to complete
              // If the promise is rejected, it will throw a $stateChangeError (see above)
              return Auth.$requireSignIn();
            }]
          }
        }
      }
    })
    .state('tabs.pemasukan', {
      url: '/pemasukan',
      views: {
        'pemasukan-tab': {
          templateUrl: 'templates/tabscontent/pemasukan.html',
          controller:"pemasukanCtrl",
          resolve: {
            // controller will not be loaded until $requireSignIn resolves
            // Auth refers to our $firebaseAuth wrapper in the factory below
            "currentAuth": ["Auth", function(Auth) {
              // $requireSignIn returns a promise so the resolve waits for it to complete
              // If the promise is rejected, it will throw a $stateChangeError (see above)
              return Auth.$requireSignIn();
            }]
          }
        }
      }
    })
    .state('tabs.setting', {
      url: '/setting',
      views: {
        'setting-tab': {
          templateUrl: 'templates/tabscontent/setting.html',
          controller:"settingCtrl",
          resolve: {
            // controller will not be loaded until $requireSignIn resolves
            // Auth refers to our $firebaseAuth wrapper in the factory below
            "currentAuth": ["Auth", function(Auth) {
              // $requireSignIn returns a promise so the resolve waits for it to complete
              // If the promise is rejected, it will throw a $stateChangeError (see above)
              return Auth.$requireSignIn();
            }]
          }
        }
      }
    })



    $urlRouterProvider.otherwise('/tab/home');

})
.run(["$rootScope", "$state", function($rootScope, $state) {
  $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
    // We can catch the error thrown when the $requireSignIn promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
      $state.go("signin");
    }
  });
}]);
