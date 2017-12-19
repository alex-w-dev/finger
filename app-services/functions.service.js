(function () {
    'use strict';

    angular
        .module('app')
        .factory('FingerFunctions', FingerFunctions);

    //FingerFunctions.$inject = ['$http'];
    function FingerFunctions() {
        return {
            randomNumber : function(m,n){
              m = parseInt(m);
              n = parseInt(n);
              return Math.floor( Math.random() * (n - m + 1) ) + m;
            },

            toFixed : function(value,n){
              var m = 1;
              for (var i = 0; i < n; i++) {
                m *=10;
              };
              return Math.round((value)*m)/m;
            },

            eazyComparison : function(a1,a2){
              var a=[], diff=[];
              for(var i=a2.length;i<a1.length;i++){
                diff.push(a1[i]);
              }
              return diff
            },

            saveText : function(string,key){
              var string_arr = string.split('');
              var key_arr = key.split('');
              key_arr = key_arr.sort();
              key_arr = key_arr.reverse();
              //alert(key_arr);
              //alert(string_arr);
              var normal_text = new Array();
              var temp_word = new Array();
              var k = 0
              //var wordLength = key_arr[1];
              var wordIndex = key_arr[1]-1;
              //alert(wordIndex);
              for(var i = 0; i < string_arr.length; i++){
                if(i == wordIndex){
                  temp_word.push(string_arr[i]);
                  normal_text.push(temp_word[key_arr[3]]);

                  //alert( wordIndex);
                  if(k %  key_arr[2] == 0)wordIndex += parseInt(key_arr[0]);
                  else wordIndex += parseInt(key_arr[1]);
                  k++;
                  temp_word = new Array();
                }else{
                  temp_word.push(string_arr[i]);
                }
              }
              return normal_text;
              //alert(normal_text);
            }


        }
    }


    angular.module('app')
    .directive('buttonHover', function () {
        return function(scope,element,attrs){
          var background = $(element).css('background');
          var button = $('<div />');
          $(element).html(button);

          button.css({
            width: '100%',
            height: '100%',
            background: background
          });
          $(element).css({
            background: 'none'
          });

          $(element).hover(function() {
            button.css({
              zoom: '1'
            });
          }, function() {
            button.css({
              zoom: '.95'
            });
          });
        }
    });

})();
