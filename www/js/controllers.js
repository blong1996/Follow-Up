angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

  .controller('AppCtrl', function($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function() {
        $scope.closeLogin();
      }, 1000);
    };
  })


  .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})
  .controller('AccountCtrl', function($scope){

    var me = this;
    me.firstname = '';
    me.lastname = '';

    $scope.testFunct = function() {
      $('#fname').val('Brandon');
      $('#lname').val('Long');
      me.firstname = 'Brandon';
      me.lastname = 'Long';
    }
    angular.module('starter')
      .controller('HomeController', ['$scope', '$ionicModal', '$cordovaFile', '$cordovaFileTransfer', '$cordovaCamera', HomeController]);



    function HomeController($scope, $ionicModal, $cordovaFile, $cordovaFileTransfer, $cordovaCamera){


      var me = this;
      me.firstname = '';
      me.lastname = '';
      me.current_image = 'img/IMG_1261.JPG';
      me.image_description = '';

      var api_key = '5ea0ede9-1dfa-418b-941d-d7466e62e9ab';

      $scope.testFunct = function() {
        me.firstname = 'Brandon';
        me.lastname = 'Long';
      }

      $scope.readURL = function(input) {
        if (input.files && input.files[0]) {
          var reader = new FileReader();

          reader.onload = function (e) {
            $('#blah')
              .attr('src', e.target.result)
              .width(150)
              .height(200);
          };

          console.log("READURL");
          reader.readAsDataURL(input.files[0]);
        }
      }


      $scope.takePicture = function(){


        var options = {
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          targetWidth: 500,
          targetHeight: 500,
          correctOrientation: true,
          cameraDirection: 0,
          encodingType: Camera.EncodingType.JPEG
        };

        $cordovaCamera.getPicture(options).then(function(imagedata){
          me.firstname = 'Brandon';
          me.lastname = 'Long';
          me.current_image = "data:image/jpeg;base64," + imagedata;
          me.image_description = '';
          me.locale = '';

          var vision_api_json = {
            "requests":[
              {
                "image":{
                  "content": imagedata
                },
                "features":[
                  {
                    "type": me.detection_type,
                    "maxResults": 1
                  }
                ]
              }
            ]
          };

          var file_contents = JSON.stringify(vision_api_json);

          $cordovaFile.writeFile(
            cordova.file.applicationStorageDirectory,
            'file.json',
            file_contents,
            true
          ).then(function(result){

            var headers = {
              'Content-Type': 'application/json'
            };

            options.headers = headers;

            var server = 'http://app1.idware.net/DriverLicenseParser.svc' + api_key;
            var filePath = cordova.file.applicationStorageDirectory + 'file.json';

            $cordovaFileTransfer.upload(server, filePath, options, true)
              .then(function(result){

                var res = JSON.parse(result.response);
                var key = me.detection_types[me.detection_type] + 'Annotations';

                me.image_description = res.responses[0][key][0].description;
              }, function(err){
                alert('An error occurred while uploading the file');
              });
          }, function(err){
            alert('An error occurred while trying to write the file');
          });

        }, function(err){
          alert('An error occurred getting the picture from the camera');
        });
      }
    }
  });



(function() {
  $('form.require-validation').bind('submit', function(e) {
    var $form  = $(e.target).closest('form'),
      inputSelector = ['input[type=email]', 'input[type=password]',
        'input[type=text]', 'input[type=file]',
        'textarea'].join(', '),
      $inputs  = $form.find('.required').find(inputSelector),
      $errorMessage = $form.find('div.error'),
      valid         = true;

    $errorMessage.addClass('hide');
    $('.has-error').removeClass('has-error');
    $inputs.each(function(i, el) {
      var $input = $(el);
      if ($input.val() === '') {
        $input.parent().addClass('has-error');
        $errorMessage.removeClass('hide');
        e.preventDefault(); // cancel on first error
      }
    });
  });
});
