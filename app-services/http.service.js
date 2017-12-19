/*
Use it FOR CHANGE CONFIG OF YOUR APPLICATION
'use strict';

// change default settings
var app = angular.module( 'app', [ ... ]);

app

    .config( function( $httpProvider ) {    // [url]http://habrahabr.ru/post/181009/[/url]
        $httpProvider.defaults.headers.post[ 'Content-Type' ] = 'application/x-www-form-urlencoded;charset=utf-8';
        $httpProvider.defaults.transformRequest = function( data ) {
            return angular.isObject( data ) && String( data ) !== '[object File]' ? angular.toParam( data ) : data;
        };
    });*/



'use strict';

(function() {

    angular.extend( angular, {
        toParam: toParam
    });

/**
 * Преобразует объект, массив или массив объектов в строку,
 * которая соответствует формату передачи данных через url
 * Почти эквивалент [url]http://api.jquery.com/jQuery.param/[/url]
 * Источник [url]http://stackoverflow.com/questions/1714786/querystring-encoding-of-a-javascript-object/1714899#1714899[/url]
 *
 * @param object
 * @param [prefix]
 * @returns {string}
 */
function toParam( object, prefix ) {
    var stack = [];
    var value;
    var key;

    for( key in object ) {
        value = object[ key ];
        key = prefix ? prefix + '[' + key + ']' : key;

        if ( value === null ) {
            value = encodeURIComponent( key ) + '=';
        } else if ( typeof( value ) !== 'object' ) {
            value = encodeURIComponent( key ) + '=' + encodeURIComponent( value );
        } else {
            value = toParam( value, key );
        }

        stack.push( value );
    }

    return stack.join( '&' );
}

}());