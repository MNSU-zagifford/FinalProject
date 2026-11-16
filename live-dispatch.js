// ========================================================
// CIS 483 / 583 - MNSU CampusEco
// Phase 3: Task 3.3 - AngularJS Two-Way Data Binding
// Author: Pratik Niroula
// ========================================================

// Module matching ng-app="campusEcoLive"
angular.module("campusEcoLive", [])
  .controller("LiveController", ["$scope", function ($scope) {
    // Default model variables
    $scope.note = "All priority packages sorted for the afternoon route.";
    $scope.view = "active";
  }]);
