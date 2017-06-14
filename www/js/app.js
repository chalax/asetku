angular.module('ionicApp', ['ionic','ionicApp.controllers','firebase'])

.config(function($stateProvider, $urlRouterProvider) {

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
          controller: 'HomeTabCtrl'
        }
      }
    })
    .state('tabs.facts', {
      url: '/facts',
      views: {
        'home-tab': {
          templateUrl: 'templates/facts.html'
        }
      }
    })
    .state('tabs.facts2', {
      url: '/facts2',
      views: {
        'home-tab': {
          templateUrl: 'templates/facts2.html'
        }
      }
    })
    .state('tabs.about', {
      url: '/about',
      views: {
        'about-tab': {
          templateUrl: 'templates/about.html'
        }
      }
    })
    .state('tabs.navstack', {
      url: '/navstack',
      views: {
        'about-tab': {
          templateUrl: 'templates/nav-stack.html'
        }
      }
    })
    .state('tabs.contact', {
      url: '/contact',
      views: {
        'contact-tab': {
          templateUrl: 'templates/contact.html'
        }
      }
    });


    $urlRouterProvider.otherwise('/sign-in');

});
