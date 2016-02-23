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
/// <reference path="../../../../../TypeScriptDefs/angularjs/angular-resource.d.ts" />
/// <reference path="../../../../../TypeScriptDefs/lodash/lodash.d.ts" />
/// <reference path="../services/services.ts" />


module HadithHouse.Directives {

  import IQService = angular.IQService;
  import IScope = angular.IScope;
  import IPersonResource = HadithHouse.Services.IPersonResource;
  import IBookResource = HadithHouse.Services.IBookResource;
  import IHadithTagResource = HadithHouse.Services.IHadithTagResource;
  import IEntity = HadithHouse.Services.IEntity;
  import IResourceArray = angular.resource.IResourceArray;

  export class SelectorCtrl {
    EntityResource:ng.resource.IResourceClass<IEntity>;
    ids:any;
    entities:any;
    type:any;
    singleSelect:any;

    constructor(private $scope:IScope,
                private PersonResource:IPersonResource,
                private BookResource:IBookResource,
                private HadithTagResource:IHadithTagResource) {

      if (!this.ids) {
        if (this.singleSelect) {
          this.ids = null;
        } else {
          this.ids = [];
        }
      }

      if (!this.entities) {
        this.entities = [];
      }

      if (!this.type || typeof(this.type) !== 'string') {
        throw 'Selector must have its type attribute set to a string.';
      }

      switch (this.type.toLowerCase()) {
        case 'person':
          this.EntityResource = PersonResource;
          break;

        case 'book':
          this.EntityResource = BookResource;
          break;

        case 'hadithtag':
          this.EntityResource = HadithTagResource;
          break;

        default:
          throw 'Invalid type for selector.';
      }


      $scope.$watch('ctrl.ids', this.onIdsChanged);
      $scope.$watchCollection('ctrl.ids', this.onIdsChanged);


      $scope.$watch('ctrl.entities', this.onEntitiesChanged);
      $scope.$watchCollection('ctrl.entities', this.onEntitiesChanged);

    }

    private onIdsChanged = (newValue, oldValue) => {
      if (newValue && oldValue && newValue.toString() === oldValue.toString()) {
        return;
      }
      if (this.singleSelect) {
        if (this.ids !== null) {
          this.entities = [this.ids].map((id) => {
            // See if we already have the entity loaded, otherwise make a request to load it.
            return _.find<IEntity>(this.entities, (e) => {
                return e.id == id;
              }) || this.EntityResource.get({id: id}, (e) => {
              });
          });
        } else {
          this.entities = [];
        }
      } else {
        this.entities = this.ids.map((id) => {
          // See if we already have the entity loaded, otherwise make a request to load it.
          return _.find<IEntity>(this.entities, (e) => {
              return e.id == id;
            }) || this.EntityResource.get({id: id});
        });
      }
    }

    private onEntitiesChanged = (newValue, oldValue) => {
      if (this.entities) {
        // If the control only allows single select, we remove every elements
        // before the last.
        if (this.singleSelect === true) {
          // Single select mode, so only allow one entity to be selected and delete previous ones.
          if (this.entities.length > 1) {
            this.entities.splice(0, this.entities.length - 1);
          }
          if (this.entities.length == 1) {
            // Ensure that the resource has been resolved before updating the scope's ID
            if (typeof(this.entities[0].id) === 'number') {
              this.ids = this.entities[0].id;
            }
          } else {
            this.ids = null;
          }
        } else {
          if (_.every(this.entities, (e:any) => {
              return typeof(e.id) === 'number';
            })) {
            this.ids = this.entities.map((entity) => {
              return entity.id;
            });
          }
        }
      }
    }

    filterPersons(persons, query) {
      return persons.filter((person) => {
        return (person.title.indexOf(query) > -1 ||
        (person.display_name && person.display_name.indexOf(query) > -1) ||
        (person.full_name && person.full_name.indexOf(query) > -1) ||
        (person.brief_desc && person.brief_desc.indexOf(query) > -1));
      });
    }

    filterBooks(books, query) {
      return books.filter((book) => {
        return (book.title.indexOf(query) > -1);
      });
    }

    filterHadithTags(hadithTags:any, query) {
      return hadithTags.filter((tag) => {
        return tag.name.indexOf(query) > -1 &&
          _.map(hadithTags, (t:any) => {
            return t.name;
          }).indexOf(query) == -1;
      });
    }

    public findEntities(query) {
      return this.EntityResource.query({search: query});
    };

    public entityToString = (entity) => {
      switch (this.type.toLowerCase()) {
        case 'person':
          return entity.display_name || entity.full_name;

        case 'book':
          return entity.title;

        case 'hadithtag':
          return entity.name;

        default:
          throw 'Unreachable code';
      }
    }
  }

  HadithHouseApp.controller('SelectorCtrl',
    ['$scope', 'PersonResource', 'BookResource', 'HadithTagResource', SelectorCtrl]);

  // TODO: Consider creating a class for this.
  HadithHouseApp.directive('hhSelector', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: getHtmlBasePath() + 'directives/selector.directive.html',
      controller: 'SelectorCtrl',
      controllerAs: 'ctrl',
      bindToController: true,
      scope: {
        ids: '=',
        type: '@',
        readOnly: '=',
        singleSelect: '='
      }
    };

  });
}