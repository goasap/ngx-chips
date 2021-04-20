import { Component, Input, Output, EventEmitter, ElementRef, HostListener, HostBinding, ViewChild, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { TagRipple } from '../tag/tag-ripple.component';
// mocking navigator
const navigator = typeof window !== 'undefined' ? window.navigator : {
    userAgent: 'Chrome',
    vendor: 'Google Inc'
};
const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
export class TagComponent {
    constructor(element, renderer, cdRef) {
        this.element = element;
        this.renderer = renderer;
        this.cdRef = cdRef;
        /**
         * @name disabled
         */
        this.disabled = false;
        /**
         * @name onSelect
         */
        this.onSelect = new EventEmitter();
        /**
         * @name onRemove
         */
        this.onRemove = new EventEmitter();
        /**
         * @name onBlur
         */
        this.onBlur = new EventEmitter();
        /**
         * @name onKeyDown
         */
        this.onKeyDown = new EventEmitter();
        /**
         * @name onTagEdited
         */
        this.onTagEdited = new EventEmitter();
        /**
         * @name editing
         */
        this.editing = false;
        /**
         * @name rippleState
         */
        this.rippleState = 'none';
    }
    /**
     * @name readonly {boolean}
     */
    get readonly() {
        return typeof this.model !== 'string' && this.model.readonly === true;
    }
    /**
     * @name select
     */
    select($event) {
        if (this.readonly || this.disabled) {
            return;
        }
        if ($event) {
            $event.stopPropagation();
        }
        this.focus();
        this.onSelect.emit(this.model);
    }
    /**
     * @name remove
     */
    remove($event) {
        $event.stopPropagation();
        this.onRemove.emit(this);
    }
    /**
     * @name focus
     */
    focus() {
        this.element.nativeElement.focus();
    }
    move() {
        this.moving = true;
    }
    /**
     * @name keydown
     * @param event
     */
    keydown(event) {
        if (this.editing) {
            if (event.keyCode === 13) {
                return this.disableEditMode(event);
            }
        }
        else {
            this.onKeyDown.emit({ event, model: this.model });
        }
    }
    /**
     * @name blink
     */
    blink() {
        const classList = this.element.nativeElement.classList;
        classList.add('blink');
        setTimeout(() => classList.remove('blink'), 50);
    }
    /**
     * @name toggleEditMode
     */
    toggleEditMode() {
        if (this.editable) {
            return this.editing ? undefined : this.activateEditMode();
        }
    }
    /**
     * @name onBlurred
     * @param event
     */
    onBlurred(event) {
        // Checks if it is editable first before handeling the onBlurred event in order to prevent
        // a bug in IE where tags are still editable with onlyFromAutocomplete set to true
        if (!this.editable) {
            return;
        }
        this.disableEditMode();
        const value = event.target.innerText;
        const result = typeof this.model === 'string'
            ? value
            : Object.assign(Object.assign({}, this.model), { [this.displayBy]: value });
        this.onBlur.emit(result);
    }
    /**
     * @name getDisplayValue
     * @param item
     */
    getDisplayValue(item) {
        return typeof item === 'string' ? item : item[this.displayBy];
    }
    /**
     * @desc returns whether the ripple is visible or not
     * only works in Chrome
     * @name isRippleVisible
     */
    get isRippleVisible() {
        return !this.readonly && !this.editing && isChrome && this.hasRipple;
    }
    /**
     * @name disableEditMode
     * @param $event
     */
    disableEditMode($event) {
        const classList = this.element.nativeElement.classList;
        const input = this.getContentEditableText();
        this.editing = false;
        classList.remove('tag--editing');
        if (!input) {
            this.setContentEditableText(this.model);
            return;
        }
        this.storeNewValue(input);
        this.cdRef.detectChanges();
        if ($event) {
            $event.preventDefault();
        }
    }
    /**
     * @name isDeleteIconVisible
     */
    isDeleteIconVisible() {
        return (!this.readonly && !this.disabled && this.removable && !this.editing);
    }
    /**
     * @name getContentEditableText
     */
    getContentEditableText() {
        const input = this.getContentEditable();
        return input ? input.innerText.trim() : '';
    }
    /**
     * @name setContentEditableText
     * @param model
     */
    setContentEditableText(model) {
        const input = this.getContentEditable();
        const value = this.getDisplayValue(model);
        input.innerText = value;
    }
    /**
     * @name
     */
    activateEditMode() {
        const classList = this.element.nativeElement.classList;
        classList.add('tag--editing');
        this.editing = true;
    }
    /**
     * @name storeNewValue
     * @param input
     */
    storeNewValue(input) {
        const exists = (tag) => {
            return typeof tag === 'string'
                ? tag === input
                : tag[this.displayBy] === input;
        };
        const hasId = () => {
            return this.model[this.identifyBy] !== this.model[this.displayBy];
        };
        // if the value changed, replace the value in the model
        if (exists(this.model)) {
            return;
        }
        const model = typeof this.model === 'string'
            ? input
            : {
                index: this.index,
                [this.identifyBy]: hasId()
                    ? this.model[this.identifyBy]
                    : input,
                [this.displayBy]: input
            };
        if (this.canAddTag(model)) {
            this.onTagEdited.emit({ tag: model, index: this.index });
        }
        else {
            this.setContentEditableText(this.model);
        }
    }
    /**
     * @name getContentEditable
     */
    getContentEditable() {
        return this.element.nativeElement.querySelector('[contenteditable]');
    }
}
TagComponent.decorators = [
    { type: Component, args: [{
                selector: 'tag',
                template: "<div (click)=\"select($event)\"\n     (dblclick)=\"toggleEditMode()\"\n     (mousedown)=\"rippleState='clicked'\"\n     (mouseup)=\"rippleState='none'\"\n     [ngSwitch]=\"!!template\"\n     [class.disabled]=\"disabled\"\n     [attr.tabindex]=\"-1\"\n     [attr.aria-label]=\"getDisplayValue(model)\">\n\n    <div *ngSwitchCase=\"true\" [attr.contenteditable]=\"editing\">\n        <!-- CUSTOM TEMPLATE -->\n        <ng-template\n            [ngTemplateOutletContext]=\"{ item: model, index: index }\"\n            [ngTemplateOutlet]=\"template\">\n        </ng-template>\n    </div>\n\n    <div *ngSwitchCase=\"false\" class=\"tag-wrapper\">\n        <!-- TAG NAME -->\n        <div [attr.contenteditable]=\"editing\"\n             [attr.title]=\"getDisplayValue(model)\"\n             class=\"tag__text inline\"\n             spellcheck=\"false\"\n             (keydown.enter)=\"disableEditMode($event)\"\n             (keydown.escape)=\"disableEditMode($event)\"\n             (click)=\"editing ? $event.stopPropagation() : undefined\"\n             (blur)=\"onBlurred($event)\">\n            {{ getDisplayValue(model) }}\n        </div>\n\n        <!-- 'X' BUTTON -->\n        <delete-icon\n            aria-label=\"Remove tag\"\n            role=\"button\"\n            (click)=\"remove($event)\"\n            *ngIf=\"isDeleteIconVisible()\">\n        </delete-icon>\n    </div>\n</div>\n\n<tag-ripple [state]=\"rippleState\"\n            [attr.tabindex]=\"-1\"\n            *ngIf=\"isRippleVisible\">\n</tag-ripple>\n",
                styles: [":host,:host>div,:host>div:focus{outline:0;overflow:hidden;transition:opacity 1s;z-index:1}:host{max-width:400px}:host.blink{-webkit-animation:blink .3s ease-in-out normal forwards;animation:blink .3s ease-in-out normal forwards}@-webkit-keyframes blink{0%{opacity:.3}}@keyframes blink{0%{opacity:.3}}:host .disabled{cursor:not-allowed}:host [contenteditable=true]{outline:0}.tag-wrapper{display:flex;flex-direction:row}.tag__text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}"]
            },] }
];
TagComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: ChangeDetectorRef }
];
TagComponent.propDecorators = {
    model: [{ type: Input }],
    removable: [{ type: Input }],
    editable: [{ type: Input }],
    template: [{ type: Input }],
    displayBy: [{ type: Input }],
    identifyBy: [{ type: Input }],
    index: [{ type: Input }],
    hasRipple: [{ type: Input }],
    disabled: [{ type: Input }],
    canAddTag: [{ type: Input }],
    onSelect: [{ type: Output }],
    onRemove: [{ type: Output }],
    onBlur: [{ type: Output }],
    onKeyDown: [{ type: Output }],
    onTagEdited: [{ type: Output }],
    moving: [{ type: HostBinding, args: ['class.moving',] }],
    ripple: [{ type: ViewChild, args: [TagRipple,] }],
    keydown: [{ type: HostListener, args: ['keydown', ['$event'],] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL21vZHVsZXMvY29tcG9uZW50cy90YWcvdGFnLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0gsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUVaLFVBQVUsRUFDVixZQUFZLEVBQ1osV0FBVyxFQUNYLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsU0FBUyxFQUNaLE1BQU0sZUFBZSxDQUFDO0FBR3ZCLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUd4RCxvQkFBb0I7QUFDcEIsTUFBTSxTQUFTLEdBQUcsT0FBTyxNQUFNLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUNqRSxTQUFTLEVBQUUsUUFBUTtJQUNuQixNQUFNLEVBQUUsWUFBWTtDQUN2QixDQUFDO0FBRUYsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7QUFPM0YsTUFBTSxPQUFPLFlBQVk7SUF3SHJCLFlBQ1csT0FBbUIsRUFDbkIsUUFBbUIsRUFDbEIsS0FBd0I7UUFGekIsWUFBTyxHQUFQLE9BQU8sQ0FBWTtRQUNuQixhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ2xCLFVBQUssR0FBTCxLQUFLLENBQW1CO1FBMUVwQzs7V0FFRztRQUVJLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFReEI7O1dBRUc7UUFFSSxhQUFRLEdBQTJCLElBQUksWUFBWSxFQUFZLENBQUM7UUFFdkU7O1dBRUc7UUFFSSxhQUFRLEdBQTJCLElBQUksWUFBWSxFQUFZLENBQUM7UUFFdkU7O1dBRUc7UUFFSSxXQUFNLEdBQTJCLElBQUksWUFBWSxFQUFZ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QkFNTCxLQUFLO29CQU1MLEtBQUs7d0JBTUwsS0FBSzt1QkFNTCxLQUFLO3dCQU1MLEtBQUs7dUJBTUwsTUFBTTt1QkFNTixNQUFNO3FCQU1OLE1BQU07d0JBTU4sTUFBTTswQkFNTixNQUFNO3FCQWtCTixXQUFXLFNBQUMsY0FBYztxQkFXMUIsU0FBUyxTQUFDLFNBQVM7c0JBaURuQixZQUFZLFNBQUMsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgICBDb21wb25lbnQsXG4gICAgSW5wdXQsXG4gICAgT3V0cHV0LFxuICAgIEV2ZW50RW1pdHRlcixcbiAgICBUZW1wbGF0ZVJlZixcbiAgICBFbGVtZW50UmVmLFxuICAgIEhvc3RMaXN0ZW5lcixcbiAgICBIb3N0QmluZGluZyxcbiAgICBWaWV3Q2hpbGQsXG4gICAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgUmVuZGVyZXIyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBUYWdNb2RlbCB9IGZyb20gJy4uLy4uL2NvcmUvYWNjZXNzb3InO1xuaW1wb3J0IHsgVGFnUmlwcGxlIH0gZnJvbSAnLi4vdGFnL3RhZy1yaXBwbGUuY29tcG9uZW50JztcbmltcG9ydCB7IEV2ZW50TGlrZSB9IGZyb20gJy4uLy4uL2NvcmUvaGVscGVycy9ldmVudC1saWtlJztcblxuLy8gbW9ja2luZyBuYXZpZ2F0b3JcbmNvbnN0IG5hdmlnYXRvciA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93Lm5hdmlnYXRvciA6IHtcbiAgICB1c2VyQWdlbnQ6ICdDaHJvbWUnLFxuICAgIHZlbmRvcjogJ0dvb2dsZSBJbmMnXG59O1xuXG5jb25zdCBpc0Nocm9tZSA9IC9DaHJvbWUvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgJiYgL0dvb2dsZSBJbmMvLnRlc3QobmF2aWdhdG9yLnZlbmRvcik7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAndGFnJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vdGFnLnRlbXBsYXRlLmh0bWwnLFxuICAgIHN0eWxlVXJsczogWycuL3RhZy1jb21wb25lbnQuc3R5bGUuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIFRhZ0NvbXBvbmVudCB7XG4gICAgLyoqXG4gICAgICogQG5hbWUgbW9kZWwge1RhZ01vZGVsfVxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIG1vZGVsOiBUYWdNb2RlbDtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHJlbW92YWJsZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyByZW1vdmFibGU6IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBlZGl0YWJsZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBlZGl0YWJsZTogYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHRlbXBsYXRlIHtUZW1wbGF0ZVJlZjxhbnk+fVxuICAgICAqL1xuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgZGlzcGxheUJ5IHtzdHJpbmd9XG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZGlzcGxheUJ5OiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBpZGVudGlmeUJ5IHtzdHJpbmd9XG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgaWRlbnRpZnlCeTogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgaW5kZXgge251bWJlcn1cbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBpbmRleDogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgaGFzUmlwcGxlXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgaGFzUmlwcGxlOiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgZGlzYWJsZWRcbiAgICAgKi9cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBkaXNhYmxlZCA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgY2FuQWRkVGFnXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgY2FuQWRkVGFnOiAodGFnOiBUYWdNb2RlbCkgPT4gYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG9uU2VsZWN0XG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIG9uU2VsZWN0OiBFdmVudEVtaXR0ZXI8VGFnTW9kZWw+ID0gbmV3IEV2ZW50RW1pdHRlcjxUYWdNb2RlbD4oKTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG9uUmVtb3ZlXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIG9uUmVtb3ZlOiBFdmVudEVtaXR0ZXI8VGFnTW9kZWw+ID0gbmV3IEV2ZW50RW1pdHRlcjxUYWdNb2RlbD4oKTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG9uQmx1clxuICAgICAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHB1YmxpYyBvbkJsdXI6IEV2ZW50RW1pdHRlcjxUYWdNb2RlbD4gPSBuZXcgRXZlbnRFbWl0dGVyPFRhZ01vZGVsPigpO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgb25LZXlEb3duXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIG9uS2V5RG93bjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG9uVGFnRWRpdGVkXG4gICAgICovXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIG9uVGFnRWRpdGVkOiBFdmVudEVtaXR0ZXI8VGFnTW9kZWw+ID0gbmV3IEV2ZW50RW1pdHRlcjxUYWdNb2RlbD4oKTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHJlYWRvbmx5IHtib29sZWFufVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgcmVhZG9ubHkoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgdGhpcy5tb2RlbCAhPT0gJ3N0cmluZycgJiYgdGhpcy5tb2RlbC5yZWFkb25seSA9PT0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBlZGl0aW5nXG4gICAgICovXG4gICAgcHVibGljIGVkaXRpbmcgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG1vdmluZ1xuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnY2xhc3MubW92aW5nJylcbiAgICBwdWJsaWMgbW92aW5nOiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgcmlwcGxlU3RhdGVcbiAgICAgKi9cbiAgICBwdWJsaWMgcmlwcGxlU3RhdGUgPSAnbm9uZSc7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSByaXBwbGUge1RhZ1JpcHBsZX1cbiAgICAgKi9cbiAgICBAVmlld0NoaWxkKFRhZ1JpcHBsZSlcbiAgICBwdWJsaWMgcmlwcGxlOiBUYWdSaXBwbGU7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHVibGljIGVsZW1lbnQ6IEVsZW1lbnRSZWYsXG4gICAgICAgIHB1YmxpYyByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgICAgICBwcml2YXRlIGNkUmVmOiBDaGFuZ2VEZXRlY3RvclJlZlxuICAgICkge31cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHNlbGVjdFxuICAgICAqL1xuICAgIHB1YmxpYyBzZWxlY3QoJGV2ZW50PzogTW91c2VFdmVudCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5yZWFkb25seSB8fCB0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJGV2ZW50KSB7XG4gICAgICAgICAgICAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmZvY3VzKCk7XG5cbiAgICAgICAgdGhpcy5vblNlbGVjdC5lbWl0KHRoaXMubW9kZWwpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHJlbW92ZVxuICAgICAqL1xuICAgIHB1YmxpYyByZW1vdmUoJGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgICAgICRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgdGhpcy5vblJlbW92ZS5lbWl0KHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGZvY3VzXG4gICAgICovXG4gICAgcHVibGljIGZvY3VzKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgIH1cblxuICAgIHB1YmxpYyBtb3ZlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLm1vdmluZyA9IHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUga2V5ZG93blxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqL1xuICAgIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24nLCBbJyRldmVudCddKVxuICAgIHB1YmxpYyBrZXlkb3duKGV2ZW50OiBFdmVudExpa2UpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuZWRpdGluZykge1xuICAgICAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDEzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGlzYWJsZUVkaXRNb2RlKGV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMub25LZXlEb3duLmVtaXQoeyBldmVudCwgbW9kZWw6IHRoaXMubW9kZWwgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBibGlua1xuICAgICAqL1xuICAgIHB1YmxpYyBibGluaygpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgY2xhc3NMaXN0ID0gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0O1xuICAgICAgICBjbGFzc0xpc3QuYWRkKCdibGluaycpO1xuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gY2xhc3NMaXN0LnJlbW92ZSgnYmxpbmsnKSwgNTApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHRvZ2dsZUVkaXRNb2RlXG4gICAgICovXG4gICAgcHVibGljIHRvZ2dsZUVkaXRNb2RlKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5lZGl0YWJsZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWRpdGluZyA/IHVuZGVmaW5lZCA6IHRoaXMuYWN0aXZhdGVFZGl0TW9kZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgb25CbHVycmVkXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICovXG4gICAgcHVibGljIG9uQmx1cnJlZChldmVudDogYW55KTogdm9pZCB7XG4gICAgICAgIC8vIENoZWNrcyBpZiBpdCBpcyBlZGl0YWJsZSBmaXJzdCBiZWZvcmUgaGFuZGVsaW5nIHRoZSBvbkJsdXJyZWQgZXZlbnQgaW4gb3JkZXIgdG8gcHJldmVudFxuICAgICAgICAvLyBhIGJ1ZyBpbiBJRSB3aGVyZSB0YWdzIGFyZSBzdGlsbCBlZGl0YWJsZSB3aXRoIG9ubHlGcm9tQXV0b2NvbXBsZXRlIHNldCB0byB0cnVlXG4gICAgICAgIGlmICghdGhpcy5lZGl0YWJsZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kaXNhYmxlRWRpdE1vZGUoKTtcblxuICAgICAgICBjb25zdCB2YWx1ZTogc3RyaW5nID0gZXZlbnQudGFyZ2V0LmlubmVyVGV4dDtcbiAgICAgICAgY29uc3QgcmVzdWx0ID1cbiAgICAgICAgICAgIHR5cGVvZiB0aGlzLm1vZGVsID09PSAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgID8gdmFsdWVcbiAgICAgICAgICAgICAgICA6IHsgLi4udGhpcy5tb2RlbCwgW3RoaXMuZGlzcGxheUJ5XTogdmFsdWUgfTtcblxuICAgICAgICB0aGlzLm9uQmx1ci5lbWl0KHJlc3VsdCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgZ2V0RGlzcGxheVZhbHVlXG4gICAgICogQHBhcmFtIGl0ZW1cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0RGlzcGxheVZhbHVlKGl0ZW06IFRhZ01vZGVsKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJyA/IGl0ZW0gOiBpdGVtW3RoaXMuZGlzcGxheUJ5XTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZGVzYyByZXR1cm5zIHdoZXRoZXIgdGhlIHJpcHBsZSBpcyB2aXNpYmxlIG9yIG5vdFxuICAgICAqIG9ubHkgd29ya3MgaW4gQ2hyb21lXG4gICAgICogQG5hbWUgaXNSaXBwbGVWaXNpYmxlXG4gICAgICovXG4gICAgcHVibGljIGdldCBpc1JpcHBsZVZpc2libGUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAhdGhpcy5yZWFkb25seSAmJiAhdGhpcy5lZGl0aW5nICYmIGlzQ2hyb21lICYmIHRoaXMuaGFzUmlwcGxlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGRpc2FibGVFZGl0TW9kZVxuICAgICAqIEBwYXJhbSAkZXZlbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgZGlzYWJsZUVkaXRNb2RlKCRldmVudD86IEV2ZW50TGlrZSk6IHZvaWQge1xuICAgICAgICBjb25zdCBjbGFzc0xpc3QgPSB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5jbGFzc0xpc3Q7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gdGhpcy5nZXRDb250ZW50RWRpdGFibGVUZXh0KCk7XG5cbiAgICAgICAgdGhpcy5lZGl0aW5nID0gZmFsc2U7XG4gICAgICAgIGNsYXNzTGlzdC5yZW1vdmUoJ3RhZy0tZWRpdGluZycpO1xuXG4gICAgICAgIGlmICghaW5wdXQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0Q29udGVudEVkaXRhYmxlVGV4dCh0aGlzLm1vZGVsKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3RvcmVOZXdWYWx1ZShpbnB1dCk7XG4gICAgICAgIHRoaXMuY2RSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuXG4gICAgICAgIGlmICgkZXZlbnQpIHtcbiAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgaXNEZWxldGVJY29uVmlzaWJsZVxuICAgICAqL1xuICAgIHB1YmxpYyBpc0RlbGV0ZUljb25WaXNpYmxlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgIXRoaXMucmVhZG9ubHkgJiYgIXRoaXMuZGlzYWJsZWQgJiYgdGhpcy5yZW1vdmFibGUgJiYgIXRoaXMuZWRpdGluZ1xuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGdldENvbnRlbnRFZGl0YWJsZVRleHRcbiAgICAgKi9cbiAgICBwcml2YXRlIGdldENvbnRlbnRFZGl0YWJsZVRleHQoKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgaW5wdXQgPSB0aGlzLmdldENvbnRlbnRFZGl0YWJsZSgpO1xuXG4gICAgICAgIHJldHVybiBpbnB1dCA/IGlucHV0LmlubmVyVGV4dC50cmltKCkgOiAnJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBzZXRDb250ZW50RWRpdGFibGVUZXh0XG4gICAgICogQHBhcmFtIG1vZGVsXG4gICAgICovXG4gICAgcHJpdmF0ZSBzZXRDb250ZW50RWRpdGFibGVUZXh0KG1vZGVsOiBUYWdNb2RlbCkge1xuICAgICAgICBjb25zdCBpbnB1dCA9IHRoaXMuZ2V0Q29udGVudEVkaXRhYmxlKCk7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5nZXREaXNwbGF5VmFsdWUobW9kZWwpO1xuXG4gICAgICAgIGlucHV0LmlubmVyVGV4dCA9IHZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lXG4gICAgICovXG4gICAgcHJpdmF0ZSBhY3RpdmF0ZUVkaXRNb2RlKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBjbGFzc0xpc3QgPSB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5jbGFzc0xpc3Q7XG4gICAgICAgIGNsYXNzTGlzdC5hZGQoJ3RhZy0tZWRpdGluZycpO1xuXG4gICAgICAgIHRoaXMuZWRpdGluZyA9IHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgc3RvcmVOZXdWYWx1ZVxuICAgICAqIEBwYXJhbSBpbnB1dFxuICAgICAqL1xuICAgIHByaXZhdGUgc3RvcmVOZXdWYWx1ZShpbnB1dDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGV4aXN0cyA9ICh0YWc6IFRhZ01vZGVsKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIHRhZyA9PT0gJ3N0cmluZydcbiAgICAgICAgICAgICAgICA/IHRhZyA9PT0gaW5wdXRcbiAgICAgICAgICAgICAgICA6IHRhZ1t0aGlzLmRpc3BsYXlCeV0gPT09IGlucHV0O1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGhhc0lkID0gKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubW9kZWxbdGhpcy5pZGVudGlmeUJ5XSAhPT0gdGhpcy5tb2RlbFt0aGlzLmRpc3BsYXlCeV07XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gaWYgdGhlIHZhbHVlIGNoYW5nZWQsIHJlcGxhY2UgdGhlIHZhbHVlIGluIHRoZSBtb2RlbFxuICAgICAgICBpZiAoZXhpc3RzKHRoaXMubW9kZWwpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtb2RlbCA9XG4gICAgICAgICAgICB0eXBlb2YgdGhpcy5tb2RlbCA9PT0gJ3N0cmluZydcbiAgICAgICAgICAgICAgICA/IGlucHV0XG4gICAgICAgICAgICAgICAgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgaW5kZXg6IHRoaXMuaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgW3RoaXMuaWRlbnRpZnlCeV06IGhhc0lkKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPyB0aGlzLm1vZGVsW3RoaXMuaWRlbnRpZnlCeV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgOiBpbnB1dCxcbiAgICAgICAgICAgICAgICAgICAgICBbdGhpcy5kaXNwbGF5QnldOiBpbnB1dFxuICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICBpZiAodGhpcy5jYW5BZGRUYWcobW9kZWwpKSB7XG4gICAgICAgICAgICB0aGlzLm9uVGFnRWRpdGVkLmVtaXQoeyB0YWc6IG1vZGVsLCBpbmRleDogdGhpcy5pbmRleCB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2V0Q29udGVudEVkaXRhYmxlVGV4dCh0aGlzLm1vZGVsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGdldENvbnRlbnRFZGl0YWJsZVxuICAgICAqL1xuICAgIHByaXZhdGUgZ2V0Q29udGVudEVkaXRhYmxlKCk6IEhUTUxJbnB1dEVsZW1lbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignW2NvbnRlbnRlZGl0YWJsZV0nKTtcbiAgICB9XG59XG4iXX0=