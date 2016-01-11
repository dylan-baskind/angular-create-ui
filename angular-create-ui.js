(function() {

    var module = angular.module('create-ui', []);

  /**
   * A Better method for creating re-usable 'widgets'.
   *
   *  1. The default template is /static/{{template}}.ng.html
   *  2. If you want to provide custom initialisation logic, provide a $init method.
   *     This is called every time the widget is rendered, and is the place to
   *     set up any hooks/scope watches etc. The $init method gets given the
   *     current angular scope.
   *
   * @param template (eg. report, richTextEditor, etc.)
   * @param object The views 'model object'
   */
  module.factory('createUi', function() {
    return function createUi(template, model) {
      model.$templateUrl = template;

      if (!model.hasOwnProperty('$init')) {
        model.$init = angular.noop;
      }

      return model;
    };
  })

  /**
   * Usage:
   *   <ui ui='object_created_with_create_ui' [src='/path/to/different/template.html']></ui>
   */
  .directive('ui', function() {
    return {
      template: '<ng-include src="templateUrl()"></ng-include>',
      restrict: 'EA',
      scope: {
        ui: '=',
      },
      link: function(scope, element, attrs) {
        scope.$watch('ui', function(ui) {
          if (ui && ui.$init) {
            scope.ui.$init(scope);
          }
        });

        scope.$watch(function() { return attrs.tpl}, function(tpl) {
            scope.tpl = tpl;
          });
        scope.templateUrl = function() {
          return scope.tpl || (scope.ui && scope.ui.$templateUrl) || '';
        };
      }
    };
  })

})();
