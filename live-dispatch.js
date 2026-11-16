// ========================================================
// CIS 483 / 583 - MNSU CampusEco
// Phase 3: Task 3.3 - AngularJS Two-Way Data Binding
// Author: Pratik Niroula & Team
// ========================================================

angular.module("campusEcoLive", [])
  .controller("LiveController", ["$scope", function ($scope) {
    // Two-way bound model variables
    $scope.note = "EcoCart 04 en route to Centennial Student Union with priority packages.";
    $scope.view = "active";
    $scope.maxChars = 120;

    // Quick courier dispatch presets
    $scope.presets = [
      "EcoCart 04 arriving at Centennial Student Union (Suite 173).",
      "Julia Sears & Preska Hall deliveries completed.",
      "Advisory: Electric carts operating on primary pedestrian corridors.",
      "Afternoon priority packages staged at Ellis Avenue Logistics Hub."
    ];

    // Method demonstrating two-way model-view synchronization
    $scope.applyPreset = function (text) {
      $scope.note = text;
    };

    // Dynamic character counter
    $scope.charsLeft = function () {
      return $scope.maxChars - ($scope.note ? $scope.note.length : 0);
    };

    $scope.clearNote = function () {
      $scope.note = "";
    };
  }]);
