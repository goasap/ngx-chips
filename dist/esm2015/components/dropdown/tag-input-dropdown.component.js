import { __awaiter } from "tslib";
import { Component, ContentChildren, HostListener, Injector, Input, TemplateRef, ViewChild } from '@angular/core';
import { filter, first, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Ng2Dropdown } from 'ng2-material-dropdown';
import { defaults } from '../../defaults';
import { TagInputComponent } from '../tag-input/tag-input';
export class TagInputDropdown {
    constructor(injector) {
        this.injector = injector;
        /**
         * @name offset
         */
        this.offset = defaults.dropdown.offset;
        /**
         * @name focusFirstElement
         */
        this.focusFirstElement = defaults.dropdown.focusFirstElement;
        /**
         * - show autocomplete dropdown if the value of input is empty
         * @name showDropdownIfEmpty
         */
        this.showDropdownIfEmpty = defaults.dropdown.showDropdownIfEmpty;
        /**
         * - desc minimum text length in order to display the autocomplete dropdown
         * @name minimumTextLength
         */
        this.minimumTextLength = defaults.dropdown.minimumTextLength;
        /**
         * - number of items to display in the autocomplete dropdown
         * @name limitItemsTo
         */
        this.limitItemsTo = defaults.dropdown.limitItemsTo;
        /**
         * @name displayBy
         */
        this.displayBy = defaults.dropdown.displayBy;
        /**
         * @name identifyBy
         */
        this.identifyBy = defaults.dropdown.identifyBy;
        /**
         * @description a function a developer can use to implement custom matching for the autocomplete
         * @name matchingFn
         */
        this.matchingFn = defaults.dropdown.matchingFn;
        /**
         * @name appendToBody
         */
        this.appendToBody = defaults.dropdown.appendToBody;
        /**
         * @name keepOpen
         * @description option to leave dropdown open when adding a new item
         */
        this.keepOpen = defaults.dropdown.keepOpen;
        /**
         * @name dynamicUpdate
         */
        this.dynamicUpdate = defaults.dropdown.dynamicUpdate;
        /**
         * @name zIndex
         */
        this.zIndex = defaults.dropdown.zIndex;
        /**
         * list of items that match the current value of the input (for autocomplete)
         * @name items
         */
        this.items = [];
        /**
         * @name tagInput
         */
        this.tagInput = this.injector.get(TagInputComponent);
        /**
         * @name _autocompleteItems
         */
        this._autocompleteItems = [];
        /**
         *
         * @name show
         */
        this.show = () => {
            const maxItemsReached = this.tagInput.items.length === this.tagInput.maxItems;
            const value = this.getFormValue();
            const hasMinimumText = value.trim().length >= this.minimumTextLength;
            const position = this.calculatePosition();
            const items = this.getMatchingItems(value);
            const hasItems = items.length > 0;
            const isHidden = this.isVisible === false;
            const showDropdownIfEmpty = this.showDropdownIfEmpty && hasItems && !value;
            const isDisabled = this.tagInput.disable;
            const shouldShow = isHidden && ((hasItems && hasMinimumText) || showDropdownIfEmpty);
            const shouldHide = this.isVisible && !hasItems;
            if (this.autocompleteObservable && hasMinimumText) {
                return this.getItemsFromObservable(value);
            }
            if ((!this.showDropdownIfEmpty && !value) ||
                maxItemsReached ||
                isDisabled) {
                return this.dropdown.hide();
            }
            this.setItems(items);
            if (shouldShow) {
                this.dropdown.show(position);
            }
            else if (shouldHide) {
                this.hide();
            }
        };
        /**
         * @name requestAdding
         * @param item {Ng2MenuItem}
         */
        this.requestAdding = (item) => __awaiter(this, void 0, void 0, function* () {
            const tag = this.createTagModel(item);
            yield this.tagInput.onAddingRequested(true, tag).catch(() => { });
        });
        /**
         * @name resetItems
         */
        this.resetItems = () => {
            this.items = [];
        };
        /**
         * @name getItemsFromObservable
         * @param text
         */
        this.getItemsFromObservable = (text) => {
            this.setLoadingState(true);
            const subscribeFn = (data) => {
                // hide loading animation
                this.setLoadingState(false)
                    // add items
                    .populateItems(data);
                this.setItems(this.getMatchingItems(text));
                if (this.items.length) {
                    this.dropdown.show(this.calculatePosition());
                }
                else {
                    this.dropdown.hide();
                }
            };
            this.autocompleteObservable(text)
                .pipe(first())
                .subscribe(subscribeFn, () => this.setLoadingState(false));
        };
    }
    /**
     * @name autocompleteItems
     * @param items
     */
    set autocompleteItems(items) {
        this._autocompleteItems = items;
    }
    /**
     * @name autocompleteItems
     * @desc array of items that will populate the autocomplete
     */
    get autocompleteItems() {
        const items = this._autocompleteItems;
        if (!items) {
            return [];
        }
        return items.map((item) => {
            return typeof item === 'string'
                ? {
                    [this.displayBy]: item,
                    [this.identifyBy]: item
                }
                : item;
        });
    }
    /**
     * @name ngAfterviewInit
     */
    ngAfterViewInit() {
        this.onItemClicked().subscribe((item) => {
            this.requestAdding(item);
        });
        // reset itemsMatching array when the dropdown is hidden
        this.onHide().subscribe(this.resetItems);
        const DEBOUNCE_TIME = 200;
        const KEEP_OPEN = this.keepOpen;
        this.tagInput.onTextChange
            .asObservable()
            .pipe(distinctUntilChanged(), debounceTime(DEBOUNCE_TIME), filter((value) => {
            if (KEEP_OPEN === false) {
                return value.length > 0;
            }
            return true;
        }))
            .subscribe(this.show);
    }
    /**
     * @name updatePosition
     */
    updatePosition() {
        const position = this.tagInput.inputForm.getElementPosition();
        this.dropdown.menu.updatePosition(position, this.dynamicUpdate);
    }
    /**
     * @name isVisible
     */
    get isVisible() {
        return this.dropdown.menu.dropdownState.menuState.isVisible;
    }
    /**
     * @name onHide
     */
    onHide() {
        return this.dropdown.onHide;
    }
    /**
     * @name onItemClicked
     */
    onItemClicked() {
        return this.dropdown.onItemClicked;
    }
    /**
     * @name selectedItem
     */
    get selectedItem() {
        return this.dropdown.menu.dropdownState.dropdownState.selectedItem;
    }
    /**
     * @name state
     */
    get state() {
        return this.dropdown.menu.dropdownState;
    }
    /**
     * @name hide
     */
    hide() {
        this.resetItems();
        this.dropdown.hide();
    }
    /**
     * @name scrollListener
     */
    scrollListener() {
        if (!this.isVisible || !this.dynamicUpdate) {
            return;
        }
        this.updatePosition();
    }
    /**
     * @name onWindowBlur
     */
    onWindowBlur() {
        this.dropdown.hide();
    }
    /**
     * @name getFormValue
     */
    getFormValue() {
        const formValue = this.tagInput.formValue;
        return formValue ? formValue.toString().trim() : '';
    }
    /**
     * @name calculatePosition
     */
    calculatePosition() {
        return this.tagInput.inputForm.getElementPosition();
    }
    /**
     * @name createTagModel
     * @param item
     */
    createTagModel(item) {
        const display = typeof item.value === 'string' ? item.value : item.value[this.displayBy];
        const value = typeof item.value === 'string' ? item.value : item.value[this.identifyBy];
        return Object.assign(Object.assign({}, item.value), { [this.tagInput.displayBy]: display, [this.tagInput.identifyBy]: value });
    }
    /**
     *
     * @param value {string}
     */
    getMatchingItems(value) {
        if (!value && !this.showDropdownIfEmpty) {
            return [];
        }
        const dupesAllowed = this.tagInput.allowDupes;
        return this.autocompleteItems.filter((item) => {
            const hasValue = dupesAllowed
                ? false
                : this.tagInput.tags.some(tag => {
                    const identifyBy = this.tagInput.identifyBy;
                    const model = typeof tag.model === 'string' ? tag.model : tag.model[identifyBy];
                    return model === item[this.identifyBy];
                });
            return this.matchingFn(value, item) && hasValue === false;
        });
    }
    /**
     * @name setItems
     */
    setItems(items) {
        this.items = items.slice(0, this.limitItemsTo || items.length);
    }
    /**
     * @name populateItems
     * @param data
     */
    populateItems(data) {
        this.autocompleteItems = data.map(item => {
            return typeof item === 'string'
                ? {
                    [this.displayBy]: item,
                    [this.identifyBy]: item
                }
                : item;
        });
        return this;
    }
    /**
     * @name setLoadingState
     * @param state
     */
    setLoadingState(state) {
        this.tagInput.isLoading = state;
        return this;
    }
}
TagInputDropdown.decorators = [
    { type: Component, args: [{
                selector: 'tag-input-dropdown',
                template: "<ng2-dropdown [dynamicUpdate]=\"dynamicUpdate\">\n    <ng2-dropdown-menu [focusFirstElement]=\"focusFirstElement\"\n                       [zIndex]=\"zIndex\"\n                       [appendToBody]=\"appendToBody\"\n                       [offset]=\"offset\">\n        <ng2-menu-item *ngFor=\"let item of items; let index = index; let last = last\"\n                       [value]=\"item\"\n                       [ngSwitch]=\"!!templates.length\">\n\n            <span *ngSwitchCase=\"false\"\n                  [innerHTML]=\"item[displayBy] | highlight : tagInput.inputForm.value.value\">\n            </span>\n\n            <ng-template *ngSwitchDefault\n                      [ngTemplateOutlet]=\"templates.first\"\n                      [ngTemplateOutletContext]=\"{ item: item, index: index, last: last }\">\n            </ng-template>\n        </ng2-menu-item>\n    </ng2-dropdown-menu>\n</ng2-dropdown>\n"
            },] }
];
TagInputDropdown.ctorParameters = () => [
    { type: Injector }
];
TagInputDropdown.propDecorators = {
    dropdown: [{ type: ViewChild, args: [Ng2Dropdown,] }],
    templates: [{ type: ContentChildren, args: [TemplateRef,] }],
    offset: [{ type: Input }],
    focusFirstElement: [{ type: Input }],
    showDropdownIfEmpty: [{ type: Input }],
    autocompleteObservable: [{ type: Input }],
    minimumTextLength: [{ type: Input }],
    limitItemsTo: [{ type: Input }],
    displayBy: [{ type: Input }],
    identifyBy: [{ type: Input }],
    matchingFn: [{ type: Input }],
    appendToBody: [{ type: Input }],
    keepOpen: [{ type: Input }],
    dynamicUpdate: [{ type: Input }],
    zIndex: [{ type: Input }],
    autocompleteItems: [{ type: Input }],
    scrollListener: [{ type: HostListener, args: ['window:scroll',] }],
    onWindowBlur: [{ type: HostListener, args: ['window:blur',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLWlucHV0LWRyb3Bkb3duLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL21vZHVsZXMvY29tcG9uZW50cy9kcm9wZG93bi90YWctaW5wdXQtZHJvcGRvd24uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULGVBQWUsRUFFZixZQUFZLEVBQ1osUUFBUSxFQUNSLEtBQUssRUFFTCxXQUFXLEVBQ1gsU0FBUyxFQUVWLE1BQU0sZUFBZSxDQUFDO0FBSXZCLE9BQU8sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRW5GLE9BQU8sRUFBRSxXQUFXLEVBQWUsTUFBTSx1QkFBdUIsQ0FBQztBQUNqRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFMUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFNM0QsTUFBTSxPQUFPLGdCQUFnQjtJQWlJM0IsWUFBNkIsUUFBa0I7UUFBbEIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQXJIL0M7O1dBRUc7UUFDYSxXQUFNLEdBQVcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFFMUQ7O1dBRUc7UUFDYSxzQkFBaUIsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDO1FBRXhFOzs7V0FHRztRQUNhLHdCQUFtQixHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUM7UUFRNUU7OztXQUdHO1FBQ2Esc0JBQWlCLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQztRQUV4RTs7O1dBR0c7UUFDYSxpQkFBWSxHQUFXLFFBQVEsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDO1FBRXRFOztXQUVHO1FBQ2EsY0FBUyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENB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QyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDdkMsT0FBTyxPQUFPLElBQUksS0FBSyxRQUFRO2dCQUM3QixDQUFDLENBQUM7b0JBQ0UsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSTtvQkFDdEIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsSUFBSTtpQkFDeEI7Z0JBQ0gsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNYLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBNkJEOzs7T0FHRztJQUNLLGVBQWUsQ0FBQyxLQUFjO1FBQ3BDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUVoQyxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7OztZQTNaRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLG9CQUFvQjtnQkFDOUIsNDVCQUFpRDthQUNsRDs7O1lBcEJDLFFBQVE7Ozt1QkF5QlAsU0FBUyxTQUFDLFdBQVc7d0JBTXJCLGVBQWUsU0FBQyxXQUFXO3FCQUszQixLQUFLO2dDQUtMLEtBQUs7a0NBTUwsS0FBSztxQ0FNTCxLQUFLO2dDQU1MLEtBQUs7MkJBTUwsS0FBSzt3QkFLTCxLQUFLO3lCQUtMLEtBQUs7eUJBTUwsS0FBSzsyQkFNTCxLQUFLO3VCQU1MLEtBQUs7NEJBS0wsS0FBSztxQkFLTCxLQUFLO2dDQThCTCxLQUFLOzZCQWlKTCxZQUFZLFNBQUMsZUFBZTsyQkFZNUIsWUFBWSxTQUFDLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRXZlbnRFbWl0dGVyLFxuICBIb3N0TGlzdGVuZXIsXG4gIEluamVjdG9yLFxuICBJbnB1dCxcbiAgUXVlcnlMaXN0LFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NoaWxkLFxuICBBZnRlclZpZXdJbml0XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vLyByeFxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZmlsdGVyLCBmaXJzdCwgZGVib3VuY2VUaW1lLCBkaXN0aW5jdFVudGlsQ2hhbmdlZCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgTmcyRHJvcGRvd24sIE5nMk1lbnVJdGVtIH0gZnJvbSAnbmcyLW1hdGVyaWFsLWRyb3Bkb3duJztcbmltcG9ydCB7IGRlZmF1bHRzIH0gZnJvbSAnLi4vLi4vZGVmYXVsdHMnO1xuaW1wb3J0IHsgVGFnTW9kZWwgfSBmcm9tICcuLi8uLi9jb3JlL2FjY2Vzc29yJztcbmltcG9ydCB7IFRhZ0lucHV0Q29tcG9uZW50IH0gZnJvbSAnLi4vdGFnLWlucHV0L3RhZy1pbnB1dCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3RhZy1pbnB1dC1kcm9wZG93bicsXG4gIHRlbXBsYXRlVXJsOiAnLi90YWctaW5wdXQtZHJvcGRvd24udGVtcGxhdGUuaHRtbCdcbn0pXG5leHBvcnQgY2xhc3MgVGFnSW5wdXREcm9wZG93biBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuICAvKipcbiAgICogQG5hbWUgZHJvcGRvd25cbiAgICovXG4gIEBWaWV3Q2hpbGQoTmcyRHJvcGRvd24pIHB1YmxpYyBkcm9wZG93bjogTmcyRHJvcGRvd247XG5cbiAgLyoqXG4gICAqIEBuYW1lIG1lbnVUZW1wbGF0ZVxuICAgKiBAZGVzYyByZWZlcmVuY2UgdG8gdGhlIHRlbXBsYXRlIGlmIHByb3ZpZGVkIGJ5IHRoZSB1c2VyXG4gICAqL1xuICBAQ29udGVudENoaWxkcmVuKFRlbXBsYXRlUmVmKSBwdWJsaWMgdGVtcGxhdGVzOiBRdWVyeUxpc3Q8VGVtcGxhdGVSZWY8YW55Pj47XG5cbiAgLyoqXG4gICAqIEBuYW1lIG9mZnNldFxuICAgKi9cbiAgQElucHV0KCkgcHVibGljIG9mZnNldDogc3RyaW5nID0gZGVmYXVsdHMuZHJvcGRvd24ub2Zmc2V0O1xuXG4gIC8qKlxuICAgKiBAbmFtZSBmb2N1c0ZpcnN0RWxlbWVudFxuICAgKi9cbiAgQElucHV0KCkgcHVibGljIGZvY3VzRmlyc3RFbGVtZW50ID0gZGVmYXVsdHMuZHJvcGRvd24uZm9jdXNGaXJzdEVsZW1lbnQ7XG5cbiAgLyoqXG4gICAqIC0gc2hvdyBhdXRvY29tcGxldGUgZHJvcGRvd24gaWYgdGhlIHZhbHVlIG9mIGlucHV0IGlzIGVtcHR5XG4gICAqIEBuYW1lIHNob3dEcm9wZG93bklmRW1wdHlcbiAgICovXG4gIEBJbnB1dCgpIHB1YmxpYyBzaG93RHJvcGRvd25JZkVtcHR5ID0gZGVmYXVsdHMuZHJvcGRvd24uc2hvd0Ryb3Bkb3duSWZFbXB0eTtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIG9ic2VydmFibGUgcGFzc2VkIGFzIGlucHV0IHdoaWNoIHBvcHVsYXRlcyB0aGUgYXV0b2NvbXBsZXRlIGl0ZW1zXG4gICAqIEBuYW1lIGF1dG9jb21wbGV0ZU9ic2VydmFibGVcbiAgICovXG4gIEBJbnB1dCgpIHB1YmxpYyBhdXRvY29tcGxldGVPYnNlcnZhYmxlOiAodGV4dDogc3RyaW5nKSA9PiBPYnNlcnZhYmxlPGFueT47XG5cbiAgLyoqXG4gICAqIC0gZGVzYyBtaW5pbXVtIHRleHQgbGVuZ3RoIGluIG9yZGVyIHRvIGRpc3BsYXkgdGhlIGF1dG9jb21wbGV0ZSBkcm9wZG93blxuICAgKiBAbmFtZSBtaW5pbXVtVGV4dExlbmd0aFxuICAgKi9cbiAgQElucHV0KCkgcHVibGljIG1pbmltdW1UZXh0TGVuZ3RoID0gZGVmYXVsdHMuZHJvcGRvd24ubWluaW11bVRleHRMZW5ndGg7XG5cbiAgLyoqXG4gICAqIC0gbnVtYmVyIG9mIGl0ZW1zIHRvIGRpc3BsYXkgaW4gdGhlIGF1dG9jb21wbGV0ZSBkcm9wZG93blxuICAgKiBAbmFtZSBsaW1pdEl0ZW1zVG9cbiAgICovXG4gIEBJbnB1dCgpIHB1YmxpYyBsaW1pdEl0ZW1zVG86IG51bWJlciA9IGRlZmF1bHRzLmRyb3Bkb3duLmxpbWl0SXRlbXNUbztcblxuICAvKipcbiAgICogQG5hbWUgZGlzcGxheUJ5XG4gICAqL1xuICBASW5wdXQoKSBwdWJsaWMgZGlzcGxheUJ5ID0gZGVmYXVsdHMuZHJvcGRvd24uZGlzcGxheUJ5O1xuXG4gIC8qKlxuICAgKiBAbmFtZSBpZGVudGlmeUJ5XG4gICAqL1xuICBASW5wdXQoKSBwdWJsaWMgaWRlbnRpZnlCeSA9IGRlZmF1bHRzLmRyb3Bkb3duLmlkZW50aWZ5Qnk7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBhIGZ1bmN0aW9uIGEgZGV2ZWxvcGVyIGNhbiB1c2UgdG8gaW1wbGVtZW50IGN1c3RvbSBtYXRjaGluZyBmb3IgdGhlIGF1dG9jb21wbGV0ZVxuICAgKiBAbmFtZSBtYXRjaGluZ0ZuXG4gICAqL1xuICBASW5wdXQoKSBwdWJsaWMgbWF0Y2hpbmdGbjogKHZhbHVlOiBzdHJpbmcsIHRhcmdldDogVGFnTW9kZWwpID0+IGJvb2xlYW4gPVxuICAgIGRlZmF1bHRzLmRyb3Bkb3duLm1hdGNoaW5nRm47XG5cbiAgLyoqXG4gICAqIEBuYW1lIGFwcGVuZFRvQm9keVxuICAgKi9cbiAgQElucHV0KCkgcHVibGljIGFwcGVuZFRvQm9keSA9IGRlZmF1bHRzLmRyb3Bkb3duLmFwcGVuZFRvQm9keTtcblxuICAvKipcbiAgICogQG5hbWUga2VlcE9wZW5cbiAgICogQGRlc2NyaXB0aW9uIG9wdGlvbiB0byBsZWF2ZSBkcm9wZG93biBvcGVuIHdoZW4gYWRkaW5nIGEgbmV3IGl0ZW1cbiAgICovXG4gIEBJbnB1dCgpIHB1YmxpYyBrZWVwT3BlbiA9IGRlZmF1bHRzLmRyb3Bkb3duLmtlZXBPcGVuO1xuXG4gIC8qKlxuICAgKiBAbmFtZSBkeW5hbWljVXBkYXRlXG4gICAqL1xuICBASW5wdXQoKSBwdWJsaWMgZHluYW1pY1VwZGF0ZSA9IGRlZmF1bHRzLmRyb3Bkb3duLmR5bmFtaWNVcGRhdGU7XG5cbiAgLyoqXG4gICAqIEBuYW1lIHpJbmRleFxuICAgKi9cbiAgQElucHV0KCkgcHVibGljIHpJbmRleCA9IGRlZmF1bHRzLmRyb3Bkb3duLnpJbmRleDtcblxuICAvKipcbiAgICogbGlzdCBvZiBpdGVtcyB0aGF0IG1hdGNoIHRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZSBpbnB1dCAoZm9yIGF1dG9jb21wbGV0ZSlcbiAgICogQG5hbWUgaXRlbXNcbiAgICovXG4gIHB1YmxpYyBpdGVtczogVGFnTW9kZWxbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBAbmFtZSB0YWdJbnB1dFxuICAgKi9cbiAgcHVibGljIHRhZ0lucHV0OiBUYWdJbnB1dENvbXBvbmVudCA9IHRoaXMuaW5qZWN0b3IuZ2V0KFRhZ0lucHV0Q29tcG9uZW50KTtcblxuICAvKipcbiAgICogQG5hbWUgX2F1dG9jb21wbGV0ZUl0ZW1zXG4gICAqL1xuICBwcml2YXRlIF9hdXRvY29tcGxldGVJdGVtczogVGFnTW9kZWxbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBAbmFtZSBhdXRvY29tcGxldGVJdGVtc1xuICAgKiBAcGFyYW0gaXRlbXNcbiAgICovXG4gIHB1YmxpYyBzZXQgYXV0b2NvbXBsZXRlSXRlbXMoaXRlbXM6IFRhZ01vZGVsW10pIHtcbiAgICB0aGlzLl9hdXRvY29tcGxldGVJdGVtcyA9IGl0ZW1zO1xuICB9XG5cbiAgLyoqXG4gICAqIEBuYW1lIGF1dG9jb21wbGV0ZUl0ZW1zXG4gICAqIEBkZXNjIGFycmF5IG9mIGl0ZW1zIHRoYXQgd2lsbCBwb3B1bGF0ZSB0aGUgYXV0b2NvbXBsZXRlXG4gICAqL1xuICBASW5wdXQoKSBwdWJsaWMgZ2V0IGF1dG9jb21wbGV0ZUl0ZW1zKCk6IFRhZ01vZGVsW10ge1xuICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5fYXV0b2NvbXBsZXRlSXRlbXM7XG5cbiAgICBpZiAoIWl0ZW1zKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgcmV0dXJuIGl0ZW1zLm1hcCgoaXRlbTogVGFnTW9kZWwpID0+IHtcbiAgICAgIHJldHVybiB0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZydcbiAgICAgICAgPyB7XG4gICAgICAgICAgICBbdGhpcy5kaXNwbGF5QnldOiBpdGVtLFxuICAgICAgICAgICAgW3RoaXMuaWRlbnRpZnlCeV06IGl0ZW1cbiAgICAgICAgICB9XG4gICAgICAgIDogaXRlbTtcbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgaW5qZWN0b3I6IEluamVjdG9yKSB7fVxuXG4gIC8qKlxuICAgKiBAbmFtZSBuZ0FmdGVydmlld0luaXRcbiAgICovXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLm9uSXRlbUNsaWNrZWQoKS5zdWJzY3JpYmUoKGl0ZW06IE5nMk1lbnVJdGVtKSA9PiB7XG4gICAgICB0aGlzLnJlcXVlc3RBZGRpbmcoaXRlbSk7XG4gICAgfSk7XG5cbiAgICAvLyByZXNldCBpdGVtc01hdGNoaW5nIGFycmF5IHdoZW4gdGhlIGRyb3Bkb3duIGlzIGhpZGRlblxuICAgIHRoaXMub25IaWRlKCkuc3Vic2NyaWJlKHRoaXMucmVzZXRJdGVtcyk7XG5cbiAgICBjb25zdCBERUJPVU5DRV9USU1FID0gMjAwO1xuICAgIGNvbnN0IEtFRVBfT1BFTiA9IHRoaXMua2VlcE9wZW47XG5cbiAgICB0aGlzLnRhZ0lucHV0Lm9uVGV4dENoYW5nZVxuICAgICAgLmFzT2JzZXJ2YWJsZSgpXG4gICAgICAucGlwZShcbiAgICAgICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKSxcbiAgICAgICAgZGVib3VuY2VUaW1lKERFQk9VTkNFX1RJTUUpLFxuICAgICAgICBmaWx0ZXIoKHZhbHVlOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICBpZiAoS0VFUF9PUEVOID09PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmxlbmd0aCA+IDA7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKHRoaXMuc2hvdyk7XG4gIH1cblxuICAvKipcbiAgICogQG5hbWUgdXBkYXRlUG9zaXRpb25cbiAgICovXG4gIHB1YmxpYyB1cGRhdGVQb3NpdGlvbigpOiB2b2lkIHtcbiAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMudGFnSW5wdXQuaW5wdXRGb3JtLmdldEVsZW1lbnRQb3NpdGlvbigpO1xuXG4gICAgdGhpcy5kcm9wZG93bi5tZW51LnVwZGF0ZVBvc2l0aW9uKHBvc2l0aW9uLCB0aGlzLmR5bmFtaWNVcGRhdGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBuYW1lIGlzVmlzaWJsZVxuICAgKi9cbiAgcHVibGljIGdldCBpc1Zpc2libGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZHJvcGRvd24ubWVudS5kcm9wZG93blN0YXRlLm1lbnVTdGF0ZS5pc1Zpc2libGU7XG4gIH1cblxuICAvKipcbiAgICogQG5hbWUgb25IaWRlXG4gICAqL1xuICBwdWJsaWMgb25IaWRlKCk6IEV2ZW50RW1pdHRlcjxOZzJEcm9wZG93bj4ge1xuICAgIHJldHVybiB0aGlzLmRyb3Bkb3duLm9uSGlkZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbmFtZSBvbkl0ZW1DbGlja2VkXG4gICAqL1xuICBwdWJsaWMgb25JdGVtQ2xpY2tlZCgpOiBFdmVudEVtaXR0ZXI8c3RyaW5nPiB7XG4gICAgcmV0dXJuIHRoaXMuZHJvcGRvd24ub25JdGVtQ2xpY2tlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbmFtZSBzZWxlY3RlZEl0ZW1cbiAgICovXG4gIHB1YmxpYyBnZXQgc2VsZWN0ZWRJdGVtKCk6IE5nMk1lbnVJdGVtIHtcbiAgICByZXR1cm4gdGhpcy5kcm9wZG93bi5tZW51LmRyb3Bkb3duU3RhdGUuZHJvcGRvd25TdGF0ZS5zZWxlY3RlZEl0ZW07XG4gIH1cblxuICAvKipcbiAgICogQG5hbWUgc3RhdGVcbiAgICovXG4gIHB1YmxpYyBnZXQgc3RhdGUoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5kcm9wZG93bi5tZW51LmRyb3Bkb3duU3RhdGU7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQG5hbWUgc2hvd1xuICAgKi9cbiAgcHVibGljIHNob3cgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgbWF4SXRlbXNSZWFjaGVkID1cbiAgICAgIHRoaXMudGFnSW5wdXQuaXRlbXMubGVuZ3RoID09PSB0aGlzLnRhZ0lucHV0Lm1heEl0ZW1zO1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5nZXRGb3JtVmFsdWUoKTtcbiAgICBjb25zdCBoYXNNaW5pbXVtVGV4dCA9IHZhbHVlLnRyaW0oKS5sZW5ndGggPj0gdGhpcy5taW5pbXVtVGV4dExlbmd0aDtcbiAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuY2FsY3VsYXRlUG9zaXRpb24oKTtcbiAgICBjb25zdCBpdGVtcyA9IHRoaXMuZ2V0TWF0Y2hpbmdJdGVtcyh2YWx1ZSk7XG4gICAgY29uc3QgaGFzSXRlbXMgPSBpdGVtcy5sZW5ndGggPiAwO1xuICAgIGNvbnN0IGlzSGlkZGVuID0gdGhpcy5pc1Zpc2libGUgPT09IGZhbHNlO1xuICAgIGNvbnN0IHNob3dEcm9wZG93bklmRW1wdHkgPSB0aGlzLnNob3dEcm9wZG93bklmRW1wdHkgJiYgaGFzSXRlbXMgJiYgIXZhbHVlO1xuICAgIGNvbnN0IGlzRGlzYWJsZWQgPSB0aGlzLnRhZ0lucHV0LmRpc2FibGU7XG5cbiAgICBjb25zdCBzaG91bGRTaG93ID1cbiAgICAgIGlzSGlkZGVuICYmICgoaGFzSXRlbXMgJiYgaGFzTWluaW11bVRleHQpIHx8IHNob3dEcm9wZG93bklmRW1wdHkpO1xuICAgIGNvbnN0IHNob3VsZEhpZGUgPSB0aGlzLmlzVmlzaWJsZSAmJiAhaGFzSXRlbXM7XG5cbiAgICBpZiAodGhpcy5hdXRvY29tcGxldGVPYnNlcnZhYmxlICYmIGhhc01pbmltdW1UZXh0KSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRJdGVtc0Zyb21PYnNlcnZhYmxlKHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICAoIXRoaXMuc2hvd0Ryb3Bkb3duSWZFbXB0eSAmJiAhdmFsdWUpIHx8XG4gICAgICBtYXhJdGVtc1JlYWNoZWQgfHxcbiAgICAgIGlzRGlzYWJsZWRcbiAgICApIHtcbiAgICAgIHJldHVybiB0aGlzLmRyb3Bkb3duLmhpZGUoKTtcbiAgICB9XG5cbiAgICB0aGlzLnNldEl0ZW1zKGl0ZW1zKTtcblxuICAgIGlmIChzaG91bGRTaG93KSB7XG4gICAgICB0aGlzLmRyb3Bkb3duLnNob3cocG9zaXRpb24pO1xuICAgIH0gZWxzZSBpZiAoc2hvdWxkSGlkZSkge1xuICAgICAgdGhpcy5oaWRlKCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBAbmFtZSBoaWRlXG4gICAqL1xuICBwdWJsaWMgaGlkZSgpOiB2b2lkIHtcbiAgICB0aGlzLnJlc2V0SXRlbXMoKTtcbiAgICB0aGlzLmRyb3Bkb3duLmhpZGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbmFtZSBzY3JvbGxMaXN0ZW5lclxuICAgKi9cbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OnNjcm9sbCcpXG4gIHB1YmxpYyBzY3JvbGxMaXN0ZW5lcigpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaXNWaXNpYmxlIHx8ICF0aGlzLmR5bmFtaWNVcGRhdGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZVBvc2l0aW9uKCk7XG4gIH1cblxuICAvKipcbiAgICogQG5hbWUgb25XaW5kb3dCbHVyXG4gICAqL1xuICBASG9zdExpc3RlbmVyKCd3aW5kb3c6Ymx1cicpXG4gIHB1YmxpYyBvbldpbmRvd0JsdXIoKTogdm9pZCB7XG4gICAgdGhpcy5kcm9wZG93bi5oaWRlKCk7XG4gIH1cblxuICAvKipcbiAgICogQG5hbWUgZ2V0Rm9ybVZhbHVlXG4gICAqL1xuICBwcml2YXRlIGdldEZvcm1WYWx1ZSgpOiBzdHJpbmcge1xuICAgIGNvbnN0IGZvcm1WYWx1ZSA9IHRoaXMudGFnSW5wdXQuZm9ybVZhbHVlO1xuICAgIHJldHVybiBmb3JtVmFsdWUgPyBmb3JtVmFsdWUudG9TdHJpbmcoKS50cmltKCkgOiAnJztcbiAgfVxuXG4gIC8qKlxuICAgKiBAbmFtZSBjYWxjdWxhdGVQb3NpdGlvblxuICAgKi9cbiAgcHJpdmF0ZSBjYWxjdWxhdGVQb3NpdGlvbigpOiBDbGllbnRSZWN0IHtcbiAgICByZXR1cm4gdGhpcy50YWdJbnB1dC5pbnB1dEZvcm0uZ2V0RWxlbWVudFBvc2l0aW9uKCk7XG4gIH1cblxuICAvKipcbiAgICogQG5hbWUgcmVxdWVzdEFkZGluZ1xuICAgKiBAcGFyYW0gaXRlbSB7TmcyTWVudUl0ZW19XG4gICAqL1xuICBwcml2YXRlIHJlcXVlc3RBZGRpbmcgPSBhc3luYyAoaXRlbTogTmcyTWVudUl0ZW0pID0+IHtcbiAgICBjb25zdCB0YWcgPSB0aGlzLmNyZWF0ZVRhZ01vZGVsKGl0ZW0pO1xuICAgIGF3YWl0IHRoaXMudGFnSW5wdXQub25BZGRpbmdSZXF1ZXN0ZWQodHJ1ZSwgdGFnKS5jYXRjaCgoKSA9PiB7fSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBuYW1lIGNyZWF0ZVRhZ01vZGVsXG4gICAqIEBwYXJhbSBpdGVtXG4gICAqL1xuICBwcml2YXRlIGNyZWF0ZVRhZ01vZGVsKGl0ZW06IE5nMk1lbnVJdGVtKTogVGFnTW9kZWwge1xuICAgIGNvbnN0IGRpc3BsYXkgPVxuICAgICAgdHlwZW9mIGl0ZW0udmFsdWUgPT09ICdzdHJpbmcnID8gaXRlbS52YWx1ZSA6IGl0ZW0udmFsdWVbdGhpcy5kaXNwbGF5QnldO1xuICAgIGNvbnN0IHZhbHVlID1cbiAgICAgIHR5cGVvZiBpdGVtLnZhbHVlID09PSAnc3RyaW5nJyA/IGl0ZW0udmFsdWUgOiBpdGVtLnZhbHVlW3RoaXMuaWRlbnRpZnlCeV07XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uaXRlbS52YWx1ZSxcbiAgICAgIFt0aGlzLnRhZ0lucHV0LmRpc3BsYXlCeV06IGRpc3BsYXksXG4gICAgICBbdGhpcy50YWdJbnB1dC5pZGVudGlmeUJ5XTogdmFsdWVcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSB7c3RyaW5nfVxuICAgKi9cbiAgcHJpdmF0ZSBnZXRNYXRjaGluZ0l0ZW1zKHZhbHVlOiBzdHJpbmcpOiBUYWdNb2RlbFtdIHtcbiAgICBpZiAoIXZhbHVlICYmICF0aGlzLnNob3dEcm9wZG93bklmRW1wdHkpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBjb25zdCBkdXBlc0FsbG93ZWQgPSB0aGlzLnRhZ0lucHV0LmFsbG93RHVwZXM7XG5cbiAgICByZXR1cm4gdGhpcy5hdXRvY29tcGxldGVJdGVtcy5maWx0ZXIoKGl0ZW06IFRhZ01vZGVsKSA9PiB7XG4gICAgICBjb25zdCBoYXNWYWx1ZSA9IGR1cGVzQWxsb3dlZFxuICAgICAgICA/IGZhbHNlXG4gICAgICAgIDogdGhpcy50YWdJbnB1dC50YWdzLnNvbWUodGFnID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGlkZW50aWZ5QnkgPSB0aGlzLnRhZ0lucHV0LmlkZW50aWZ5Qnk7XG4gICAgICAgICAgICBjb25zdCBtb2RlbCA9XG4gICAgICAgICAgICAgIHR5cGVvZiB0YWcubW9kZWwgPT09ICdzdHJpbmcnID8gdGFnLm1vZGVsIDogdGFnLm1vZGVsW2lkZW50aWZ5QnldO1xuXG4gICAgICAgICAgICByZXR1cm4gbW9kZWwgPT09IGl0ZW1bdGhpcy5pZGVudGlmeUJ5XTtcbiAgICAgICAgICB9KTtcblxuICAgICAgcmV0dXJuIHRoaXMubWF0Y2hpbmdGbih2YWx1ZSwgaXRlbSkgJiYgaGFzVmFsdWUgPT09IGZhbHNlO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBuYW1lIHNldEl0ZW1zXG4gICAqL1xuICBwcml2YXRlIHNldEl0ZW1zKGl0ZW1zOiBUYWdNb2RlbFtdKTogdm9pZCB7XG4gICAgdGhpcy5pdGVtcyA9IGl0ZW1zLnNsaWNlKDAsIHRoaXMubGltaXRJdGVtc1RvIHx8IGl0ZW1zLmxlbmd0aCk7XG4gIH1cblxuICAvKipcbiAgICogQG5hbWUgcmVzZXRJdGVtc1xuICAgKi9cbiAgcHJpdmF0ZSByZXNldEl0ZW1zID0gKCk6IHZvaWQgPT4ge1xuICAgIHRoaXMuaXRlbXMgPSBbXTtcbiAgfTtcblxuICAvKipcbiAgICogQG5hbWUgcG9wdWxhdGVJdGVtc1xuICAgKiBAcGFyYW0gZGF0YVxuICAgKi9cbiAgcHJpdmF0ZSBwb3B1bGF0ZUl0ZW1zKGRhdGE6IGFueSk6IFRhZ0lucHV0RHJvcGRvd24ge1xuICAgIHRoaXMuYXV0b2NvbXBsZXRlSXRlbXMgPSBkYXRhLm1hcChpdGVtID0+IHtcbiAgICAgIHJldHVybiB0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZydcbiAgICAgICAgPyB7XG4gICAgICAgICAgICBbdGhpcy5kaXNwbGF5QnldOiBpdGVtLFxuICAgICAgICAgICAgW3RoaXMuaWRlbnRpZnlCeV06IGl0ZW1cbiAgICAgICAgICB9XG4gICAgICAgIDogaXRlbTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEBuYW1lIGdldEl0ZW1zRnJvbU9ic2VydmFibGVcbiAgICogQHBhcmFtIHRleHRcbiAgICovXG4gIHByaXZhdGUgZ2V0SXRlbXNGcm9tT2JzZXJ2YWJsZSA9ICh0ZXh0OiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICB0aGlzLnNldExvYWRpbmdTdGF0ZSh0cnVlKTtcblxuICAgIGNvbnN0IHN1YnNjcmliZUZuID0gKGRhdGE6IGFueVtdKSA9PiB7XG4gICAgICAvLyBoaWRlIGxvYWRpbmcgYW5pbWF0aW9uXG4gICAgICB0aGlzLnNldExvYWRpbmdTdGF0ZShmYWxzZSlcbiAgICAgICAgLy8gYWRkIGl0ZW1zXG4gICAgICAgIC5wb3B1bGF0ZUl0ZW1zKGRhdGEpO1xuXG4gICAgICB0aGlzLnNldEl0ZW1zKHRoaXMuZ2V0TWF0Y2hpbmdJdGVtcyh0ZXh0KSk7XG5cbiAgICAgIGlmICh0aGlzLml0ZW1zLmxlbmd0aCkge1xuICAgICAgICB0aGlzLmRyb3Bkb3duLnNob3codGhpcy5jYWxjdWxhdGVQb3NpdGlvbigpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZHJvcGRvd24uaGlkZSgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLmF1dG9jb21wbGV0ZU9ic2VydmFibGUodGV4dClcbiAgICAgIC5waXBlKGZpcnN0KCkpXG4gICAgICAuc3Vic2NyaWJlKHN1YnNjcmliZUZuLCAoKSA9PiB0aGlzLnNldExvYWRpbmdTdGF0ZShmYWxzZSkpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAbmFtZSBzZXRMb2FkaW5nU3RhdGVcbiAgICogQHBhcmFtIHN0YXRlXG4gICAqL1xuICBwcml2YXRlIHNldExvYWRpbmdTdGF0ZShzdGF0ZTogYm9vbGVhbik6IFRhZ0lucHV0RHJvcGRvd24ge1xuICAgIHRoaXMudGFnSW5wdXQuaXNMb2FkaW5nID0gc3RhdGU7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuIl19