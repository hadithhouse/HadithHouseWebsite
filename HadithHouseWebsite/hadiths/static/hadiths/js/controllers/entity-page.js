/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 Rafid Khalid Al-Humaimidi
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/// <reference path="../../../../../TypeScriptDefs/angularjs/angular.d.ts" />
/// <reference path="../../../../../TypeScriptDefs/angular-material/angular-material.d.ts" />
/// <reference path="../app.ts" />
/// <reference path="../services/services.ts" />
var HadithHouse;
(function (HadithHouse) {
    var Controllers;
    (function (Controllers) {
        var EntityPageCtrl = (function () {
            function EntityPageCtrl($scope, $rootScope, $location, $routeParams, EntityResource, ToastService) {
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.$location = $location;
                this.$routeParams = $routeParams;
                this.EntityResource = EntityResource;
                this.ToastService = ToastService;
                if (this.$routeParams.id === 'new') {
                    this.setAddingNewBookMode();
                }
                else {
                    this.setOpeningExitingBookMode(this.$routeParams.id);
                }
            }
            EntityPageCtrl.prototype.setAddingNewBookMode = function () {
                this.entity = this.newEntity();
                this.addingNew = true;
                this.isEditing = true;
            };
            EntityPageCtrl.prototype.setOpeningExitingBookMode = function (id) {
                this.entity = this.EntityResource.get({ id: id });
                this.addingNew = false;
                this.isEditing = false;
            };
            /**
             * Called when the user clicks on the edit icon to start editing the entity.
             */
            EntityPageCtrl.prototype.startEditing = function () {
                this.copyEntity();
                this.isEditing = true;
            };
            /**
             * Called when the user clicks on the save icon to save the changes made.
             */
            EntityPageCtrl.prototype.finishEditing = function () {
                var _this = this;
                // Send the changes to the server.
                this.entity.$save(function (result) {
                    if (_this.addingNew) {
                        _this.$location.path('book/' + _this.entity.id);
                    }
                    // Successfully saved changes. Don't need to do anything.
                    _this.isEditing = false;
                    _this.addingNew = false;
                    _this.ToastService.show("Successful.");
                }, function (result) {
                    if (result.data) {
                        _this.ToastService.showDjangoError("Failed to save changes. Error was: ", result.data);
                    }
                    else {
                        _this.ToastService.show("Failed to save changes. Please try again.");
                    }
                });
            };
            ;
            /**
             * Called when the user clicks on the X icon to cancel the changes made.
             */
            EntityPageCtrl.prototype.cancelEditing = function () {
                this.isEditing = false;
                this.restoreEntity();
            };
            ;
            return EntityPageCtrl;
        })();
        Controllers.EntityPageCtrl = EntityPageCtrl;
    })(Controllers = HadithHouse.Controllers || (HadithHouse.Controllers = {}));
})(HadithHouse || (HadithHouse = {}));
//# sourceMappingURL=entity-page.js.map