import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
export class TagInputForm {
    constructor() {
        /**
         * @name onSubmit
         */
        this.onSubmit = new EventEmitter();
        /**
         * @name onBlur
         */
        this.onBlur = new EventEmitter();
        /**
         * @name onFocus
         */
        this.onFocus = new EventEmitter();
        /**
         * @name onKeyup
         */
        this.onKeyup = new EventEmitter();
        /**
         * @name onKeydown
         */
        this.onKeydown = new EventEmitter();
        /**
         * @name inputTextChange
         */
        this.inputTextChange = new EventEmitter();
        /**
         * @name validators
         */
        this.validators = [];
        /**
         * @name asyncValidators
         * @desc array of AsyncValidator that are used to validate the tag before it gets appended to the list
         */
        this.asyncValidators = [];
        /**
         * @name tabindex
         * @desc pass through the specified tabindex to the input
         */
        this.tabindex = '';
        /**
         * @name disabled
         */
        this.disabled = false;
        this.item = new FormControl({ value: '', disabled: this.disabled });
    }
    /**
     * @name inputText
     */
    get inputText() {
        return this.item.value;
    }
    /**
     * @name inputText
     * @param text {string}
     */
    set inputText(text) {
        this.item.setValue(text);
        this.inputTextChange.emit(text);
    }
    ngOnInit() {
        this.item.setValidators(this.validators);
        this.item.setAsyncValidators(this.asyncValidators);
        // creating form
        this.form = new FormGroup({
            item: this.item
        });
    }
    ngOnChanges(changes) {
        if (changes.disabled && !changes.disabled.firstChange) {
            if (changes.disabled.currentValue) {
                this.form.controls['item'].disable();
            }
            else {
                this.form.controls['item'].enable();
            }
        }
    }
    /**
     * @name value
     */
    get value() {
        return this.form.get('item');
    }
    /**
     * @name isInputFocused
     */
    isInputFocused() {
        const doc = typeof document !== 'undefined' ? document : undefined;
        return doc ? doc.activeElement === this.input.nativeElement : false;
    }
    /**
     * @name getErrorMessages
     * @param messages
     */
    getErrorMessages(messages) {
        return Object.keys(messages)
            .filter(err => this.value.hasError(err))
            .map(err => messages[err]);
    }
    /**
     * @name hasErrors
     */
    hasErrors() {
        const { dirty, value, valid } = this.form;
        return dirty && value.item && !valid;
    }
    /**
     * @name focus
     */
    focus() {
        this.input.nativeElement.focus();
    }
    /**
     * @name blur
     */
    blur() {
        this.input.nativeElement.blur();
    }
    /**
     * @name getElementPosition
     */
    getElementPosition() {
        return this.input.nativeElement.getBoundingClientRect();
    }
    /**
     * - removes input from the component
     * @name destroy
     */
    destroy() {
        const input = this.input.nativeElement;
        input.parentElement.removeChild(input);
    }
    /**
     * @name onKeyDown
     * @param $event
     */
    onKeyDown($event) {
        this.inputText = this.value.value;
        if ($event.key === 'Backspace') {
            return this.onKeydown.emit($event);
        }
        if ($event.key === 'Enter') {
            this.submit($event);
        }
        else {
            if (this.value.value.length >= this.maxLength) {
                return false;
            }
            else {
                return this.onKeydown.emit($event);
            }
        }
    }
    /**
     * @name onKeyUp
     * @param $event
     */
    onKeyUp($event) {
        this.inputText = this.value.value;
        return this.onKeyup.emit($event);
    }
    /**
     * @name submit
     */
    submit($event) {
        $event.preventDefault();
        if (this.minLength === undefined) {
            this.onSubmit.emit($event);
        }
        else {
            if (this.inputText.length >= this.minLength) {
                this.onSubmit.emit($event);
            }
        }
    }
}
TagInputForm.decorators = [
    { type: Component, args: [{
                selector: 'tag-input-form',
                template: "<!-- form -->\n<form (ngSubmit)=\"submit($event)\" [formGroup]=\"form\">\n    <input #input\n\n           type=\"text\"\n           class=\"ng2-tag-input__text-input\"\n           autocomplete=\"off\"\n           tabindex=\"{{ disabled ? -1 : tabindex ? tabindex : 0 }}\"\n           minlength=\"1\"\n           formControlName=\"item\"\n\n           [ngClass]=\"inputClass\"\n           [attr.id]=\"inputId\"\n           [attr.placeholder]=\"placeholder\"\n           [attr.aria-label]=\"placeholder\"\n           [attr.tabindex]=\"tabindex\"\n           [attr.disabled]=\"disabled ? disabled : null\"\n\n           (focus)=\"onFocus.emit($event)\"\n           (blur)=\"onBlur.emit($event)\"\n           (keydown)=\"onKeyDown($event)\"\n           (keyup)=\"onKeyUp($event)\"\n    />\n</form>\n",
                styles: [".dark tag:focus{box-shadow:0 0 0 1px #323232}.ng2-tag-input.bootstrap3-info{background-color:#fff;color:#555;display:inline-block;height:42px;line-height:44px;max-width:100%;vertical-align:middle}.ng2-tag-input.bootstrap3-info input{background-color:transparent;border:none;box-shadow:none;margin:0;max-width:inherit;outline:none;padding:0 6px;width:auto}.ng2-tag-input.bootstrap3-info .form-control input::-moz-placeholder{color:#777;opacity:1}.ng2-tag-input.bootstrap3-info .form-control input:-ms-input-placeholder{color:#777}.ng2-tag-input.bootstrap3-info .form-control input::-webkit-input-placeholder{color:#777}.ng2-tag-input.bootstrap3-info input:focus{border:none;box-shadow:none}.bootstrap3-info.ng2-tag-input.ng2-tag-input--focused{border:1px solid #ccc;box-shadow:inset 0 1px 1px rgba(0,0,0,.4)}.bootstrap3-info.ng2-tag-input.ng2-tag-input--invalid{box-shadow:inset 0 1px 1px #d9534f}.ng2-tag-input{border-bottom:2px solid #efefef;cursor:text;display:block;flex-direction:row;flex-wrap:wrap;min-height:32px;padding:.25rem 0;position:relative;transition:all .25s}.ng2-tag-input:focus{outline:0}.ng2-tag-input.ng2-tag-input--dropping{opacity:.7}.ng2-tag-input.ng2-tag-input--focused{border-bottom:2px solid #2196f3}.ng2-tag-input.ng2-tag-input--invalid{border-bottom:2px solid #f44336}.ng2-tag-input.ng2-tag-input--loading{border:none}.ng2-tag-input.ng2-tag-input--disabled{cursor:not-allowed;opacity:.5}.ng2-tag-input form{margin:.1em 0}.ng2-tag-input .ng2-tags-container{display:flex;flex-wrap:wrap}.minimal.ng2-tag-input{border-bottom:1px solid transparent;cursor:text;display:block;flex-direction:row;flex-wrap:wrap;position:relative}.minimal.ng2-tag-input:focus{outline:0}.minimal.ng2-tag-input.ng2-tag-input--dropping{opacity:.7}.minimal.ng2-tag-input.ng2-tag-input--loading{border:none}.minimal.ng2-tag-input.ng2-tag-input--disabled{cursor:not-allowed;opacity:.5}.minimal.ng2-tag-input .ng2-tags-container{display:flex;flex-wrap:wrap}.dark.ng2-tag-input{border-bottom:2px solid #444;cursor:text;display:block;flex-direction:row;flex-wrap:wrap;position:relative}.dark.ng2-tag-input:focus{outline:0}.dark.ng2-tag-input.ng2-tag-input--dropping{opacity:.7}.dark.ng2-tag-input.ng2-tag-input--loading{border:none}.dark.ng2-tag-input.ng2-tag-input--disabled{cursor:not-allowed;opacity:.5}.dark.ng2-tag-input .ng2-tags-container{display:flex;flex-wrap:wrap}.bootstrap.ng2-tag-input{border-bottom:2px solid #efefef;cursor:text;display:block;flex-direction:row;flex-wrap:wrap;position:relative}.bootstrap.ng2-tag-input:focus{outline:0}.bootstrap.ng2-tag-input.ng2-tag-input--dropping{opacity:.7}.bootstrap.ng2-tag-input.ng2-tag-input--focused{border-bottom:2px solid #0275d8}.bootstrap.ng2-tag-input.ng2-tag-input--invalid{border-bottom:2px solid #d9534f}.bootstrap.ng2-tag-input.ng2-tag-input--loading{border:none}.bootstrap.ng2-tag-input.ng2-tag-input--disabled{cursor:not-allowed;opacity:.5}.bootstrap.ng2-tag-input .ng2-tags-container{display:flex;flex-wrap:wrap}.bootstrap3-info.ng2-tag-input{border-radius:4px;box-shadow:inset 0 1px 1px rgba(0,0,0,.075);cursor:text;display:block;flex-direction:row;flex-wrap:wrap;padding:4px;position:relative}.bootstrap3-info.ng2-tag-input:focus{outline:0}.bootstrap3-info.ng2-tag-input.ng2-tag-input--dropping{opacity:.7}.bootstrap3-info.ng2-tag-input.ng2-tag-input--invalid{border-bottom:1px solid #d9534f}.bootstrap3-info.ng2-tag-input.ng2-tag-input--loading{border:none}.bootstrap3-info.ng2-tag-input.ng2-tag-input--disabled{cursor:not-allowed;opacity:.5}.bootstrap3-info.ng2-tag-input form{margin:.1em 0}.bootstrap3-info.ng2-tag-input .ng2-tags-container{display:flex;flex-wrap:wrap}.error-message{color:#f44336;font-size:.8em;margin:.5em 0 0}.bootstrap .error-message{color:#d9534f}.ng2-tag-input__text-input{border:none;display:inline;font-family:Roboto,Helvetica Neue,sans-serif;font-size:1em;height:38px;padding:0 .5rem;vertical-align:middle}.ng2-tag-input__text-input:focus{outline:0}.ng2-tag-input__text-input[disabled=true]{background:#fff;opacity:.5}"]
            },] }
];
TagInputForm.propDecorators = {
    onSubmit: [{ type: Output }],
    onBlur: [{ type: Output }],
    onFocus: [{ type: Output }],
    onKeyup: [{ type: Output }],
    onKeydown: [{ type: Output }],
    inputTextChange: [{ type: Output }],
    placeholder: [{ type: Input }],
    validators: [{ type: Input }],
    asyncValidators: [{ type: Input }],
    inputId: [{ type: Input }],
    maxLength: [{ type: Input }],
    minLength: [{ type: Input }],
    inputClass: [{ type: Input }],
    tabindex: [{ type: Input }],
    disabled: [{ type: Input }],
    input: [{ type: ViewChild, args: ['input',] }],
    inputText: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLWlucHV0LWZvcm0uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbW9kdWxlcy9jb21wb25lbnRzL3RhZy1pbnB1dC1mb3JtL3RhZy1pbnB1dC1mb3JtLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQXFCLE1BQU0sRUFBaUIsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3BILE9BQU8sRUFBb0IsV0FBVyxFQUFFLFNBQVMsRUFBZSxNQUFNLGdCQUFnQixDQUFDO0FBT3ZGLE1BQU0sT0FBTyxZQUFZO0lBTHpCO1FBTUk7O1dBRUc7UUFDYyxhQUFRLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFbEU7O1dBRUc7UUFDYyxXQUFNLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFaEU7O1dBRUc7UUFDYyxZQUFPLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFakU7O1dBRUc7UUFDYyxZQUFPLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFakU7O1dBRUc7UUFDYyxjQUFTLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFbkU7O1dBRUc7UUFDYyxvQkFBZSxHQUF5QixJQUFJLFlBQVksRUFBRSxDQUFDO1FBUzVFOztXQUVHO1FBQ2EsZUFBVSxHQUFrQixFQUFFLENBQUM7UUFFL0M7OztXQUdHO1FBQ2Esb0JBQWUsR0FBdUIsRUFBRSxDQUFDO1FBc0J6RDs7O1dBR0c7UUFDYSxhQUFRLEdBQUcsRUFBRSxDQUFDO1FBRTlCOztXQUVHO1FBQ2EsYUFBUSxHQUFHLEtBQUssQ0FBQztRQThCaEIsU0FBSSxHQUFnQixJQUFJLFdBQVcsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0lBaUlqRyxDQUFDO0lBbkpHOztPQUVHO0lBQ0gsSUFDVyxTQUFTO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDM0IsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQVcsU0FBUyxDQUFDLElBQVk7UUFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFekIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUlELFFBQVE7UUFDSixJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFbkQsZ0JBQWdCO1FBQ2hCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxTQUFTLENBQUM7WUFDdEIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1NBQ2xCLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDOUIsSUFBSSxPQUFPLENBQUMsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUU7WUFDbkQsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRTtnQkFDL0IsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDeEM7aUJBQU07Z0JBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDdkM7U0FDSjtJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNILElBQVcsS0FBSztRQUNaLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFnQixDQUFDO0lBQ2hELENBQUM7SUFFRDs7T0FFRztJQUNJLGNBQWM7UUFDakIsTUFBTSxHQUFHLEdBQUcsT0FBTyxRQUFRLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUNuRSxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGFBQWEsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ3hFLENBQUM7SUFFRDs7O09BR0c7SUFDSSxnQkFBZ0IsQ0FBQyxRQUFtQztRQUN2RCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO2FBQ3ZCLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3ZDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFRDs7T0FFRztJQUNJLFNBQVM7UUFDWixNQUFNLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQzFDLE9BQU8sS0FBSyxJQUFJLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDekMsQ0FBQztJQUVEOztPQUVHO0lBQ0ksS0FBSztRQUNSLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFFRDs7T0FFRztJQUNJLElBQUk7UUFDUCxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNwQyxDQUFDO0lBRUQ7O09BRUc7SUFDSSxrQkFBa0I7UUFDckIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0lBQzVELENBQUM7SUFFRDs7O09BR0c7SUFDSSxPQUFPO1FBQ1YsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUM7UUFDdkMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVEOzs7T0FHRztJQUNJLFNBQVMsQ0FBQyxNQUFNO1FBQ3JCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFFbEMsSUFBSSxNQUFNLENBQUMsR0FBRyxLQUFLLFdBQVcsRUFBRTtZQUM5QixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3BDO1FBRUQsSUFBSSxNQUFNLENBQUMsR0FBRyxLQUFLLE9BQU8sRUFBRTtZQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3JCO2FBQU07WUFDTCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUM3QyxPQUFPLEtBQUssQ0FBQzthQUNkO2lCQUFNO2dCQUNMLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDcEM7U0FDRjtJQUNILENBQUM7SUFFRDs7O09BR0c7SUFDSSxPQUFPLENBQUMsTUFBTTtRQUNqQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQ2xDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLE1BQVc7UUFDdkIsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3hCLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxTQUFTLEVBQUU7WUFDaEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDNUI7YUFBTTtZQUNMLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDM0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDNUI7U0FDRjtJQUNILENBQUM7OztZQWpQSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLGdCQUFnQjtnQkFFMUIsdXlCQUE2Qzs7YUFDaEQ7Ozt1QkFLSSxNQUFNO3FCQUtOLE1BQU07c0JBS04sTUFBTTtzQkFLTixNQUFNO3dCQUtOLE1BQU07OEJBS04sTUFBTTswQkFPTixLQUFLO3lCQUtMLEtBQUs7OEJBTUwsS0FBSztzQkFLTCxLQUFLO3dCQUtMLEtBQUs7d0JBS0wsS0FBSzt5QkFLTCxLQUFLO3VCQU1MLEtBQUs7dUJBS0wsS0FBSztvQkFLTCxTQUFTLFNBQUMsT0FBTzt3QkFVakIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25DaGFuZ2VzLCBPbkluaXQsIE91dHB1dCwgU2ltcGxlQ2hhbmdlcywgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBc3luY1ZhbGlkYXRvckZuLCBGb3JtQ29udHJvbCwgRm9ybUdyb3VwLCBWYWxpZGF0b3JGbiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICd0YWctaW5wdXQtZm9ybScsXG4gICAgc3R5bGVVcmxzOiBbJy4vdGFnLWlucHV0LWZvcm0uc3R5bGUuc2NzcyddLFxuICAgIHRlbXBsYXRlVXJsOiAnLi90YWctaW5wdXQtZm9ybS50ZW1wbGF0ZS5odG1sJ1xufSlcbmV4cG9ydCBjbGFzcyBUYWdJbnB1dEZvcm0gaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XG4gICAgLyoqXG4gICAgICogQG5hbWUgb25TdWJtaXRcbiAgICAgKi9cbiAgICBAT3V0cHV0KCkgcHVibGljIG9uU3VibWl0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG9uQmx1clxuICAgICAqL1xuICAgIEBPdXRwdXQoKSBwdWJsaWMgb25CbHVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG9uRm9jdXNcbiAgICAgKi9cbiAgICBAT3V0cHV0KCkgcHVibGljIG9uRm9jdXM6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgb25LZXl1cFxuICAgICAqL1xuICAgIEBPdXRwdXQoKSBwdWJsaWMgb25LZXl1cDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBvbktleWRvd25cbiAgICAgKi9cbiAgICBAT3V0cHV0KCkgcHVibGljIG9uS2V5ZG93bjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBpbnB1dFRleHRDaGFuZ2VcbiAgICAgKi9cbiAgICBAT3V0cHV0KCkgcHVibGljIGlucHV0VGV4dENoYW5nZTogRXZlbnRFbWl0dGVyPHN0cmluZz4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICAvLyBpbnB1dHNcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHBsYWNlaG9sZGVyXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIHBsYWNlaG9sZGVyOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSB2YWxpZGF0b3JzXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIHZhbGlkYXRvcnM6IFZhbGlkYXRvckZuW10gPSBbXTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGFzeW5jVmFsaWRhdG9yc1xuICAgICAqIEBkZXNjIGFycmF5IG9mIEFzeW5jVmFsaWRhdG9yIHRoYXQgYXJlIHVzZWQgdG8gdmFsaWRhdGUgdGhlIHRhZyBiZWZvcmUgaXQgZ2V0cyBhcHBlbmRlZCB0byB0aGUgbGlzdFxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBhc3luY1ZhbGlkYXRvcnM6IEFzeW5jVmFsaWRhdG9yRm5bXSA9IFtdO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgaW5wdXRJZFxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBpbnB1dElkOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBtYXhMZW5ndGhcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMgbWF4TGVuZ3RoOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBtYXhMZW5ndGhcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMgbWluTGVuZ3RoOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBpbnB1dENsYXNzXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIGlucHV0Q2xhc3M6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHRhYmluZGV4XG4gICAgICogQGRlc2MgcGFzcyB0aHJvdWdoIHRoZSBzcGVjaWZpZWQgdGFiaW5kZXggdG8gdGhlIGlucHV0XG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIHRhYmluZGV4ID0gJyc7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBkaXNhYmxlZFxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBkaXNhYmxlZCA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgaW5wdXRcbiAgICAgKi9cbiAgICBAVmlld0NoaWxkKCdpbnB1dCcpIHB1YmxpYyBpbnB1dDtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGZvcm1cbiAgICAgKi9cbiAgICBwdWJsaWMgZm9ybTogRm9ybUdyb3VwO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgaW5wdXRUZXh0XG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZ2V0IGlucHV0VGV4dCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5pdGVtLnZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGlucHV0VGV4dFxuICAgICAqIEBwYXJhbSB0ZXh0IHtzdHJpbmd9XG4gICAgICovXG4gICAgcHVibGljIHNldCBpbnB1dFRleHQodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuaXRlbS5zZXRWYWx1ZSh0ZXh0KTtcblxuICAgICAgICB0aGlzLmlucHV0VGV4dENoYW5nZS5lbWl0KHRleHQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVhZG9ubHkgaXRlbTogRm9ybUNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woeyB2YWx1ZTogJycsIGRpc2FibGVkOiB0aGlzLmRpc2FibGVkIH0pO1xuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMuaXRlbS5zZXRWYWxpZGF0b3JzKHRoaXMudmFsaWRhdG9ycyk7XG4gICAgICAgIHRoaXMuaXRlbS5zZXRBc3luY1ZhbGlkYXRvcnModGhpcy5hc3luY1ZhbGlkYXRvcnMpO1xuXG4gICAgICAgIC8vIGNyZWF0aW5nIGZvcm1cbiAgICAgICAgdGhpcy5mb3JtID0gbmV3IEZvcm1Hcm91cCh7XG4gICAgICAgICAgICBpdGVtOiB0aGlzLml0ZW1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgICAgICBpZiAoY2hhbmdlcy5kaXNhYmxlZCAmJiAhY2hhbmdlcy5kaXNhYmxlZC5maXJzdENoYW5nZSkge1xuICAgICAgICAgICAgaWYgKGNoYW5nZXMuZGlzYWJsZWQuY3VycmVudFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtLmNvbnRyb2xzWydpdGVtJ10uZGlzYWJsZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm0uY29udHJvbHNbJ2l0ZW0nXS5lbmFibGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHZhbHVlXG4gICAgICovXG4gICAgcHVibGljIGdldCB2YWx1ZSgpOiBGb3JtQ29udHJvbCB7XG4gICAgICAgIHJldHVybiB0aGlzLmZvcm0uZ2V0KCdpdGVtJykgYXMgRm9ybUNvbnRyb2w7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgaXNJbnB1dEZvY3VzZWRcbiAgICAgKi9cbiAgICBwdWJsaWMgaXNJbnB1dEZvY3VzZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IGRvYyA9IHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgPyBkb2N1bWVudCA6IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIGRvYyA/IGRvYy5hY3RpdmVFbGVtZW50ID09PSB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQgOiBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBnZXRFcnJvck1lc3NhZ2VzXG4gICAgICogQHBhcmFtIG1lc3NhZ2VzXG4gICAgICovXG4gICAgcHVibGljIGdldEVycm9yTWVzc2FnZXMobWVzc2FnZXM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0pOiBzdHJpbmdbXSB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhtZXNzYWdlcylcbiAgICAgICAgICAgIC5maWx0ZXIoZXJyID0+IHRoaXMudmFsdWUuaGFzRXJyb3IoZXJyKSlcbiAgICAgICAgICAgIC5tYXAoZXJyID0+IG1lc3NhZ2VzW2Vycl0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGhhc0Vycm9yc1xuICAgICAqL1xuICAgIHB1YmxpYyBoYXNFcnJvcnMoKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHsgZGlydHksIHZhbHVlLCB2YWxpZCB9ID0gdGhpcy5mb3JtO1xuICAgICAgICByZXR1cm4gZGlydHkgJiYgdmFsdWUuaXRlbSAmJiAhdmFsaWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgZm9jdXNcbiAgICAgKi9cbiAgICBwdWJsaWMgZm9jdXMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGJsdXJcbiAgICAgKi9cbiAgICBwdWJsaWMgYmx1cigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LmJsdXIoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBnZXRFbGVtZW50UG9zaXRpb25cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0RWxlbWVudFBvc2l0aW9uKCk6IENsaWVudFJlY3Qge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIC0gcmVtb3ZlcyBpbnB1dCBmcm9tIHRoZSBjb21wb25lbnRcbiAgICAgKiBAbmFtZSBkZXN0cm95XG4gICAgICovXG4gICAgcHVibGljIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50O1xuICAgICAgICBpbnB1dC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKGlucHV0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBvbktleURvd25cbiAgICAgKiBAcGFyYW0gJGV2ZW50XG4gICAgICovXG4gICAgcHVibGljIG9uS2V5RG93bigkZXZlbnQpIHtcbiAgICAgIHRoaXMuaW5wdXRUZXh0ID0gdGhpcy52YWx1ZS52YWx1ZTtcblxuICAgICAgaWYgKCRldmVudC5rZXkgPT09ICdCYWNrc3BhY2UnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9uS2V5ZG93bi5lbWl0KCRldmVudCk7XG4gICAgICB9XG5cbiAgICAgIGlmICgkZXZlbnQua2V5ID09PSAnRW50ZXInKSB7XG4gICAgICAgIHRoaXMuc3VibWl0KCRldmVudCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy52YWx1ZS52YWx1ZS5sZW5ndGggPj0gdGhpcy5tYXhMZW5ndGgpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub25LZXlkb3duLmVtaXQoJGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG9uS2V5VXBcbiAgICAgKiBAcGFyYW0gJGV2ZW50XG4gICAgICovXG4gICAgcHVibGljIG9uS2V5VXAoJGV2ZW50KSB7XG4gICAgICAgIHRoaXMuaW5wdXRUZXh0ID0gdGhpcy52YWx1ZS52YWx1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXMub25LZXl1cC5lbWl0KCRldmVudCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgc3VibWl0XG4gICAgICovXG4gICAgcHVibGljIHN1Ym1pdCgkZXZlbnQ6IGFueSk6IHZvaWQge1xuICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAodGhpcy5taW5MZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLm9uU3VibWl0LmVtaXQoJGV2ZW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLmlucHV0VGV4dC5sZW5ndGggPj0gdGhpcy5taW5MZW5ndGgpIHtcbiAgICAgICAgICB0aGlzLm9uU3VibWl0LmVtaXQoJGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbn1cbiJdfQ==