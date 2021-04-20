import { __awaiter } from "tslib";
// angular
import { Component, forwardRef, HostBinding, Input, Output, EventEmitter, Renderer2, ViewChild, ViewChildren, ContentChildren, ContentChild, TemplateRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { debounceTime, filter, map, first } from 'rxjs/operators';
// ng2-tag-input
import { TagInputAccessor } from '../../core/accessor';
import { listen } from '../../core/helpers/listen';
import * as constants from '../../core/constants';
import { DragProvider } from '../../core/providers/drag-provider';
import { TagInputForm } from '../tag-input-form/tag-input-form.component';
import { TagComponent } from '../tag/tag.component';
import { animations } from './animations';
import { defaults } from '../../defaults';
import { TagInputDropdown } from '../dropdown/tag-input-dropdown.component';
// angular universal hacks
/* tslint:disable-next-line */
const DragEvent = typeof window !== 'undefined' && window.DragEvent;
const CUSTOM_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TagInputComponent),
    multi: true
};
export class TagInputComponent extends TagInputAccessor {
    constructor(renderer, dragProvider) {
        super();
        this.renderer = renderer;
        this.dragProvider = dragProvider;
        /**
         * @name separatorKeys
         * @desc keyboard keys with which a user can separate items
         */
        this.separatorKeys = defaults.tagInput.separatorKeys;
        /**
         * @name separatorKeyCodes
         * @desc keyboard key codes with which a user can separate items
         */
        this.separatorKeyCodes = defaults.tagInput.separatorKeyCodes;
        /**
         * @name placeholder
         * @desc the placeholder of the input text
         */
        this.placeholder = defaults.tagInput.placeholder;
        /**
         * @name secondaryPlaceholder
         * @desc placeholder to appear when the input is empty
         */
        this.secondaryPlaceholder = defaults.tagInput.secondaryPlaceholder;
        /**
         * @name maxItems
         * @desc maximum number of items that can be added
         */
        this.maxItems = defaults.tagInput.maxItems;
        /**
         * @name validators
         * @desc array of Validators that are used to validate the tag before it gets appended to the list
         */
        this.validators = defaults.tagInput.validators;
        /**
         * @name asyncValidators
         * @desc array of AsyncValidator that are used to validate the tag before it gets appended to the list
         */
        this.asyncValidators = defaults.tagInput.asyncValidators;
        /**
        * - if set to true, it will only possible to add items from the autocomplete
        * @name onlyFromAutocomplete
        */
        this.onlyFromAutocomplete = defaults.tagInput.onlyFromAutocomplete;
        /**
         * @name errorMessages
         */
        this.errorMessages = defaults.tagInput.errorMessages;
        /**
         * @name theme
         */
        this.theme = defaults.tagInput.theme;
        /**
         * @name onTextChangeDebounce
         */
        this.onTextChangeDebounce = defaults.tagInput.onTextChangeDebounce;
        /**
         * - custom id assigned to the input
         * @name id
         */
        this.inputId = defaults.tagInput.inputId;
        /**
         * - custom class assigned to the input
         */
        this.inputClass = defaults.tagInput.inputClass;
        /**
         * - option to clear text input when the form is blurred
         * @name clearOnBlur
         */
        this.clearOnBlur = defaults.tagInput.clearOnBlur;
        /**
         * - hideForm
         * @name clearOnBlur
         */
        this.hideForm = defaults.tagInput.hideForm;
        /**
         * @name addOnBlur
         */
        this.addOnBlur = defaults.tagInput.addOnBlur;
        /**
         * @name addOnPaste
         */
        this.addOnPaste = defaults.tagInput.addOnPaste;
        /**
         * - pattern used with the native method split() to separate patterns in the string pasted
         * @name pasteSplitPattern
         */
        this.pasteSplitPattern = defaults.tagInput.pasteSplitPattern;
        /**
         * @name blinkIfDupe
         */
        this.blinkIfDupe = defaults.tagInput.blinkIfDupe;
        /**
         * @name removable
         */
        this.removable = defaults.tagInput.removable;
        /**
         * @name editable
         */
        this.editable = defaults.tagInput.editable;
        /**
         * @name allowDupes
         */
        this.allowDupes = defaults.tagInput.allowDupes;
        /**
         * @description if set to true, the newly added tags will be added as strings, and not objects
         * @name modelAsStrings
         */
        this.modelAsStrings = defaults.tagInput.modelAsStrings;
        /**
         * @name trimTags
         */
        this.trimTags = defaults.tagInput.trimTags;
        /**
         * @name ripple
         */
        this.ripple = defaults.tagInput.ripple;
        /**
         * @name tabindex
         * @desc pass through the specified tabindex to the input
         */
        this.tabindex = defaults.tagInput.tabIndex;
        /**
         * @name disable
         */
        this.disable = defaults.tagInput.disable;
        /**
         * @name dragZone
         */
        this.dragZone = defaults.tagInput.dragZone;
        /**
         * @name onRemoving
         */
        this.onRemoving = defaults.tagInput.onRemoving;
        /**
         * @name onAdding
         */
        this.onAdding = defaults.tagInput.onAdding;
        /**
         * @name animationDuration
         */
        this.animationDuration = defaults.tagInput.animationDuration;
        /**
         * @name onAdd
         * @desc event emitted when adding a new item
         */
        this.onAdd = new EventEmitter();
        /**
         * @name onRemove
         * @desc event emitted when removing an existing item
         */
        this.onRemove = new EventEmitter();
        /**
         * @name onSelect
         * @desc event emitted when selecting an item
         */
        this.onSelect = new EventEmitter();
        /**
         * @name onFocus
         * @desc event emitted when the input is focused
         */
        this.onFocus = new EventEmitter();
        /**
         * @name onFocus
         * @desc event emitted when the input is blurred
         */
        this.onBlur = new EventEmitter();
        /**
         * @name onTextChange
         * @desc event emitted when the input value changes
         */
        this.onTextChange = new EventEmitter();
        /**
         * - output triggered when text is pasted in the form
         * @name onPaste
         */
        this.onPaste = new EventEmitter();
        /**
         * - output triggered when tag entered is not valid
         * @name onValidationError
         */
        this.onValidationError = new EventEmitter();
        /**
         * - output triggered when tag is edited
         * @name onTagEdited
         */
        this.onTagEdited = new EventEmitter();
        /**
         * @name isLoading
         */
        this.isLoading = false;
        /**
         * @name listeners
         * @desc array of events that get fired using @fireEvents
         */
        this.listeners = {
            [constants.KEYDOWN]: [],
            [constants.KEYUP]: []
        };
        /**
         * @description emitter for the 2-way data binding inputText value
         * @name inputTextChange
         */
        this.inputTextChange = new EventEmitter();
        /**
         * @description private variable to bind get/set
         * @name inputTextValue
         */
        this.inputTextValue = '';
        this.errors = [];
        /**
         * @name appendTag
         * @param tag {TagModel}
         */
        this.appendTag = (tag, index = this.items.length) => {
            const items = this.items;
            const model = this.modelAsStrings ? tag[this.identifyBy] : tag;
            this.items = [
                ...items.slice(0, index),
                model,
                ...items.slice(index, items.length)
            ];
        };
        /**
         * @name createTag
         * @param model
         */
        this.createTag = (model) => {
            const trim = (val, key) => {
                return typeof val === 'string' ? val.trim() : val[key];
            };
            return Object.assign(Object.assign({}, typeof model !== 'string' ? model : {}), { [this.displayBy]: this.trimTags ? trim(model, this.displayBy) : model, [this.identifyBy]: this.trimTags ? trim(model, this.identifyBy) : model });
        };
        /**
         *
         * @param tag
         * @param isFromAutocomplete
         */
        this.isTagValid = (tag, fromAutocomplete = false) => {
            const selectedItem = this.dropdown ? this.dropdown.selectedItem : undefined;
            const value = this.getItemDisplay(tag).trim();
            if (selectedItem && !fromAutocomplete || !value) {
                return false;
            }
            const dupe = this.findDupe(tag, fromAutocomplete);
            // if so, give a visual cue and return false
            if (!this.allowDupes && dupe && this.blinkIfDupe) {
                const model = this.tags.find(item => {
                    return this.getItemValue(item.model) === this.getItemValue(dupe);
                });
                if (model) {
                    model.blink();
                }
            }
            const isFromAutocomplete = fromAutocomplete && this.onlyFromAutocomplete;
            const assertions = [
                // 1. there must be no dupe OR dupes are allowed
                !dupe || this.allowDupes,
                // 2. check max items has not been reached
                !this.maxItemsReached,
                // 3. check item comes from autocomplete or onlyFromAutocomplete is false
                ((isFromAutocomplete) || !this.onlyFromAutocomplete)
            ];
            return assertions.filter(Boolean).length === assertions.length;
        };
        /**
         * @name onPasteCallback
         * @param data
         */
        this.onPasteCallback = (data) => __awaiter(this, void 0, void 0, function* () {
            const getText = () => {
                const isIE = Boolean(window.clipboardData);
                const clipboardData = isIE ? (window.clipboardData) : data.clipboardData;
                const type = isIE ? 'Text' : 'text/plain';
                return clipboardData === null ? '' : clipboardData.getData(type) || '';
            };
            const text = getText();
            const requests = text
                .split(this.pasteSplitPattern)
                .map(item => {
                const tag = this.createTag(item);
                this.setInputValue(tag[this.displayBy]);
                return this.onAddingRequested(false, tag);
            });
            const resetInput = () => setTimeout(() => this.setInputValue(''), 50);
            Promise.all(requests).then(() => {
                this.onPaste.emit(text);
                resetInput();
            })
                .catch(resetInput);
        });
    }
    /**
     * @name inputText
     */
    get inputText() {
        return this.inputTextValue;
    }
    /**
     * @name inputText
     * @param text
     */
    set inputText(text) {
        this.inputTextValue = text;
        this.inputTextChange.emit(text);
    }
    /**
     * @desc removes the tab index if it is set - it will be passed through to the input
     * @name tabindexAttr
     */
    get tabindexAttr() {
        return this.tabindex !== '' ? '-1' : '';
    }
    /**
     * @name ngAfterViewInit
     */
    ngAfterViewInit() {
        // set up listeners
        this.setUpKeypressListeners();
        this.setupSeparatorKeysListener();
        this.setUpInputKeydownListeners();
        if (this.onTextChange.observers.length) {
            this.setUpTextChangeSubscriber();
        }
        // if clear on blur is set to true, subscribe to the event and clear the text's form
        if (this.clearOnBlur || this.addOnBlur) {
            this.setUpOnBlurSubscriber();
        }
        // if addOnPaste is set to true, register the handler and add items
        if (this.addOnPaste) {
            this.setUpOnPasteListener();
        }
        const statusChanges$ = this.inputForm.form.statusChanges;
        statusChanges$.pipe(filter((status) => status !== 'PENDING')).subscribe(() => {
            this.errors = this.inputForm.getErrorMessages(this.errorMessages);
        });
        this.isProgressBarVisible$ = statusChanges$.pipe(map((status) => {
            return status === 'PENDING' || this.isLoading;
        }));
        // if hideForm is set to true, remove the input
        if (this.hideForm) {
            this.inputForm.destroy();
        }
    }
    /**
     * @name ngOnInit
     */
    ngOnInit() {
        // if the number of items specified in the model is > of the value of maxItems
        // degrade gracefully and let the max number of items to be the number of items in the model
        // though, warn the user.
        const hasReachedMaxItems = this.maxItems !== undefined &&
            this.items &&
            this.items.length > this.maxItems;
        if (hasReachedMaxItems) {
            this.maxItems = this.items.length;
            console.warn(constants.MAX_ITEMS_WARNING);
        }
        // Setting editable to false to fix problem with tags in IE still being editable when
        // onlyFromAutocomplete is true
        this.editable = this.onlyFromAutocomplete ? false : this.editable;
        this.setAnimationMetadata();
    }
    /**
     * @name onRemoveRequested
     * @param tag
     * @param index
     */
    onRemoveRequested(tag, index) {
        return new Promise(resolve => {
            const subscribeFn = (model) => {
                this.removeItem(model, index);
                resolve(tag);
            };
            this.onRemoving ?
                this.onRemoving(tag)
                    .pipe(first())
                    .subscribe(subscribeFn) : subscribeFn(tag);
        });
    }
    /**
     * @name onAddingRequested
     * @param fromAutocomplete {boolean}
     * @param tag {TagModel}
     * @param index? {number}
     * @param giveupFocus? {boolean}
     */
    onAddingRequested(fromAutocomplete, tag, index, giveupFocus) {
        return new Promise((resolve, reject) => {
            const subscribeFn = (model) => {
                return this
                    .addItem(fromAutocomplete, model, index, giveupFocus)
                    .then(resolve)
                    .catch(reject);
            };
            return this.onAdding ?
                this.onAdding(tag)
                    .pipe(first())
                    .subscribe(subscribeFn, reject) : subscribeFn(tag);
        });
    }
    /**
     * @name selectItem
     * @desc selects item passed as parameter as the selected tag
     * @param item
     * @param emit
     */
    selectItem(item, emit = true) {
        const isReadonly = item && typeof item !== 'string' && item.readonly;
        if (isReadonly || this.selectedTag === item) {
            return;
        }
        this.selectedTag = item;
        if (emit) {
            this.onSelect.emit(item);
        }
    }
    /**
     * @name fireEvents
     * @desc goes through the list of the events for a given eventName, and fires each of them
     * @param eventName
     * @param $event
     */
    fireEvents(eventName, $event) {
        this.listeners[eventName].forEach(listener => listener.call(this, $event));
    }
    /**
     * @name handleKeydown
     * @desc handles action when the user hits a keyboard key
     * @param data
     */
    handleKeydown(data) {
        const event = data.event;
        const key = event.keyCode || event.which;
        const shiftKey = event.shiftKey || false;
        switch (constants.KEY_PRESS_ACTIONS[key]) {
            case constants.ACTIONS_KEYS.DELETE:
                if (this.selectedTag && this.removable) {
                    const index = this.items.indexOf(this.selectedTag);
                    this.onRemoveRequested(this.selectedTag, index);
                }
                break;
            case constants.ACTIONS_KEYS.SWITCH_PREV:
                this.moveToTag(data.model, constants.PREV);
                break;
            case constants.ACTIONS_KEYS.SWITCH_NEXT:
                this.moveToTag(data.model, constants.NEXT);
                break;
            case constants.ACTIONS_KEYS.TAB:
                if (shiftKey) {
                    if (this.isFirstTag(data.model)) {
                        return;
                    }
                    this.moveToTag(data.model, constants.PREV);
                }
                else {
                    if (this.isLastTag(data.model) && (this.disable || this.maxItemsReached)) {
                        return;
                    }
                    this.moveToTag(data.model, constants.NEXT);
                }
                break;
            default:
                return;
        }
        // prevent default behaviour
        event.preventDefault();
    }
    onFormSubmit() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.onAddingRequested(false, this.formValue);
            }
            catch (_a) {
                return;
            }
        });
    }
    /**
     * @name setInputValue
     * @param value
     */
    setInputValue(value, emitEvent = true) {
        const control = this.getControl();
        // update form value with the transformed item
        control.setValue(value, { emitEvent });
    }
    /**
     * @name getControl
     */
    getControl() {
        return this.inputForm.value;
    }
    /**
     * @name focus
     * @param applyFocus
     * @param displayAutocomplete
     */
    focus(applyFocus = false, displayAutocomplete = false) {
        if (this.dragProvider.getState('dragging')) {
            return;
        }
        this.selectItem(undefined, false);
        if (applyFocus) {
            this.inputForm.focus();
            this.onFocus.emit(this.formValue);
        }
    }
    /**
     * @name blur
     */
    blur() {
        this.onTouched();
        this.onBlur.emit(this.formValue);
    }
    /**
     * @name hasErrors
     */
    hasErrors() {
        return !!this.inputForm && this.inputForm.hasErrors();
    }
    /**
     * @name isInputFocused
     */
    isInputFocused() {
        return !!this.inputForm && this.inputForm.isInputFocused();
    }
    /**
     * - this is the one way I found to tell if the template has been passed and it is not
     * the template for the menu item
     * @name hasCustomTemplate
     */
    hasCustomTemplate() {
        const template = this.templates ? this.templates.first : undefined;
        const menuTemplate = this.dropdown && this.dropdown.templates ?
            this.dropdown.templates.first : undefined;
        return Boolean(template && template !== menuTemplate);
    }
    /**
     * @name maxItemsReached
     */
    get maxItemsReached() {
        return this.maxItems !== undefined &&
            this.items.length >= this.maxItems;
    }
    /**
     * @name formValue
     */
    get formValue() {
        const form = this.inputForm.value;
        return form ? form.value : '';
    }
    /**3
     * @name onDragStarted
     * @param event
     * @param index
     */
    onDragStarted(event, tag, index) {
        event.stopPropagation();
        const item = { zone: this.dragZone, tag, index };
        this.dragProvider.setSender(this);
        this.dragProvider.setDraggedItem(event, item);
        this.dragProvider.setState({ dragging: true, index });
    }
    /**
     * @name onDragOver
     * @param event
     */
    onDragOver(event, index) {
        this.dragProvider.setState({ dropping: true });
        this.dragProvider.setReceiver(this);
        event.preventDefault();
    }
    /**
     * @name onTagDropped
     * @param event
     * @param index
     */
    onTagDropped(event, index) {
        const item = this.dragProvider.getDraggedItem(event);
        if (!item || item.zone !== this.dragZone) {
            return;
        }
        this.dragProvider.onTagDropped(item.tag, item.index, index);
        event.preventDefault();
        event.stopPropagation();
    }
    /**
     * @name isDropping
     */
    isDropping() {
        const isReceiver = this.dragProvider.receiver === this;
        const isDropping = this.dragProvider.getState('dropping');
        return Boolean(isReceiver && isDropping);
    }
    /**
     * @name onTagBlurred
     * @param changedElement {TagModel}
     * @param index {number}
     */
    onTagBlurred(changedElement, index) {
        this.items[index] = changedElement;
        this.blur();
    }
    /**
     * @name trackBy
     * @param items
     */
    trackBy(index, item) {
        return item[this.identifyBy];
    }
    /**
     * @name updateEditedTag
     * @param tag
     */
    updateEditedTag({ tag, index }) {
        this.onTagEdited.emit(tag);
    }
    /**
     * @name moveToTag
     * @param item
     * @param direction
     */
    moveToTag(item, direction) {
        const isLast = this.isLastTag(item);
        const isFirst = this.isFirstTag(item);
        const stopSwitch = (direction === constants.NEXT && isLast) ||
            (direction === constants.PREV && isFirst);
        if (stopSwitch) {
            this.focus(true);
            return;
        }
        const offset = direction === constants.NEXT ? 1 : -1;
        const index = this.getTagIndex(item) + offset;
        const tag = this.getTagAtIndex(index);
        return tag.select.call(tag);
    }
    /**
     * @name isFirstTag
     * @param item {TagModel}
     */
    isFirstTag(item) {
        return this.tags.first.model === item;
    }
    /**
     * @name isLastTag
     * @param item {TagModel}
     */
    isLastTag(item) {
        return this.tags.last.model === item;
    }
    /**
     * @name getTagIndex
     * @param item
     */
    getTagIndex(item) {
        const tags = this.tags.toArray();
        return tags.findIndex(tag => tag.model === item);
    }
    /**
     * @name getTagAtIndex
     * @param index
     */
    getTagAtIndex(index) {
        const tags = this.tags.toArray();
        return tags[index];
    }
    /**
     * @name removeItem
     * @desc removes an item from the array of the model
     * @param tag {TagModel}
     * @param index {number}
     */
    removeItem(tag, index) {
        this.items = this.getItemsWithout(index);
        // if the removed tag was selected, set it as undefined
        if (this.selectedTag === tag) {
            this.selectItem(undefined, false);
        }
        // focus input
        this.focus(true, false);
        // emit remove event
        this.onRemove.emit(tag);
    }
    /**
     * @name addItem
     * @desc adds the current text model to the items array
     * @param fromAutocomplete {boolean}
     * @param item {TagModel}
     * @param index? {number}
     * @param giveupFocus? {boolean}
     */
    addItem(fromAutocomplete = false, item, index, giveupFocus) {
        const display = this.getItemDisplay(item);
        const tag = this.createTag(item);
        if (fromAutocomplete) {
            this.setInputValue(this.getItemValue(item, true));
        }
        return new Promise((resolve, reject) => {
            /**
             * @name reset
             */
            const reset = () => {
                // reset control and focus input
                this.setInputValue('');
                if (giveupFocus) {
                    this.focus(false, false);
                }
                else {
                    // focus input
                    this.focus(true, false);
                }
                resolve(display);
            };
            const appendItem = () => {
                this.appendTag(tag, index);
                // emit event
                this.onAdd.emit(tag);
                if (!this.dropdown) {
                    return;
                }
                this.dropdown.hide();
                if (this.dropdown.showDropdownIfEmpty) {
                    this.dropdown.show();
                }
            };
            const status = this.inputForm.form.status;
            const isTagValid = this.isTagValid(tag, fromAutocomplete);
            const onValidationError = () => {
                this.onValidationError.emit(tag);
                return reject();
            };
            if (status === 'VALID' && isTagValid) {
                appendItem();
                return reset();
            }
            if (status === 'INVALID' || !isTagValid) {
                reset();
                return onValidationError();
            }
            if (status === 'PENDING') {
                const statusUpdate$ = this.inputForm.form.statusChanges;
                return statusUpdate$
                    .pipe(filter(statusUpdate => statusUpdate !== 'PENDING'), first())
                    .subscribe((statusUpdate) => {
                    if (statusUpdate === 'VALID' && isTagValid) {
                        appendItem();
                        return reset();
                    }
                    else {
                        reset();
                        return onValidationError();
                    }
                });
            }
        });
    }
    /**
     * @name setupSeparatorKeysListener
     */
    setupSeparatorKeysListener() {
        const useSeparatorKeys = this.separatorKeyCodes.length > 0 || this.separatorKeys.length > 0;
        const listener = ($event) => {
            const hasKeyCode = this.separatorKeyCodes.indexOf($event.keyCode) >= 0;
            const hasKey = this.separatorKeys.indexOf($event.key) >= 0;
            // the keyCode of keydown event is 229 when IME is processing the key event.
            const isIMEProcessing = $event.keyCode === 229;
            if (hasKeyCode || (hasKey && !isIMEProcessing)) {
                $event.preventDefault();
                this.onAddingRequested(false, this.formValue)
                    .catch(() => { });
            }
        };
        listen.call(this, constants.KEYDOWN, listener, useSeparatorKeys);
    }
    /**
     * @name setUpKeypressListeners
     */
    setUpKeypressListeners() {
        const listener = ($event) => {
            const isCorrectKey = $event.keyCode === 37 || $event.keyCode === 8;
            if (isCorrectKey &&
                !this.formValue &&
                this.items.length) {
                this.tags.last.select.call(this.tags.last);
            }
        };
        // setting up the keypress listeners
        listen.call(this, constants.KEYDOWN, listener);
    }
    /**
     * @name setUpKeydownListeners
     */
    setUpInputKeydownListeners() {
        this.inputForm.onKeydown.subscribe(event => {
            if (event.key === 'Backspace' && this.formValue.trim() === '') {
                event.preventDefault();
            }
        });
    }
    /**
     * @name setUpOnPasteListener
     */
    setUpOnPasteListener() {
        const input = this.inputForm.input.nativeElement;
        // attach listener to input
        this.renderer.listen(input, 'paste', (event) => {
            this.onPasteCallback(event);
            event.preventDefault();
            return true;
        });
    }
    /**
     * @name setUpTextChangeSubscriber
     */
    setUpTextChangeSubscriber() {
        this.inputForm.form
            .valueChanges
            .pipe(debounceTime(this.onTextChangeDebounce))
            .subscribe((value) => {
            this.onTextChange.emit(value.item);
        });
    }
    /**
     * @name setUpOnBlurSubscriber
     */
    setUpOnBlurSubscriber() {
        const filterFn = () => {
            const isVisible = this.dropdown && this.dropdown.isVisible;
            return !isVisible && !!this.formValue;
        };
        this.inputForm
            .onBlur
            .pipe(debounceTime(100), filter(filterFn))
            .subscribe(() => {
            const reset = () => this.setInputValue('');
            if (this.addOnBlur) {
                return this
                    .onAddingRequested(false, this.formValue, undefined, true)
                    .then(reset)
                    .catch(reset);
            }
            reset();
        });
    }
    /**
     * @name findDupe
     * @param tag
     * @param isFromAutocomplete
     */
    findDupe(tag, isFromAutocomplete) {
        const identifyBy = isFromAutocomplete ? this.dropdown.identifyBy : this.identifyBy;
        const id = tag[identifyBy];
        return this.items.find(item => this.getItemValue(item) === id);
    }
    /**
     * @name setAnimationMetadata
     */
    setAnimationMetadata() {
        this.animationMetadata = {
            value: 'in',
            params: Object.assign({}, this.animationDuration)
        };
    }
}
TagInputComponent.decorators = [
    { type: Component, args: [{
                selector: 'tag-input',
                providers: [CUSTOM_ACCESSOR],
                template: "<div\n    [ngClass]=\"theme\"\n    class=\"ng2-tag-input\"\n    (click)=\"focus(true, false)\"\n    [attr.tabindex]=\"-1\"\n    (drop)=\"dragZone ? onTagDropped($event, undefined) : undefined\"\n    (dragenter)=\"dragZone ? onDragOver($event) : undefined\"\n    (dragover)=\"dragZone ? onDragOver($event) : undefined\"\n    (dragend)=\"dragZone ? dragProvider.onDragEnd() : undefined\"\n    [class.ng2-tag-input--dropping]=\"isDropping()\"\n    [class.ng2-tag-input--disabled]=\"disable\"\n    [class.ng2-tag-input--loading]=\"isLoading\"\n    [class.ng2-tag-input--invalid]=\"hasErrors()\"\n    [class.ng2-tag-input--focused]=\"isInputFocused()\"\n>\n\n    <!-- TAGS -->\n    <div class=\"ng2-tags-container\">\n        <tag\n            *ngFor=\"let item of items; let i = index; trackBy: trackBy\"\n            (onSelect)=\"selectItem(item)\"\n            (onRemove)=\"onRemoveRequested(item, i)\"\n            (onKeyDown)=\"handleKeydown($event)\"\n            (onTagEdited)=\"updateEditedTag($event)\"\n            (onBlur)=\"onTagBlurred($event, i)\"\n            draggable=\"{{ editable }}\"\n            (dragstart)=\"dragZone ? onDragStarted($event, item, i) : undefined\"\n            (drop)=\"dragZone ? onTagDropped($event, i) : undefined\"\n            (dragenter)=\"dragZone ? onDragOver($event) : undefined\"\n            (dragover)=\"dragZone ? onDragOver($event, i) : undefined\"\n            (dragleave)=\"dragZone ? dragProvider.onDragEnd() : undefined\"\n            [canAddTag]=\"isTagValid\"\n            [attr.tabindex]=\"0\"\n            [disabled]=\"disable\"\n            [@animation]=\"animationMetadata\"\n            [hasRipple]=\"ripple\"\n            [index]=\"i\"\n            [removable]=\"removable\"\n            [editable]=\"editable\"\n            [displayBy]=\"displayBy\"\n            [identifyBy]=\"identifyBy\"\n            [template]=\"!!hasCustomTemplate() ? templates.first : undefined\"\n            [draggable]=\"dragZone\"\n            [model]=\"item\"\n        >\n        </tag>\n\n        <tag-input-form\n            (onSubmit)=\"onFormSubmit()\"\n            (onBlur)=\"blur()\"\n            (click)=\"dropdown ? dropdown.show() : undefined\"\n            (onKeydown)=\"fireEvents('keydown', $event)\"\n            (onKeyup)=\"fireEvents('keyup', $event)\"\n            [inputText]=\"inputText\"\n            [disabled]=\"disable\"\n            [validators]=\"validators\"\n            [asyncValidators]=\"asyncValidators\"\n            [hidden]=\"maxItemsReached\"\n            [maxLength]=\"maxlength\"\n            [minLength]=\"minlength\"\n            [placeholder]=\"items.length ? placeholder : secondaryPlaceholder\"\n            [inputClass]=\"inputClass\"\n            [inputId]=\"inputId\"\n            [tabindex]=\"tabindex\"\n        >\n        </tag-input-form>\n    </div>\n\n    <div\n        class=\"progress-bar\"\n        *ngIf=\"isProgressBarVisible$ | async\"\n    ></div>\n</div>\n\n<!-- ERRORS -->\n<div\n    *ngIf=\"hasErrors()\"\n    [ngClass]=\"theme\"\n    class=\"error-messages\"\n>\n    <p\n        *ngFor=\"let error of errors\"\n        class=\"error-message\"\n    >\n        <span>{{ error }}</span>\n    </p>\n</div>\n<ng-content></ng-content>\n",
                animations,
                styles: [".dark tag:focus{box-shadow:0 0 0 1px #323232}.ng2-tag-input.bootstrap3-info{background-color:#fff;color:#555;display:inline-block;height:42px;line-height:44px;max-width:100%;vertical-align:middle}.ng2-tag-input.bootstrap3-info input{background-color:transparent;border:none;box-shadow:none;margin:0;max-width:inherit;outline:none;padding:0 6px;width:auto}.ng2-tag-input.bootstrap3-info .form-control input::-moz-placeholder{color:#777;opacity:1}.ng2-tag-input.bootstrap3-info .form-control input:-ms-input-placeholder{color:#777}.ng2-tag-input.bootstrap3-info .form-control input::-webkit-input-placeholder{color:#777}.ng2-tag-input.bootstrap3-info input:focus{border:none;box-shadow:none}.bootstrap3-info.ng2-tag-input.ng2-tag-input--focused{border:1px solid #ccc;box-shadow:inset 0 1px 1px rgba(0,0,0,.4)}.bootstrap3-info.ng2-tag-input.ng2-tag-input--invalid{box-shadow:inset 0 1px 1px #d9534f}.ng2-tag-input{border-bottom:2px solid #efefef;cursor:text;display:block;flex-direction:row;flex-wrap:wrap;min-height:32px;padding:.25rem 0;position:relative;transition:all .25s}.ng2-tag-input:focus{outline:0}.ng2-tag-input.ng2-tag-input--dropping{opacity:.7}.ng2-tag-input.ng2-tag-input--focused{border-bottom:2px solid #2196f3}.ng2-tag-input.ng2-tag-input--invalid{border-bottom:2px solid #f44336}.ng2-tag-input.ng2-tag-input--loading{border:none}.ng2-tag-input.ng2-tag-input--disabled{cursor:not-allowed;opacity:.5}.ng2-tag-input form{margin:.1em 0}.ng2-tag-input .ng2-tags-container{display:flex;flex-wrap:wrap}.minimal.ng2-tag-input{border-bottom:1px solid transparent;cursor:text;display:block;flex-direction:row;flex-wrap:wrap;position:relative}.minimal.ng2-tag-input:focus{outline:0}.minimal.ng2-tag-input.ng2-tag-input--dropping{opacity:.7}.minimal.ng2-tag-input.ng2-tag-input--loading{border:none}.minimal.ng2-tag-input.ng2-tag-input--disabled{cursor:not-allowed;opacity:.5}.minimal.ng2-tag-input .ng2-tags-container{display:flex;flex-wrap:wrap}.dark.ng2-tag-input{border-bottom:2px solid #444;cursor:text;display:block;flex-direction:row;flex-wrap:wrap;position:relative}.dark.ng2-tag-input:focus{outline:0}.dark.ng2-tag-input.ng2-tag-input--dropping{opacity:.7}.dark.ng2-tag-input.ng2-tag-input--loading{border:none}.dark.ng2-tag-input.ng2-tag-input--disabled{cursor:not-allowed;opacity:.5}.dark.ng2-tag-input .ng2-tags-container{display:flex;flex-wrap:wrap}.bootstrap.ng2-tag-input{border-bottom:2px solid #efefef;cursor:text;display:block;flex-direction:row;flex-wrap:wrap;position:relative}.bootstrap.ng2-tag-input:focus{outline:0}.bootstrap.ng2-tag-input.ng2-tag-input--dropping{opacity:.7}.bootstrap.ng2-tag-input.ng2-tag-input--focused{border-bottom:2px solid #0275d8}.bootstrap.ng2-tag-input.ng2-tag-input--invalid{border-bottom:2px solid #d9534f}.bootstrap.ng2-tag-input.ng2-tag-input--loading{border:none}.bootstrap.ng2-tag-input.ng2-tag-input--disabled{cursor:not-allowed;opacity:.5}.bootstrap.ng2-tag-input .ng2-tags-container{display:flex;flex-wrap:wrap}.bootstrap3-info.ng2-tag-input{border-radius:4px;box-shadow:inset 0 1px 1px rgba(0,0,0,.075);cursor:text;display:block;flex-direction:row;flex-wrap:wrap;padding:4px;position:relative}.bootstrap3-info.ng2-tag-input:focus{outline:0}.bootstrap3-info.ng2-tag-input.ng2-tag-input--dropping{opacity:.7}.bootstrap3-info.ng2-tag-input.ng2-tag-input--invalid{border-bottom:1px solid #d9534f}.bootstrap3-info.ng2-tag-input.ng2-tag-input--loading{border:none}.bootstrap3-info.ng2-tag-input.ng2-tag-input--disabled{cursor:not-allowed;opacity:.5}.bootstrap3-info.ng2-tag-input form{margin:.1em 0}.bootstrap3-info.ng2-tag-input .ng2-tags-container{display:flex;flex-wrap:wrap}.error-message{color:#f44336;font-size:.8em;margin:.5em 0 0}.bootstrap .error-message{color:#d9534f}.progress-bar,.progress-bar:before{height:2px;margin:0;width:100%}.progress-bar{background-color:#2196f3;bottom:0;display:flex;position:absolute}.progress-bar:before{-webkit-animation:running-progress 2s cubic-bezier(.4,0,.2,1) infinite;animation:running-progress 2s cubic-bezier(.4,0,.2,1) infinite;background-color:#82c4f8;content:\"\"}@-webkit-keyframes running-progress{0%{margin-left:0;margin-right:100%}50%{margin-left:25%;margin-right:0}to{margin-left:100%;margin-right:0}}@keyframes running-progress{0%{margin-left:0;margin-right:100%}50%{margin-left:25%;margin-right:0}to{margin-left:100%;margin-right:0}}tag{-moz-user-select:none;-ms-user-select:none;-webkit-user-select:none;background:#efefef;border-radius:16px;color:#444;cursor:pointer;display:flex;flex-direction:row;flex-wrap:wrap;font-family:Roboto,Helvetica Neue,sans-serif;font-size:1em;font-weight:400;height:32px;letter-spacing:.05rem;line-height:34px;margin:.1rem .3rem .1rem 0;outline:0;overflow:hidden;padding:.08rem .45rem;position:relative;transition:all .3s;user-select:none}tag:not(.readonly):not(.tag--editing):focus{background:#2196f3;box-shadow:0 2px 3px 1px #d4d1d1;color:#fff}tag:not(.readonly):not(.tag--editing):active{background:#0d8aee;box-shadow:0 2px 3px 1px #d4d1d1;color:#fff}tag:not(:focus):not(.tag--editing):not(:active):not(.readonly):hover{background:#e2e2e2;box-shadow:0 2px 3px 1px #d4d1d1;color:initial}tag.readonly{cursor:default}tag.readonly:focus,tag:focus{outline:0}tag.tag--editing{background-color:#fff;border:1px solid #ccc;cursor:text}.minimal tag{-moz-user-select:none;-ms-user-select:none;-webkit-user-select:none;background:#f9f9f9;border-radius:0;cursor:pointer;display:flex;flex-direction:row;flex-wrap:wrap;outline:0;overflow:hidden;position:relative;user-select:none}.minimal tag:not(.readonly):not(.tag--editing):active,.minimal tag:not(.readonly):not(.tag--editing):focus{background:#d0d0d0;color:initial}.minimal tag:not(:focus):not(.tag--editing):not(:active):not(.readonly):hover{background:#ececec}.minimal tag.readonly{cursor:default}.minimal tag.readonly:focus,.minimal tag:focus{outline:0}.minimal tag.tag--editing{cursor:text}.dark tag{-moz-user-select:none;-ms-user-select:none;-webkit-user-select:none;background:#444;border-radius:3px;color:#f9f9f9;cursor:pointer;display:flex;flex-direction:row;flex-wrap:wrap;outline:0;overflow:hidden;position:relative;user-select:none}.dark tag:not(.readonly):not(.tag--editing):focus{background:#efefef;color:#444}.dark tag:not(:focus):not(.tag--editing):not(:active):not(.readonly):hover{background:#2b2b2b;color:#f9f9f9}.dark tag.readonly{cursor:default}.dark tag.readonly:focus,.dark tag:focus{outline:0}.dark tag.tag--editing{cursor:text}.bootstrap tag{-moz-user-select:none;-ms-user-select:none;-webkit-user-select:none;background:#0275d8;border-radius:.25rem;color:#f9f9f9;cursor:pointer;display:flex;flex-direction:row;flex-wrap:wrap;outline:0;overflow:hidden;position:relative;user-select:none}.bootstrap tag:not(.readonly):not(.tag--editing):active,.bootstrap tag:not(.readonly):not(.tag--editing):focus{background:#025aa5}.bootstrap tag:not(:focus):not(.tag--editing):not(:active):not(.readonly):hover{background:#0267bf;color:#f9f9f9}.bootstrap tag.readonly{cursor:default}.bootstrap tag.readonly:focus,.bootstrap tag:focus{outline:0}.bootstrap tag.tag--editing{cursor:text}.bootstrap3-info tag{-moz-user-select:none;-ms-user-select:none;-webkit-user-select:none;background:#5bc0de;border-radius:.25em;color:#fff;cursor:pointer;display:flex;flex-direction:row;flex-wrap:wrap;font-family:inherit;font-size:95%;font-weight:400;outline:0;overflow:hidden;padding:.25em .6em;position:relative;text-align:center;user-select:none;white-space:nowrap}.bootstrap3-info tag:not(.readonly):not(.tag--editing):active,.bootstrap3-info tag:not(.readonly):not(.tag--editing):focus{background:#28a1c5}.bootstrap3-info tag:not(:focus):not(.tag--editing):not(:active):not(.readonly):hover{background:#46b8da;color:#fff}.bootstrap3-info tag.readonly{cursor:default}.bootstrap3-info tag.readonly:focus,.bootstrap3-info tag:focus{outline:0}.bootstrap3-info tag.tag--editing{cursor:text}:host{display:block}"]
            },] }
];
TagInputComponent.ctorParameters = () => [
    { type: Renderer2 },
    { type: DragProvider }
];
TagInputComponent.propDecorators = {
    separatorKeys: [{ type: Input }],
    separatorKeyCodes: [{ type: Input }],
    placeholder: [{ type: Input }],
    secondaryPlaceholder: [{ type: Input }],
    maxItems: [{ type: Input }],
    maxlength: [{ type: Input }],
    minlength: [{ type: Input }],
    validators: [{ type: Input }],
    asyncValidators: [{ type: Input }],
    onlyFromAutocomplete: [{ type: Input }],
    errorMessages: [{ type: Input }],
    theme: [{ type: Input }],
    onTextChangeDebounce: [{ type: Input }],
    inputId: [{ type: Input }],
    inputClass: [{ type: Input }],
    clearOnBlur: [{ type: Input }],
    hideForm: [{ type: Input }],
    addOnBlur: [{ type: Input }],
    addOnPaste: [{ type: Input }],
    pasteSplitPattern: [{ type: Input }],
    blinkIfDupe: [{ type: Input }],
    removable: [{ type: Input }],
    editable: [{ type: Input }],
    allowDupes: [{ type: Input }],
    modelAsStrings: [{ type: Input }],
    trimTags: [{ type: Input }],
    inputText: [{ type: Input }],
    ripple: [{ type: Input }],
    tabindex: [{ type: Input }],
    disable: [{ type: Input }],
    dragZone: [{ type: Input }],
    onRemoving: [{ type: Input }],
    onAdding: [{ type: Input }],
    animationDuration: [{ type: Input }],
    onAdd: [{ type: Output }],
    onRemove: [{ type: Output }],
    onSelect: [{ type: Output }],
    onFocus: [{ type: Output }],
    onBlur: [{ type: Output }],
    onTextChange: [{ type: Output }],
    onPaste: [{ type: Output }],
    onValidationError: [{ type: Output }],
    onTagEdited: [{ type: Output }],
    dropdown: [{ type: ContentChild, args: [TagInputDropdown,] }],
    templates: [{ type: ContentChildren, args: [TemplateRef, { descendants: false },] }],
    inputForm: [{ type: ViewChild, args: [TagInputForm,] }],
    tags: [{ type: ViewChildren, args: [TagComponent,] }],
    inputTextChange: [{ type: Output }],
    tabindexAttr: [{ type: HostBinding, args: ['attr.tabindex',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLWlucHV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbW9kdWxlcy9jb21wb25lbnRzL3RhZy1pbnB1dC90YWctaW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFVBQVU7QUFDVixPQUFPLEVBQ0gsU0FBUyxFQUNULFVBQVUsRUFDVixXQUFXLEVBQ1gsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ1osU0FBUyxFQUNULFNBQVMsRUFDVCxZQUFZLEVBQ1osZUFBZSxFQUNmLFlBQVksRUFFWixXQUFXLEVBR2QsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUdILGlCQUFpQixFQUVwQixNQUFNLGdCQUFnQixDQUFDO0FBSXhCLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVsRSxnQkFBZ0I7QUFDaEIsT0FBTyxFQUFFLGdCQUFnQixFQUFZLE1BQU0scUJBQXFCLENBQUM7QUFDakUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ25ELE9BQU8sS0FBSyxTQUFTLE1BQU0sc0JBQXNCLENBQUM7QUFFbEQsT0FBTyxFQUFFLFlBQVksRUFBYyxNQUFNLG9DQUFvQyxDQUFDO0FBRTlFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUMxRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFFcEQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUMxQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDMUMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFFNUUsMEJBQTBCO0FBQzFCLDhCQUE4QjtBQUM5QixNQUFNLFNBQVMsR0FBRyxPQUFPLE1BQU0sS0FBSyxXQUFXLElBQUssTUFBYyxDQUFD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InNvdXJjZXNDb250ZW50IjpbIi8vIGFuZ3VsYXJcbmltcG9ydCB7XG4gICAgQ29tcG9uZW50LFxuICAgIGZvcndhcmRSZWYsXG4gICAgSG9zdEJpbmRpbmcsXG4gICAgSW5wdXQsXG4gICAgT3V0cHV0LFxuICAgIEV2ZW50RW1pdHRlcixcbiAgICBSZW5kZXJlcjIsXG4gICAgVmlld0NoaWxkLFxuICAgIFZpZXdDaGlsZHJlbixcbiAgICBDb250ZW50Q2hpbGRyZW4sXG4gICAgQ29udGVudENoaWxkLFxuICAgIE9uSW5pdCxcbiAgICBUZW1wbGF0ZVJlZixcbiAgICBRdWVyeUxpc3QsXG4gICAgQWZ0ZXJWaWV3SW5pdFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtcbiAgICBBc3luY1ZhbGlkYXRvckZuLFxuICAgIEZvcm1Db250cm9sLFxuICAgIE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgIFZhbGlkYXRvckZuXG59IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuLy8gcnhcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRlYm91bmNlVGltZSwgZmlsdGVyLCBtYXAsIGZpcnN0IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG4vLyBuZzItdGFnLWlucHV0XG5pbXBvcnQgeyBUYWdJbnB1dEFjY2Vzc29yLCBUYWdNb2RlbCB9IGZyb20gJy4uLy4uL2NvcmUvYWNjZXNzb3InO1xuaW1wb3J0IHsgbGlzdGVuIH0gZnJvbSAnLi4vLi4vY29yZS9oZWxwZXJzL2xpc3Rlbic7XG5pbXBvcnQgKiBhcyBjb25zdGFudHMgZnJvbSAnLi4vLi4vY29yZS9jb25zdGFudHMnO1xuXG5pbXBvcnQgeyBEcmFnUHJvdmlkZXIsIERyYWdnZWRUYWcgfSBmcm9tICcuLi8uLi9jb3JlL3Byb3ZpZGVycy9kcmFnLXByb3ZpZGVyJztcblxuaW1wb3J0IHsgVGFnSW5wdXRGb3JtIH0gZnJvbSAnLi4vdGFnLWlucHV0LWZvcm0vdGFnLWlucHV0LWZvcm0uY29tcG9uZW50JztcbmltcG9ydCB7IFRhZ0NvbXBvbmVudCB9IGZyb20gJy4uL3RhZy90YWcuY29tcG9uZW50JztcblxuaW1wb3J0IHsgYW5pbWF0aW9ucyB9IGZyb20gJy4vYW5pbWF0aW9ucyc7XG5pbXBvcnQgeyBkZWZhdWx0cyB9IGZyb20gJy4uLy4uL2RlZmF1bHRzJztcbmltcG9ydCB7IFRhZ0lucHV0RHJvcGRvd24gfSBmcm9tICcuLi9kcm9wZG93bi90YWctaW5wdXQtZHJvcGRvd24uY29tcG9uZW50JztcblxuLy8gYW5ndWxhciB1bml2ZXJzYWwgaGFja3Ncbi8qIHRzbGludDpkaXNhYmxlLW5leHQtbGluZSAqL1xuY29uc3QgRHJhZ0V2ZW50ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgKHdpbmRvdyBhcyBhbnkpLkRyYWdFdmVudDtcblxuY29uc3QgQ1VTVE9NX0FDQ0VTU09SID0ge1xuICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFRhZ0lucHV0Q29tcG9uZW50KSxcbiAgICBtdWx0aTogdHJ1ZVxufTtcbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAndGFnLWlucHV0JyxcbiAgICBwcm92aWRlcnM6IFtDVVNUT01fQUNDRVNTT1JdLFxuICAgIHN0eWxlVXJsczogWycuL3RhZy1pbnB1dC5zdHlsZS5zY3NzJ10sXG4gICAgdGVtcGxhdGVVcmw6ICcuL3RhZy1pbnB1dC50ZW1wbGF0ZS5odG1sJyxcbiAgICBhbmltYXRpb25zXG59KVxuZXhwb3J0IGNsYXNzIFRhZ0lucHV0Q29tcG9uZW50IGV4dGVuZHMgVGFnSW5wdXRBY2Nlc3NvciBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XG4gICAgLyoqXG4gICAgICogQG5hbWUgc2VwYXJhdG9yS2V5c1xuICAgICAqIEBkZXNjIGtleWJvYXJkIGtleXMgd2l0aCB3aGljaCBhIHVzZXIgY2FuIHNlcGFyYXRlIGl0ZW1zXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIHNlcGFyYXRvcktleXM6IHN0cmluZ1tdID0gZGVmYXVsdHMudGFnSW5wdXQuc2VwYXJhdG9yS2V5cztcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHNlcGFyYXRvcktleUNvZGVzXG4gICAgICogQGRlc2Mga2V5Ym9hcmQga2V5IGNvZGVzIHdpdGggd2hpY2ggYSB1c2VyIGNhbiBzZXBhcmF0ZSBpdGVtc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBzZXBhcmF0b3JLZXlDb2RlczogbnVtYmVyW10gPSBkZWZhdWx0cy50YWdJbnB1dC5zZXBhcmF0b3JLZXlDb2RlcztcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHBsYWNlaG9sZGVyXG4gICAgICogQGRlc2MgdGhlIHBsYWNlaG9sZGVyIG9mIHRoZSBpbnB1dCB0ZXh0XG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIHBsYWNlaG9sZGVyOiBzdHJpbmcgPSBkZWZhdWx0cy50YWdJbnB1dC5wbGFjZWhvbGRlcjtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHNlY29uZGFyeVBsYWNlaG9sZGVyXG4gICAgICogQGRlc2MgcGxhY2Vob2xkZXIgdG8gYXBwZWFyIHdoZW4gdGhlIGlucHV0IGlzIGVtcHR5XG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIHNlY29uZGFyeVBsYWNlaG9sZGVyOiBzdHJpbmcgPSBkZWZhdWx0cy50YWdJbnB1dC5zZWNvbmRhcnlQbGFjZWhvbGRlcjtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG1heEl0ZW1zXG4gICAgICogQGRlc2MgbWF4aW11bSBudW1iZXIgb2YgaXRlbXMgdGhhdCBjYW4gYmUgYWRkZWRcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMgbWF4SXRlbXM6IG51bWJlciA9IGRlZmF1bHRzLnRhZ0lucHV0Lm1heEl0ZW1zO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgbWF4SXRlbXNcbiAgICAgKiBAZGVzYyBtYXhpbXVtIG51bWJlciBvZiBpdGVtcyB0aGF0IGNhbiBiZSBhZGRlZFxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBtYXhsZW5ndGg6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG1heEl0ZW1zXG4gICAgICogQGRlc2MgbWluaW11biBudW1iZXIgb2YgdGV4dFxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBtaW5sZW5ndGg6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHZhbGlkYXRvcnNcbiAgICAgKiBAZGVzYyBhcnJheSBvZiBWYWxpZGF0b3JzIHRoYXQgYXJlIHVzZWQgdG8gdmFsaWRhdGUgdGhlIHRhZyBiZWZvcmUgaXQgZ2V0cyBhcHBlbmRlZCB0byB0aGUgbGlzdFxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyB2YWxpZGF0b3JzOiBWYWxpZGF0b3JGbltdID0gZGVmYXVsdHMudGFnSW5wdXQudmFsaWRhdG9ycztcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGFzeW5jVmFsaWRhdG9yc1xuICAgICAqIEBkZXNjIGFycmF5IG9mIEFzeW5jVmFsaWRhdG9yIHRoYXQgYXJlIHVzZWQgdG8gdmFsaWRhdGUgdGhlIHRhZyBiZWZvcmUgaXQgZ2V0cyBhcHBlbmRlZCB0byB0aGUgbGlzdFxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBhc3luY1ZhbGlkYXRvcnM6IEFzeW5jVmFsaWRhdG9yRm5bXSA9IGRlZmF1bHRzLnRhZ0lucHV0LmFzeW5jVmFsaWRhdG9ycztcblxuICAgIC8qKlxuICAgICogLSBpZiBzZXQgdG8gdHJ1ZSwgaXQgd2lsbCBvbmx5IHBvc3NpYmxlIHRvIGFkZCBpdGVtcyBmcm9tIHRoZSBhdXRvY29tcGxldGVcbiAgICAqIEBuYW1lIG9ubHlGcm9tQXV0b2NvbXBsZXRlXG4gICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMgb25seUZyb21BdXRvY29tcGxldGUgPSBkZWZhdWx0cy50YWdJbnB1dC5vbmx5RnJvbUF1dG9jb21wbGV0ZTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGVycm9yTWVzc2FnZXNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMgZXJyb3JNZXNzYWdlczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IGRlZmF1bHRzLnRhZ0lucHV0LmVycm9yTWVzc2FnZXM7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSB0aGVtZVxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyB0aGVtZTogc3RyaW5nID0gZGVmYXVsdHMudGFnSW5wdXQudGhlbWU7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBvblRleHRDaGFuZ2VEZWJvdW5jZVxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBvblRleHRDaGFuZ2VEZWJvdW5jZSA9IGRlZmF1bHRzLnRhZ0lucHV0Lm9uVGV4dENoYW5nZURlYm91bmNlO1xuXG4gICAgLyoqXG4gICAgICogLSBjdXN0b20gaWQgYXNzaWduZWQgdG8gdGhlIGlucHV0XG4gICAgICogQG5hbWUgaWRcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMgaW5wdXRJZCA9IGRlZmF1bHRzLnRhZ0lucHV0LmlucHV0SWQ7XG5cbiAgICAvKipcbiAgICAgKiAtIGN1c3RvbSBjbGFzcyBhc3NpZ25lZCB0byB0aGUgaW5wdXRcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMgaW5wdXRDbGFzczogc3RyaW5nID0gZGVmYXVsdHMudGFnSW5wdXQuaW5wdXRDbGFzcztcblxuICAgIC8qKlxuICAgICAqIC0gb3B0aW9uIHRvIGNsZWFyIHRleHQgaW5wdXQgd2hlbiB0aGUgZm9ybSBpcyBibHVycmVkXG4gICAgICogQG5hbWUgY2xlYXJPbkJsdXJcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMgY2xlYXJPbkJsdXI6IGJvb2xlYW4gPSBkZWZhdWx0cy50YWdJbnB1dC5jbGVhck9uQmx1cjtcblxuICAgIC8qKlxuICAgICAqIC0gaGlkZUZvcm1cbiAgICAgKiBAbmFtZSBjbGVhck9uQmx1clxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBoaWRlRm9ybTogYm9vbGVhbiA9IGRlZmF1bHRzLnRhZ0lucHV0LmhpZGVGb3JtO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgYWRkT25CbHVyXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIGFkZE9uQmx1cjogYm9vbGVhbiA9IGRlZmF1bHRzLnRhZ0lucHV0LmFkZE9uQmx1cjtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGFkZE9uUGFzdGVcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMgYWRkT25QYXN0ZTogYm9vbGVhbiA9IGRlZmF1bHRzLnRhZ0lucHV0LmFkZE9uUGFzdGU7XG5cbiAgICAvKipcbiAgICAgKiAtIHBhdHRlcm4gdXNlZCB3aXRoIHRoZSBuYXRpdmUgbWV0aG9kIHNwbGl0KCkgdG8gc2VwYXJhdGUgcGF0dGVybnMgaW4gdGhlIHN0cmluZyBwYXN0ZWRcbiAgICAgKiBAbmFtZSBwYXN0ZVNwbGl0UGF0dGVyblxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBwYXN0ZVNwbGl0UGF0dGVybiA9IGRlZmF1bHRzLnRhZ0lucHV0LnBhc3RlU3BsaXRQYXR0ZXJuO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgYmxpbmtJZkR1cGVcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMgYmxpbmtJZkR1cGUgPSBkZWZhdWx0cy50YWdJbnB1dC5ibGlua0lmRHVwZTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHJlbW92YWJsZVxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyByZW1vdmFibGUgPSBkZWZhdWx0cy50YWdJbnB1dC5yZW1vdmFibGU7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBlZGl0YWJsZVxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBlZGl0YWJsZTogYm9vbGVhbiA9IGRlZmF1bHRzLnRhZ0lucHV0LmVkaXRhYmxlO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgYWxsb3dEdXBlc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBhbGxvd0R1cGVzID0gZGVmYXVsdHMudGFnSW5wdXQuYWxsb3dEdXBlcztcblxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBpZiBzZXQgdG8gdHJ1ZSwgdGhlIG5ld2x5IGFkZGVkIHRhZ3Mgd2lsbCBiZSBhZGRlZCBhcyBzdHJpbmdzLCBhbmQgbm90IG9iamVjdHNcbiAgICAgKiBAbmFtZSBtb2RlbEFzU3RyaW5nc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBtb2RlbEFzU3RyaW5ncyA9IGRlZmF1bHRzLnRhZ0lucHV0Lm1vZGVsQXNTdHJpbmdzO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgdHJpbVRhZ3NcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMgdHJpbVRhZ3MgPSBkZWZhdWx0cy50YWdJbnB1dC50cmltVGFncztcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGlucHV0VGV4dFxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBnZXQgaW5wdXRUZXh0KCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmlucHV0VGV4dFZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHJpcHBsZVxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyByaXBwbGU6IGJvb2xlYW4gPSBkZWZhdWx0cy50YWdJbnB1dC5yaXBwbGU7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSB0YWJpbmRleFxuICAgICAqIEBkZXNjIHBhc3MgdGhyb3VnaCB0aGUgc3BlY2lmaWVkIHRhYmluZGV4IHRvIHRoZSBpbnB1dFxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyB0YWJpbmRleDogc3RyaW5nID0gZGVmYXVsdHMudGFnSW5wdXQudGFiSW5kZXg7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBkaXNhYmxlXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIGRpc2FibGU6IGJvb2xlYW4gPSBkZWZhdWx0cy50YWdJbnB1dC5kaXNhYmxlO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgZHJhZ1pvbmVcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwdWJsaWMgZHJhZ1pvbmU6IHN0cmluZyA9IGRlZmF1bHRzLnRhZ0lucHV0LmRyYWdab25lO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgb25SZW1vdmluZ1xuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBvblJlbW92aW5nID0gZGVmYXVsdHMudGFnSW5wdXQub25SZW1vdmluZztcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG9uQWRkaW5nXG4gICAgICovXG4gICAgQElucHV0KCkgcHVibGljIG9uQWRkaW5nID0gZGVmYXVsdHMudGFnSW5wdXQub25BZGRpbmc7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBhbmltYXRpb25EdXJhdGlvblxuICAgICAqL1xuICAgIEBJbnB1dCgpIHB1YmxpYyBhbmltYXRpb25EdXJhdGlvbiA9IGRlZmF1bHRzLnRhZ0lucHV0LmFuaW1hdGlvbkR1cmF0aW9uO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgb25BZGRcbiAgICAgKiBAZGVzYyBldmVudCBlbWl0dGVkIHdoZW4gYWRkaW5nIGEgbmV3IGl0ZW1cbiAgICAgKi9cbiAgICBAT3V0cHV0KCkgcHVibGljIG9uQWRkID0gbmV3IEV2ZW50RW1pdHRlcjxUYWdNb2RlbD4oKTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG9uUmVtb3ZlXG4gICAgICogQGRlc2MgZXZlbnQgZW1pdHRlZCB3aGVuIHJlbW92aW5nIGFuIGV4aXN0aW5nIGl0ZW1cbiAgICAgKi9cbiAgICBAT3V0cHV0KCkgcHVibGljIG9uUmVtb3ZlID0gbmV3IEV2ZW50RW1pdHRlcjxUYWdNb2RlbD4oKTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG9uU2VsZWN0XG4gICAgICogQGRlc2MgZXZlbnQgZW1pdHRlZCB3aGVuIHNlbGVjdGluZyBhbiBpdGVtXG4gICAgICovXG4gICAgQE91dHB1dCgpIHB1YmxpYyBvblNlbGVjdCA9IG5ldyBFdmVudEVtaXR0ZXI8VGFnTW9kZWw+KCk7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBvbkZvY3VzXG4gICAgICogQGRlc2MgZXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBpbnB1dCBpcyBmb2N1c2VkXG4gICAgICovXG4gICAgQE91dHB1dCgpIHB1YmxpYyBvbkZvY3VzID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBvbkZvY3VzXG4gICAgICogQGRlc2MgZXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBpbnB1dCBpcyBibHVycmVkXG4gICAgICovXG4gICAgQE91dHB1dCgpIHB1YmxpYyBvbkJsdXIgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG9uVGV4dENoYW5nZVxuICAgICAqIEBkZXNjIGV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgaW5wdXQgdmFsdWUgY2hhbmdlc1xuICAgICAqL1xuICAgIEBPdXRwdXQoKSBwdWJsaWMgb25UZXh0Q2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxUYWdNb2RlbD4oKTtcblxuICAgIC8qKlxuICAgICAqIC0gb3V0cHV0IHRyaWdnZXJlZCB3aGVuIHRleHQgaXMgcGFzdGVkIGluIHRoZSBmb3JtXG4gICAgICogQG5hbWUgb25QYXN0ZVxuICAgICAqL1xuICAgIEBPdXRwdXQoKSBwdWJsaWMgb25QYXN0ZSA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuXG4gICAgLyoqXG4gICAgICogLSBvdXRwdXQgdHJpZ2dlcmVkIHdoZW4gdGFnIGVudGVyZWQgaXMgbm90IHZhbGlkXG4gICAgICogQG5hbWUgb25WYWxpZGF0aW9uRXJyb3JcbiAgICAgKi9cbiAgICBAT3V0cHV0KCkgcHVibGljIG9uVmFsaWRhdGlvbkVycm9yID0gbmV3IEV2ZW50RW1pdHRlcjxUYWdNb2RlbD4oKTtcblxuICAgIC8qKlxuICAgICAqIC0gb3V0cHV0IHRyaWdnZXJlZCB3aGVuIHRhZyBpcyBlZGl0ZWRcbiAgICAgKiBAbmFtZSBvblRhZ0VkaXRlZFxuICAgICAqL1xuICAgIEBPdXRwdXQoKSBwdWJsaWMgb25UYWdFZGl0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPFRhZ01vZGVsPigpO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgZHJvcGRvd25cbiAgICAgKi9cbiAgICAvLyBAQ29udGVudENoaWxkKGZvcndhcmRSZWYoKCkgPT4gVGFnSW5wdXREcm9wZG93biksIHtzdGF0aWM6IHRydWV9KSBkcm9wZG93bjogVGFnSW5wdXREcm9wZG93bjtcbiAgICBAQ29udGVudENoaWxkKFRhZ0lucHV0RHJvcGRvd24pIHB1YmxpYyBkcm9wZG93bjogVGFnSW5wdXREcm9wZG93bjtcbiAgICAvKipcbiAgICAgKiBAbmFtZSB0ZW1wbGF0ZVxuICAgICAqIEBkZXNjIHJlZmVyZW5jZSB0byB0aGUgdGVtcGxhdGUgaWYgcHJvdmlkZWQgYnkgdGhlIHVzZXJcbiAgICAgKi9cbiAgICBAQ29udGVudENoaWxkcmVuKFRlbXBsYXRlUmVmLCB7IGRlc2NlbmRhbnRzOiBmYWxzZSB9KSBwdWJsaWMgdGVtcGxhdGVzOiBRdWVyeUxpc3Q8VGVtcGxhdGVSZWY8YW55Pj47XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBpbnB1dEZvcm1cbiAgICAgKi9cbiAgICBAVmlld0NoaWxkKFRhZ0lucHV0Rm9ybSkgcHVibGljIGlucHV0Rm9ybTogVGFnSW5wdXRGb3JtO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgc2VsZWN0ZWRUYWdcbiAgICAgKiBAZGVzYyByZWZlcmVuY2UgdG8gdGhlIGN1cnJlbnQgc2VsZWN0ZWQgdGFnXG4gICAgICovXG4gICAgcHVibGljIHNlbGVjdGVkVGFnOiBUYWdNb2RlbCB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGlzTG9hZGluZ1xuICAgICAqL1xuICAgIHB1YmxpYyBpc0xvYWRpbmcgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGlucHV0VGV4dFxuICAgICAqIEBwYXJhbSB0ZXh0XG4gICAgICovXG4gICAgcHVibGljIHNldCBpbnB1dFRleHQodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuaW5wdXRUZXh0VmFsdWUgPSB0ZXh0O1xuICAgICAgICB0aGlzLmlucHV0VGV4dENoYW5nZS5lbWl0KHRleHQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHRhZ3NcbiAgICAgKiBAZGVzYyBsaXN0IG9mIEVsZW1lbnQgaXRlbXNcbiAgICAgKi9cbiAgICBAVmlld0NoaWxkcmVuKFRhZ0NvbXBvbmVudCkgcHVibGljIHRhZ3M6IFF1ZXJ5TGlzdDxUYWdDb21wb25lbnQ+O1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgbGlzdGVuZXJzXG4gICAgICogQGRlc2MgYXJyYXkgb2YgZXZlbnRzIHRoYXQgZ2V0IGZpcmVkIHVzaW5nIEBmaXJlRXZlbnRzXG4gICAgICovXG4gICAgcHJpdmF0ZSBsaXN0ZW5lcnMgPSB7XG4gICAgICAgIFtjb25zdGFudHMuS0VZRE9XTl06IDx7IChmdW4pOiBhbnkgfVtdPltdLFxuICAgICAgICBbY29uc3RhbnRzLktFWVVQXTogPHsgKGZ1bik6IGFueSB9W10+W11cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIGVtaXR0ZXIgZm9yIHRoZSAyLXdheSBkYXRhIGJpbmRpbmcgaW5wdXRUZXh0IHZhbHVlXG4gICAgICogQG5hbWUgaW5wdXRUZXh0Q2hhbmdlXG4gICAgICovXG4gICAgQE91dHB1dCgpIHB1YmxpYyBpbnB1dFRleHRDaGFuZ2U6IEV2ZW50RW1pdHRlcjxzdHJpbmc+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIHByaXZhdGUgdmFyaWFibGUgdG8gYmluZCBnZXQvc2V0XG4gICAgICogQG5hbWUgaW5wdXRUZXh0VmFsdWVcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5wdXRUZXh0VmFsdWUgPSAnJztcblxuICAgIC8qKlxuICAgICAqIEBkZXNjIHJlbW92ZXMgdGhlIHRhYiBpbmRleCBpZiBpdCBpcyBzZXQgLSBpdCB3aWxsIGJlIHBhc3NlZCB0aHJvdWdoIHRvIHRoZSBpbnB1dFxuICAgICAqIEBuYW1lIHRhYmluZGV4QXR0clxuICAgICAqL1xuICAgIEBIb3N0QmluZGluZygnYXR0ci50YWJpbmRleCcpXG4gICAgcHVibGljIGdldCB0YWJpbmRleEF0dHIoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGFiaW5kZXggIT09ICcnID8gJy0xJyA6ICcnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGFuaW1hdGlvbk1ldGFkYXRhXG4gICAgICovXG4gICAgcHVibGljIGFuaW1hdGlvbk1ldGFkYXRhOiB7IHZhbHVlOiBzdHJpbmcsIHBhcmFtczogb2JqZWN0IH07XG5cbiAgICBwdWJsaWMgZXJyb3JzOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgcHVibGljIGlzUHJvZ3Jlc3NCYXJWaXNpYmxlJDogT2JzZXJ2YWJsZTxib29sZWFuPjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICAgICAgcHVibGljIHJlYWRvbmx5IGRyYWdQcm92aWRlcjogRHJhZ1Byb3ZpZGVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgbmdBZnRlclZpZXdJbml0XG4gICAgICovXG4gICAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICAgICAgLy8gc2V0IHVwIGxpc3RlbmVyc1xuXG4gICAgICAgIHRoaXMuc2V0VXBLZXlwcmVzc0xpc3RlbmVycygpO1xuICAgICAgICB0aGlzLnNldHVwU2VwYXJhdG9yS2V5c0xpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMuc2V0VXBJbnB1dEtleWRvd25MaXN0ZW5lcnMoKTtcblxuICAgICAgICBpZiAodGhpcy5vblRleHRDaGFuZ2Uub2JzZXJ2ZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5zZXRVcFRleHRDaGFuZ2VTdWJzY3JpYmVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiBjbGVhciBvbiBibHVyIGlzIHNldCB0byB0cnVlLCBzdWJzY3JpYmUgdG8gdGhlIGV2ZW50IGFuZCBjbGVhciB0aGUgdGV4dCdzIGZvcm1cbiAgICAgICAgaWYgKHRoaXMuY2xlYXJPbkJsdXIgfHwgdGhpcy5hZGRPbkJsdXIpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VXBPbkJsdXJTdWJzY3JpYmVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiBhZGRPblBhc3RlIGlzIHNldCB0byB0cnVlLCByZWdpc3RlciB0aGUgaGFuZGxlciBhbmQgYWRkIGl0ZW1zXG4gICAgICAgIGlmICh0aGlzLmFkZE9uUGFzdGUpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VXBPblBhc3RlTGlzdGVuZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN0YXR1c0NoYW5nZXMkID0gdGhpcy5pbnB1dEZvcm0uZm9ybS5zdGF0dXNDaGFuZ2VzO1xuXG4gICAgICAgIHN0YXR1c0NoYW5nZXMkLnBpcGUoXG4gICAgICAgICAgICBmaWx0ZXIoKHN0YXR1czogc3RyaW5nKSA9PiBzdGF0dXMgIT09ICdQRU5ESU5HJylcbiAgICAgICAgKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lcnJvcnMgPSB0aGlzLmlucHV0Rm9ybS5nZXRFcnJvck1lc3NhZ2VzKHRoaXMuZXJyb3JNZXNzYWdlcyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuaXNQcm9ncmVzc0JhclZpc2libGUkID0gc3RhdHVzQ2hhbmdlcyQucGlwZShcbiAgICAgICAgICAgIG1hcCgoc3RhdHVzOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdHVzID09PSAnUEVORElORycgfHwgdGhpcy5pc0xvYWRpbmc7XG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIGlmIGhpZGVGb3JtIGlzIHNldCB0byB0cnVlLCByZW1vdmUgdGhlIGlucHV0XG4gICAgICAgIGlmICh0aGlzLmhpZGVGb3JtKSB7XG4gICAgICAgICAgICB0aGlzLmlucHV0Rm9ybS5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBuZ09uSW5pdFxuICAgICAqL1xuICAgIHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgLy8gaWYgdGhlIG51bWJlciBvZiBpdGVtcyBzcGVjaWZpZWQgaW4gdGhlIG1vZGVsIGlzID4gb2YgdGhlIHZhbHVlIG9mIG1heEl0ZW1zXG4gICAgICAgIC8vIGRlZ3JhZGUgZ3JhY2VmdWxseSBhbmQgbGV0IHRoZSBtYXggbnVtYmVyIG9mIGl0ZW1zIHRvIGJlIHRoZSBudW1iZXIgb2YgaXRlbXMgaW4gdGhlIG1vZGVsXG4gICAgICAgIC8vIHRob3VnaCwgd2FybiB0aGUgdXNlci5cbiAgICAgICAgY29uc3QgaGFzUmVhY2hlZE1heEl0ZW1zID0gdGhpcy5tYXhJdGVtcyAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICB0aGlzLml0ZW1zICYmXG4gICAgICAgICAgICB0aGlzLml0ZW1zLmxlbmd0aCA+IHRoaXMubWF4SXRlbXM7XG5cbiAgICAgICAgaWYgKGhhc1JlYWNoZWRNYXhJdGVtcykge1xuICAgICAgICAgICAgdGhpcy5tYXhJdGVtcyA9IHRoaXMuaXRlbXMubGVuZ3RoO1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGNvbnN0YW50cy5NQVhfSVRFTVNfV0FSTklORyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXR0aW5nIGVkaXRhYmxlIHRvIGZhbHNlIHRvIGZpeCBwcm9ibGVtIHdpdGggdGFncyBpbiBJRSBzdGlsbCBiZWluZyBlZGl0YWJsZSB3aGVuXG4gICAgICAgIC8vIG9ubHlGcm9tQXV0b2NvbXBsZXRlIGlzIHRydWVcbiAgICAgICAgdGhpcy5lZGl0YWJsZSA9IHRoaXMub25seUZyb21BdXRvY29tcGxldGUgPyBmYWxzZSA6IHRoaXMuZWRpdGFibGU7XG5cbiAgICAgICAgdGhpcy5zZXRBbmltYXRpb25NZXRhZGF0YSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG9uUmVtb3ZlUmVxdWVzdGVkXG4gICAgICogQHBhcmFtIHRhZ1xuICAgICAqIEBwYXJhbSBpbmRleFxuICAgICAqL1xuICAgIHB1YmxpYyBvblJlbW92ZVJlcXVlc3RlZCh0YWc6IFRhZ01vZGVsLCBpbmRleDogbnVtYmVyKTogUHJvbWlzZTxUYWdNb2RlbD4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzdWJzY3JpYmVGbiA9IChtb2RlbDogVGFnTW9kZWwpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUl0ZW0obW9kZWwsIGluZGV4KTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRhZyk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLm9uUmVtb3ZpbmcgP1xuICAgICAgICAgICAgICAgIHRoaXMub25SZW1vdmluZyh0YWcpXG4gICAgICAgICAgICAgICAgICAgIC5waXBlKGZpcnN0KCkpXG4gICAgICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoc3Vic2NyaWJlRm4pIDogc3Vic2NyaWJlRm4odGFnKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgb25BZGRpbmdSZXF1ZXN0ZWRcbiAgICAgKiBAcGFyYW0gZnJvbUF1dG9jb21wbGV0ZSB7Ym9vbGVhbn1cbiAgICAgKiBAcGFyYW0gdGFnIHtUYWdNb2RlbH1cbiAgICAgKiBAcGFyYW0gaW5kZXg/IHtudW1iZXJ9XG4gICAgICogQHBhcmFtIGdpdmV1cEZvY3VzPyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBwdWJsaWMgb25BZGRpbmdSZXF1ZXN0ZWQoZnJvbUF1dG9jb21wbGV0ZTogYm9vbGVhbiwgdGFnOiBUYWdNb2RlbCxcbiAgICAgICAgaW5kZXg/OiBudW1iZXIsIGdpdmV1cEZvY3VzPzogYm9vbGVhbik6IFByb21pc2U8VGFnTW9kZWw+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHN1YnNjcmliZUZuID0gKG1vZGVsOiBUYWdNb2RlbCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzXG4gICAgICAgICAgICAgICAgICAgIC5hZGRJdGVtKGZyb21BdXRvY29tcGxldGUsIG1vZGVsLCBpbmRleCwgZ2l2ZXVwRm9jdXMpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc29sdmUpXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChyZWplY3QpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMub25BZGRpbmcgP1xuICAgICAgICAgICAgICAgIHRoaXMub25BZGRpbmcodGFnKVxuICAgICAgICAgICAgICAgICAgICAucGlwZShmaXJzdCgpKVxuICAgICAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKHN1YnNjcmliZUZuLCByZWplY3QpIDogc3Vic2NyaWJlRm4odGFnKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgYXBwZW5kVGFnXG4gICAgICogQHBhcmFtIHRhZyB7VGFnTW9kZWx9XG4gICAgICovXG4gICAgcHVibGljIGFwcGVuZFRhZyA9ICh0YWc6IFRhZ01vZGVsLCBpbmRleCA9IHRoaXMuaXRlbXMubGVuZ3RoKTogdm9pZCA9PiB7XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5pdGVtcztcbiAgICAgICAgY29uc3QgbW9kZWwgPSB0aGlzLm1vZGVsQXNTdHJpbmdzID8gdGFnW3RoaXMuaWRlbnRpZnlCeV0gOiB0YWc7XG5cbiAgICAgICAgdGhpcy5pdGVtcyA9IFtcbiAgICAgICAgICAgIC4uLml0ZW1zLnNsaWNlKDAsIGluZGV4KSxcbiAgICAgICAgICAgIG1vZGVsLFxuICAgICAgICAgICAgLi4uaXRlbXMuc2xpY2UoaW5kZXgsIGl0ZW1zLmxlbmd0aClcbiAgICAgICAgXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBjcmVhdGVUYWdcbiAgICAgKiBAcGFyYW0gbW9kZWxcbiAgICAgKi9cbiAgICBwdWJsaWMgY3JlYXRlVGFnID0gKG1vZGVsOiBUYWdNb2RlbCk6IFRhZ01vZGVsID0+IHtcbiAgICAgICAgY29uc3QgdHJpbSA9ICh2YWw6IFRhZ01vZGVsLCBrZXk6IHN0cmluZyk6IFRhZ01vZGVsID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJyA/IHZhbC50cmltKCkgOiB2YWxba2V5XTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLi4udHlwZW9mIG1vZGVsICE9PSAnc3RyaW5nJyA/IG1vZGVsIDoge30sXG4gICAgICAgICAgICBbdGhpcy5kaXNwbGF5QnldOiB0aGlzLnRyaW1UYWdzID8gdHJpbShtb2RlbCwgdGhpcy5kaXNwbGF5QnkpIDogbW9kZWwsXG4gICAgICAgICAgICBbdGhpcy5pZGVudGlmeUJ5XTogdGhpcy50cmltVGFncyA/IHRyaW0obW9kZWwsIHRoaXMuaWRlbnRpZnlCeSkgOiBtb2RlbFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHNlbGVjdEl0ZW1cbiAgICAgKiBAZGVzYyBzZWxlY3RzIGl0ZW0gcGFzc2VkIGFzIHBhcmFtZXRlciBhcyB0aGUgc2VsZWN0ZWQgdGFnXG4gICAgICogQHBhcmFtIGl0ZW1cbiAgICAgKiBAcGFyYW0gZW1pdFxuICAgICAqL1xuICAgIHB1YmxpYyBzZWxlY3RJdGVtKGl0ZW06IFRhZ01vZGVsIHwgdW5kZWZpbmVkLCBlbWl0ID0gdHJ1ZSk6IHZvaWQge1xuICAgICAgICBjb25zdCBpc1JlYWRvbmx5ID0gaXRlbSAmJiB0eXBlb2YgaXRlbSAhPT0gJ3N0cmluZycgJiYgaXRlbS5yZWFkb25seTtcblxuICAgICAgICBpZiAoaXNSZWFkb25seSB8fCB0aGlzLnNlbGVjdGVkVGFnID09PSBpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNlbGVjdGVkVGFnID0gaXRlbTtcblxuICAgICAgICBpZiAoZW1pdCkge1xuICAgICAgICAgICAgdGhpcy5vblNlbGVjdC5lbWl0KGl0ZW0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgZmlyZUV2ZW50c1xuICAgICAqIEBkZXNjIGdvZXMgdGhyb3VnaCB0aGUgbGlzdCBvZiB0aGUgZXZlbnRzIGZvciBhIGdpdmVuIGV2ZW50TmFtZSwgYW5kIGZpcmVzIGVhY2ggb2YgdGhlbVxuICAgICAqIEBwYXJhbSBldmVudE5hbWVcbiAgICAgKiBAcGFyYW0gJGV2ZW50XG4gICAgICovXG4gICAgcHVibGljIGZpcmVFdmVudHMoZXZlbnROYW1lOiBzdHJpbmcsICRldmVudD8pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnNbZXZlbnROYW1lXS5mb3JFYWNoKGxpc3RlbmVyID0+IGxpc3RlbmVyLmNhbGwodGhpcywgJGV2ZW50KSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgaGFuZGxlS2V5ZG93blxuICAgICAqIEBkZXNjIGhhbmRsZXMgYWN0aW9uIHdoZW4gdGhlIHVzZXIgaGl0cyBhIGtleWJvYXJkIGtleVxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICovXG4gICAgcHVibGljIGhhbmRsZUtleWRvd24oZGF0YTogYW55KTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGV2ZW50ID0gZGF0YS5ldmVudDtcbiAgICAgICAgY29uc3Qga2V5ID0gZXZlbnQua2V5Q29kZSB8fCBldmVudC53aGljaDtcbiAgICAgICAgY29uc3Qgc2hpZnRLZXkgPSBldmVudC5zaGlmdEtleSB8fCBmYWxzZTtcblxuICAgICAgICBzd2l0Y2ggKGNvbnN0YW50cy5LRVlfUFJFU1NfQUNUSU9OU1trZXldKSB7XG4gICAgICAgICAgICBjYXNlIGNvbnN0YW50cy5BQ1RJT05TX0tFWVMuREVMRVRFOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkVGFnICYmIHRoaXMucmVtb3ZhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5pdGVtcy5pbmRleE9mKHRoaXMuc2VsZWN0ZWRUYWcpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uUmVtb3ZlUmVxdWVzdGVkKHRoaXMuc2VsZWN0ZWRUYWcsIGluZGV4KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgY29uc3RhbnRzLkFDVElPTlNfS0VZUy5TV0lUQ0hfUFJFVjpcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVUb1RhZyhkYXRhLm1vZGVsLCBjb25zdGFudHMuUFJFVik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgY29uc3RhbnRzLkFDVElPTlNfS0VZUy5TV0lUQ0hfTkVYVDpcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVUb1RhZyhkYXRhLm1vZGVsLCBjb25zdGFudHMuTkVYVCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgY29uc3RhbnRzLkFDVElPTlNfS0VZUy5UQUI6XG4gICAgICAgICAgICAgICAgaWYgKHNoaWZ0S2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzRmlyc3RUYWcoZGF0YS5tb2RlbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZVRvVGFnKGRhdGEubW9kZWwsIGNvbnN0YW50cy5QUkVWKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0xhc3RUYWcoZGF0YS5tb2RlbCkgJiYgKHRoaXMuZGlzYWJsZSB8fCB0aGlzLm1heEl0ZW1zUmVhY2hlZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZVRvVGFnKGRhdGEubW9kZWwsIGNvbnN0YW50cy5ORVhUKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcHJldmVudCBkZWZhdWx0IGJlaGF2aW91clxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBvbkZvcm1TdWJtaXQoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLm9uQWRkaW5nUmVxdWVzdGVkKGZhbHNlLCB0aGlzLmZvcm1WYWx1ZSk7XG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgc2V0SW5wdXRWYWx1ZVxuICAgICAqIEBwYXJhbSB2YWx1ZVxuICAgICAqL1xuICAgIHB1YmxpYyBzZXRJbnB1dFZhbHVlKHZhbHVlOiBzdHJpbmcsIGVtaXRFdmVudCA9IHRydWUpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgY29udHJvbCA9IHRoaXMuZ2V0Q29udHJvbCgpO1xuXG4gICAgICAgIC8vIHVwZGF0ZSBmb3JtIHZhbHVlIHdpdGggdGhlIHRyYW5zZm9ybWVkIGl0ZW1cbiAgICAgICAgY29udHJvbC5zZXRWYWx1ZSh2YWx1ZSwgeyBlbWl0RXZlbnQgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgZ2V0Q29udHJvbFxuICAgICAqL1xuICAgIHByaXZhdGUgZ2V0Q29udHJvbCgpOiBGb3JtQ29udHJvbCB7XG4gICAgICAgIHJldHVybiB0aGlzLmlucHV0Rm9ybS52YWx1ZSBhcyBGb3JtQ29udHJvbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBmb2N1c1xuICAgICAqIEBwYXJhbSBhcHBseUZvY3VzXG4gICAgICogQHBhcmFtIGRpc3BsYXlBdXRvY29tcGxldGVcbiAgICAgKi9cbiAgICBwdWJsaWMgZm9jdXMoYXBwbHlGb2N1cyA9IGZhbHNlLCBkaXNwbGF5QXV0b2NvbXBsZXRlID0gZmFsc2UpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuZHJhZ1Byb3ZpZGVyLmdldFN0YXRlKCdkcmFnZ2luZycpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNlbGVjdEl0ZW0odW5kZWZpbmVkLCBmYWxzZSk7XG5cbiAgICAgICAgaWYgKGFwcGx5Rm9jdXMpIHtcbiAgICAgICAgICAgIHRoaXMuaW5wdXRGb3JtLmZvY3VzKCk7XG4gICAgICAgICAgICB0aGlzLm9uRm9jdXMuZW1pdCh0aGlzLmZvcm1WYWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBibHVyXG4gICAgICovXG4gICAgcHVibGljIGJsdXIoKTogdm9pZCB7XG4gICAgICAgIHRoaXMub25Ub3VjaGVkKCk7XG5cbiAgICAgICAgdGhpcy5vbkJsdXIuZW1pdCh0aGlzLmZvcm1WYWx1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgaGFzRXJyb3JzXG4gICAgICovXG4gICAgcHVibGljIGhhc0Vycm9ycygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5pbnB1dEZvcm0gJiYgdGhpcy5pbnB1dEZvcm0uaGFzRXJyb3JzKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgaXNJbnB1dEZvY3VzZWRcbiAgICAgKi9cbiAgICBwdWJsaWMgaXNJbnB1dEZvY3VzZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuaW5wdXRGb3JtICYmIHRoaXMuaW5wdXRGb3JtLmlzSW5wdXRGb2N1c2VkKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogLSB0aGlzIGlzIHRoZSBvbmUgd2F5IEkgZm91bmQgdG8gdGVsbCBpZiB0aGUgdGVtcGxhdGUgaGFzIGJlZW4gcGFzc2VkIGFuZCBpdCBpcyBub3RcbiAgICAgKiB0aGUgdGVtcGxhdGUgZm9yIHRoZSBtZW51IGl0ZW1cbiAgICAgKiBAbmFtZSBoYXNDdXN0b21UZW1wbGF0ZVxuICAgICAqL1xuICAgIHB1YmxpYyBoYXNDdXN0b21UZW1wbGF0ZSgpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlcyA/IHRoaXMudGVtcGxhdGVzLmZpcnN0IDogdW5kZWZpbmVkO1xuICAgICAgICBjb25zdCBtZW51VGVtcGxhdGUgPSB0aGlzLmRyb3Bkb3duICYmIHRoaXMuZHJvcGRvd24udGVtcGxhdGVzID9cbiAgICAgICAgICAgIHRoaXMuZHJvcGRvd24udGVtcGxhdGVzLmZpcnN0IDogdW5kZWZpbmVkO1xuXG4gICAgICAgIHJldHVybiBCb29sZWFuKHRlbXBsYXRlICYmIHRlbXBsYXRlICE9PSBtZW51VGVtcGxhdGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG1heEl0ZW1zUmVhY2hlZFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgbWF4SXRlbXNSZWFjaGVkKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5tYXhJdGVtcyAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICB0aGlzLml0ZW1zLmxlbmd0aCA+PSB0aGlzLm1heEl0ZW1zO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGZvcm1WYWx1ZVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgZm9ybVZhbHVlKCk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IGZvcm0gPSB0aGlzLmlucHV0Rm9ybS52YWx1ZTtcblxuICAgICAgICByZXR1cm4gZm9ybSA/IGZvcm0udmFsdWUgOiAnJztcbiAgICB9XG5cbiAgICAvKiozXG4gICAgICogQG5hbWUgb25EcmFnU3RhcnRlZFxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqIEBwYXJhbSBpbmRleFxuICAgICAqL1xuICAgIHB1YmxpYyBvbkRyYWdTdGFydGVkKGV2ZW50OiBEcmFnRXZlbnQsIHRhZzogVGFnTW9kZWwsIGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgY29uc3QgaXRlbSA9IHsgem9uZTogdGhpcy5kcmFnWm9uZSwgdGFnLCBpbmRleCB9IGFzIERyYWdnZWRUYWc7XG5cbiAgICAgICAgdGhpcy5kcmFnUHJvdmlkZXIuc2V0U2VuZGVyKHRoaXMpO1xuICAgICAgICB0aGlzLmRyYWdQcm92aWRlci5zZXREcmFnZ2VkSXRlbShldmVudCwgaXRlbSk7XG4gICAgICAgIHRoaXMuZHJhZ1Byb3ZpZGVyLnNldFN0YXRlKHsgZHJhZ2dpbmc6IHRydWUsIGluZGV4IH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG9uRHJhZ092ZXJcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKi9cbiAgICBwdWJsaWMgb25EcmFnT3ZlcihldmVudDogRHJhZ0V2ZW50LCBpbmRleD86IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLmRyYWdQcm92aWRlci5zZXRTdGF0ZSh7IGRyb3BwaW5nOiB0cnVlIH0pO1xuICAgICAgICB0aGlzLmRyYWdQcm92aWRlci5zZXRSZWNlaXZlcih0aGlzKTtcblxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG9uVGFnRHJvcHBlZFxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqIEBwYXJhbSBpbmRleFxuICAgICAqL1xuICAgIHB1YmxpYyBvblRhZ0Ryb3BwZWQoZXZlbnQ6IERyYWdFdmVudCwgaW5kZXg/OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMuZHJhZ1Byb3ZpZGVyLmdldERyYWdnZWRJdGVtKGV2ZW50KTtcblxuICAgICAgICBpZiAoIWl0ZW0gfHwgaXRlbS56b25lICE9PSB0aGlzLmRyYWdab25lKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRyYWdQcm92aWRlci5vblRhZ0Ryb3BwZWQoaXRlbS50YWcsIGl0ZW0uaW5kZXgsIGluZGV4KTtcblxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBpc0Ryb3BwaW5nXG4gICAgICovXG4gICAgcHVibGljIGlzRHJvcHBpbmcoKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IGlzUmVjZWl2ZXIgPSB0aGlzLmRyYWdQcm92aWRlci5yZWNlaXZlciA9PT0gdGhpcztcbiAgICAgICAgY29uc3QgaXNEcm9wcGluZyA9IHRoaXMuZHJhZ1Byb3ZpZGVyLmdldFN0YXRlKCdkcm9wcGluZycpO1xuXG4gICAgICAgIHJldHVybiBCb29sZWFuKGlzUmVjZWl2ZXIgJiYgaXNEcm9wcGluZyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgb25UYWdCbHVycmVkXG4gICAgICogQHBhcmFtIGNoYW5nZWRFbGVtZW50IHtUYWdNb2RlbH1cbiAgICAgKiBAcGFyYW0gaW5kZXgge251bWJlcn1cbiAgICAgKi9cbiAgICBwdWJsaWMgb25UYWdCbHVycmVkKGNoYW5nZWRFbGVtZW50OiBUYWdNb2RlbCwgaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLml0ZW1zW2luZGV4XSA9IGNoYW5nZWRFbGVtZW50O1xuICAgICAgICB0aGlzLmJsdXIoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSB0cmFja0J5XG4gICAgICogQHBhcmFtIGl0ZW1zXG4gICAgICovXG4gICAgcHVibGljIHRyYWNrQnkoaW5kZXg6IG51bWJlciwgaXRlbTogVGFnTW9kZWwpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gaXRlbVt0aGlzLmlkZW50aWZ5QnldO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHVwZGF0ZUVkaXRlZFRhZ1xuICAgICAqIEBwYXJhbSB0YWdcbiAgICAgKi9cbiAgICBwdWJsaWMgdXBkYXRlRWRpdGVkVGFnKHsgdGFnLCBpbmRleCB9OiB7IHRhZzogVGFnTW9kZWwsIGluZGV4OiBudW1iZXIgfSk6IHZvaWQge1xuICAgICAgICB0aGlzLm9uVGFnRWRpdGVkLmVtaXQodGFnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0YWdcbiAgICAgKiBAcGFyYW0gaXNGcm9tQXV0b2NvbXBsZXRlXG4gICAgICovXG4gICAgcHVibGljIGlzVGFnVmFsaWQgPSAodGFnOiBUYWdNb2RlbCwgZnJvbUF1dG9jb21wbGV0ZSA9IGZhbHNlKTogYm9vbGVhbiA9PiB7XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkSXRlbSA9IHRoaXMuZHJvcGRvd24gPyB0aGlzLmRyb3Bkb3duLnNlbGVjdGVkSXRlbSA6IHVuZGVmaW5lZDtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmdldEl0ZW1EaXNwbGF5KHRhZykudHJpbSgpO1xuXG4gICAgICAgIGlmIChzZWxlY3RlZEl0ZW0gJiYgIWZyb21BdXRvY29tcGxldGUgfHwgIXZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkdXBlID0gdGhpcy5maW5kRHVwZSh0YWcsIGZyb21BdXRvY29tcGxldGUpO1xuXG4gICAgICAgIC8vIGlmIHNvLCBnaXZlIGEgdmlzdWFsIGN1ZSBhbmQgcmV0dXJuIGZhbHNlXG4gICAgICAgIGlmICghdGhpcy5hbGxvd0R1cGVzICYmIGR1cGUgJiYgdGhpcy5ibGlua0lmRHVwZSkge1xuICAgICAgICAgICAgY29uc3QgbW9kZWwgPSB0aGlzLnRhZ3MuZmluZChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRJdGVtVmFsdWUoaXRlbS5tb2RlbCkgPT09IHRoaXMuZ2V0SXRlbVZhbHVlKGR1cGUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChtb2RlbCkge1xuICAgICAgICAgICAgICAgIG1vZGVsLmJsaW5rKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpc0Zyb21BdXRvY29tcGxldGUgPSBmcm9tQXV0b2NvbXBsZXRlICYmIHRoaXMub25seUZyb21BdXRvY29tcGxldGU7XG5cbiAgICAgICAgY29uc3QgYXNzZXJ0aW9ucyA9IFtcbiAgICAgICAgICAgIC8vIDEuIHRoZXJlIG11c3QgYmUgbm8gZHVwZSBPUiBkdXBlcyBhcmUgYWxsb3dlZFxuICAgICAgICAgICAgIWR1cGUgfHwgdGhpcy5hbGxvd0R1cGVzLFxuXG4gICAgICAgICAgICAvLyAyLiBjaGVjayBtYXggaXRlbXMgaGFzIG5vdCBiZWVuIHJlYWNoZWRcbiAgICAgICAgICAgICF0aGlzLm1heEl0ZW1zUmVhY2hlZCxcblxuICAgICAgICAgICAgLy8gMy4gY2hlY2sgaXRlbSBjb21lcyBmcm9tIGF1dG9jb21wbGV0ZSBvciBvbmx5RnJvbUF1dG9jb21wbGV0ZSBpcyBmYWxzZVxuICAgICAgICAgICAgKChpc0Zyb21BdXRvY29tcGxldGUpIHx8ICF0aGlzLm9ubHlGcm9tQXV0b2NvbXBsZXRlKVxuICAgICAgICBdO1xuXG4gICAgICAgIHJldHVybiBhc3NlcnRpb25zLmZpbHRlcihCb29sZWFuKS5sZW5ndGggPT09IGFzc2VydGlvbnMubGVuZ3RoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG1vdmVUb1RhZ1xuICAgICAqIEBwYXJhbSBpdGVtXG4gICAgICogQHBhcmFtIGRpcmVjdGlvblxuICAgICAqL1xuICAgIHByaXZhdGUgbW92ZVRvVGFnKGl0ZW06IFRhZ01vZGVsLCBkaXJlY3Rpb246IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBjb25zdCBpc0xhc3QgPSB0aGlzLmlzTGFzdFRhZyhpdGVtKTtcbiAgICAgICAgY29uc3QgaXNGaXJzdCA9IHRoaXMuaXNGaXJzdFRhZyhpdGVtKTtcbiAgICAgICAgY29uc3Qgc3RvcFN3aXRjaCA9IChkaXJlY3Rpb24gPT09IGNvbnN0YW50cy5ORVhUICYmIGlzTGFzdCkgfHxcbiAgICAgICAgICAgIChkaXJlY3Rpb24gPT09IGNvbnN0YW50cy5QUkVWICYmIGlzRmlyc3QpO1xuXG4gICAgICAgIGlmIChzdG9wU3dpdGNoKSB7XG4gICAgICAgICAgICB0aGlzLmZvY3VzKHRydWUpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgb2Zmc2V0ID0gZGlyZWN0aW9uID09PSBjb25zdGFudHMuTkVYVCA/IDEgOiAtMTtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmdldFRhZ0luZGV4KGl0ZW0pICsgb2Zmc2V0O1xuICAgICAgICBjb25zdCB0YWcgPSB0aGlzLmdldFRhZ0F0SW5kZXgoaW5kZXgpO1xuXG4gICAgICAgIHJldHVybiB0YWcuc2VsZWN0LmNhbGwodGFnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBpc0ZpcnN0VGFnXG4gICAgICogQHBhcmFtIGl0ZW0ge1RhZ01vZGVsfVxuICAgICAqL1xuICAgIHByaXZhdGUgaXNGaXJzdFRhZyhpdGVtOiBUYWdNb2RlbCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy50YWdzLmZpcnN0Lm1vZGVsID09PSBpdGVtO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGlzTGFzdFRhZ1xuICAgICAqIEBwYXJhbSBpdGVtIHtUYWdNb2RlbH1cbiAgICAgKi9cbiAgICBwcml2YXRlIGlzTGFzdFRhZyhpdGVtOiBUYWdNb2RlbCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy50YWdzLmxhc3QubW9kZWwgPT09IGl0ZW07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgZ2V0VGFnSW5kZXhcbiAgICAgKiBAcGFyYW0gaXRlbVxuICAgICAqL1xuICAgIHByaXZhdGUgZ2V0VGFnSW5kZXgoaXRlbTogVGFnTW9kZWwpOiBudW1iZXIge1xuICAgICAgICBjb25zdCB0YWdzID0gdGhpcy50YWdzLnRvQXJyYXkoKTtcblxuICAgICAgICByZXR1cm4gdGFncy5maW5kSW5kZXgodGFnID0+IHRhZy5tb2RlbCA9PT0gaXRlbSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgZ2V0VGFnQXRJbmRleFxuICAgICAqIEBwYXJhbSBpbmRleFxuICAgICAqL1xuICAgIHByaXZhdGUgZ2V0VGFnQXRJbmRleChpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IHRhZ3MgPSB0aGlzLnRhZ3MudG9BcnJheSgpO1xuXG4gICAgICAgIHJldHVybiB0YWdzW2luZGV4XTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSByZW1vdmVJdGVtXG4gICAgICogQGRlc2MgcmVtb3ZlcyBhbiBpdGVtIGZyb20gdGhlIGFycmF5IG9mIHRoZSBtb2RlbFxuICAgICAqIEBwYXJhbSB0YWcge1RhZ01vZGVsfVxuICAgICAqIEBwYXJhbSBpbmRleCB7bnVtYmVyfVxuICAgICAqL1xuICAgIHB1YmxpYyByZW1vdmVJdGVtKHRhZzogVGFnTW9kZWwsIGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pdGVtcyA9IHRoaXMuZ2V0SXRlbXNXaXRob3V0KGluZGV4KTtcblxuICAgICAgICAvLyBpZiB0aGUgcmVtb3ZlZCB0YWcgd2FzIHNlbGVjdGVkLCBzZXQgaXQgYXMgdW5kZWZpbmVkXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkVGFnID09PSB0YWcpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0SXRlbSh1bmRlZmluZWQsIGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGZvY3VzIGlucHV0XG4gICAgICAgIHRoaXMuZm9jdXModHJ1ZSwgZmFsc2UpO1xuXG4gICAgICAgIC8vIGVtaXQgcmVtb3ZlIGV2ZW50XG4gICAgICAgIHRoaXMub25SZW1vdmUuZW1pdCh0YWcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGFkZEl0ZW1cbiAgICAgKiBAZGVzYyBhZGRzIHRoZSBjdXJyZW50IHRleHQgbW9kZWwgdG8gdGhlIGl0ZW1zIGFycmF5XG4gICAgICogQHBhcmFtIGZyb21BdXRvY29tcGxldGUge2Jvb2xlYW59XG4gICAgICogQHBhcmFtIGl0ZW0ge1RhZ01vZGVsfVxuICAgICAqIEBwYXJhbSBpbmRleD8ge251bWJlcn1cbiAgICAgKiBAcGFyYW0gZ2l2ZXVwRm9jdXM/IHtib29sZWFufVxuICAgICAqL1xuICAgIHByaXZhdGUgYWRkSXRlbShmcm9tQXV0b2NvbXBsZXRlID0gZmFsc2UsIGl0ZW06IFRhZ01vZGVsLCBpbmRleD86IG51bWJlciwgZ2l2ZXVwRm9jdXM/OiBib29sZWFuKTpcbiAgICAgICAgUHJvbWlzZTxUYWdNb2RlbD4ge1xuICAgICAgICBjb25zdCBkaXNwbGF5ID0gdGhpcy5nZXRJdGVtRGlzcGxheShpdGVtKTtcbiAgICAgICAgY29uc3QgdGFnID0gdGhpcy5jcmVhdGVUYWcoaXRlbSk7XG5cbiAgICAgICAgaWYgKGZyb21BdXRvY29tcGxldGUpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0SW5wdXRWYWx1ZSh0aGlzLmdldEl0ZW1WYWx1ZShpdGVtLCB0cnVlKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbmFtZSByZXNldFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCByZXNldCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgICAvLyByZXNldCBjb250cm9sIGFuZCBmb2N1cyBpbnB1dFxuICAgICAgICAgICAgICAgIHRoaXMuc2V0SW5wdXRWYWx1ZSgnJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZ2l2ZXVwRm9jdXMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mb2N1cyhmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGZvY3VzIGlucHV0XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZm9jdXModHJ1ZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGlzcGxheSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCBhcHBlbmRJdGVtID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwZW5kVGFnKHRhZywgaW5kZXgpO1xuXG4gICAgICAgICAgICAgICAgLy8gZW1pdCBldmVudFxuICAgICAgICAgICAgICAgIHRoaXMub25BZGQuZW1pdCh0YWcpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmRyb3Bkb3duKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmRyb3Bkb3duLmhpZGUoKTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRyb3Bkb3duLnNob3dEcm9wZG93bklmRW1wdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcm9wZG93bi5zaG93KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3Qgc3RhdHVzID0gdGhpcy5pbnB1dEZvcm0uZm9ybS5zdGF0dXM7XG4gICAgICAgICAgICBjb25zdCBpc1RhZ1ZhbGlkID0gdGhpcy5pc1RhZ1ZhbGlkKHRhZywgZnJvbUF1dG9jb21wbGV0ZSk7XG5cbiAgICAgICAgICAgIGNvbnN0IG9uVmFsaWRhdGlvbkVycm9yID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMub25WYWxpZGF0aW9uRXJyb3IuZW1pdCh0YWcpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QoKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmIChzdGF0dXMgPT09ICdWQUxJRCcgJiYgaXNUYWdWYWxpZCkge1xuICAgICAgICAgICAgICAgIGFwcGVuZEl0ZW0oKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzZXQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHN0YXR1cyA9PT0gJ0lOVkFMSUQnIHx8ICFpc1RhZ1ZhbGlkKSB7XG4gICAgICAgICAgICAgICAgcmVzZXQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gb25WYWxpZGF0aW9uRXJyb3IoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHN0YXR1cyA9PT0gJ1BFTkRJTkcnKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhdHVzVXBkYXRlJCA9IHRoaXMuaW5wdXRGb3JtLmZvcm0uc3RhdHVzQ2hhbmdlcztcblxuICAgICAgICAgICAgICAgIHJldHVybiBzdGF0dXNVcGRhdGUkXG4gICAgICAgICAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyKHN0YXR1c1VwZGF0ZSA9PiBzdGF0dXNVcGRhdGUgIT09ICdQRU5ESU5HJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdCgpXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoc3RhdHVzVXBkYXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdHVzVXBkYXRlID09PSAnVkFMSUQnICYmIGlzVGFnVmFsaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBlbmRJdGVtKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc2V0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc2V0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9uVmFsaWRhdGlvbkVycm9yKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBzZXR1cFNlcGFyYXRvcktleXNMaXN0ZW5lclxuICAgICAqL1xuICAgIHByaXZhdGUgc2V0dXBTZXBhcmF0b3JLZXlzTGlzdGVuZXIoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHVzZVNlcGFyYXRvcktleXMgPSB0aGlzLnNlcGFyYXRvcktleUNvZGVzLmxlbmd0aCA+IDAgfHwgdGhpcy5zZXBhcmF0b3JLZXlzLmxlbmd0aCA+IDA7XG4gICAgICAgIGNvbnN0IGxpc3RlbmVyID0gKCRldmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaGFzS2V5Q29kZSA9IHRoaXMuc2VwYXJhdG9yS2V5Q29kZXMuaW5kZXhPZigkZXZlbnQua2V5Q29kZSkgPj0gMDtcbiAgICAgICAgICAgIGNvbnN0IGhhc0tleSA9IHRoaXMuc2VwYXJhdG9yS2V5cy5pbmRleE9mKCRldmVudC5rZXkpID49IDA7XG4gICAgICAgICAgICAvLyB0aGUga2V5Q29kZSBvZiBrZXlkb3duIGV2ZW50IGlzIDIyOSB3aGVuIElNRSBpcyBwcm9jZXNzaW5nIHRoZSBrZXkgZXZlbnQuXG4gICAgICAgICAgICBjb25zdCBpc0lNRVByb2Nlc3NpbmcgPSAkZXZlbnQua2V5Q29kZSA9PT0gMjI5O1xuXG4gICAgICAgICAgICBpZiAoaGFzS2V5Q29kZSB8fCAoaGFzS2V5ICYmICFpc0lNRVByb2Nlc3NpbmcpKSB7XG4gICAgICAgICAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkFkZGluZ1JlcXVlc3RlZChmYWxzZSwgdGhpcy5mb3JtVmFsdWUpXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoKSA9PiB7IH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGxpc3Rlbi5jYWxsKHRoaXMsIGNvbnN0YW50cy5LRVlET1dOLCBsaXN0ZW5lciwgdXNlU2VwYXJhdG9yS2V5cyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgc2V0VXBLZXlwcmVzc0xpc3RlbmVyc1xuICAgICAqL1xuICAgIHByaXZhdGUgc2V0VXBLZXlwcmVzc0xpc3RlbmVycygpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgbGlzdGVuZXIgPSAoJGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpc0NvcnJlY3RLZXkgPSAkZXZlbnQua2V5Q29kZSA9PT0gMzcgfHwgJGV2ZW50LmtleUNvZGUgPT09IDg7XG5cbiAgICAgICAgICAgIGlmIChpc0NvcnJlY3RLZXkgJiZcbiAgICAgICAgICAgICAgICAhdGhpcy5mb3JtVmFsdWUgJiZcbiAgICAgICAgICAgICAgICB0aGlzLml0ZW1zLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMudGFncy5sYXN0LnNlbGVjdC5jYWxsKHRoaXMudGFncy5sYXN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBzZXR0aW5nIHVwIHRoZSBrZXlwcmVzcyBsaXN0ZW5lcnNcbiAgICAgICAgbGlzdGVuLmNhbGwodGhpcywgY29uc3RhbnRzLktFWURPV04sIGxpc3RlbmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBzZXRVcEtleWRvd25MaXN0ZW5lcnNcbiAgICAgKi9cbiAgICBwcml2YXRlIHNldFVwSW5wdXRLZXlkb3duTGlzdGVuZXJzKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmlucHV0Rm9ybS5vbktleWRvd24uc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGlmIChldmVudC5rZXkgPT09ICdCYWNrc3BhY2UnICYmIHRoaXMuZm9ybVZhbHVlLnRyaW0oKSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBzZXRVcE9uUGFzdGVMaXN0ZW5lclxuICAgICAqL1xuICAgIHByaXZhdGUgc2V0VXBPblBhc3RlTGlzdGVuZXIoKSB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gdGhpcy5pbnB1dEZvcm0uaW5wdXQubmF0aXZlRWxlbWVudDtcblxuICAgICAgICAvLyBhdHRhY2ggbGlzdGVuZXIgdG8gaW5wdXRcbiAgICAgICAgdGhpcy5yZW5kZXJlci5saXN0ZW4oaW5wdXQsICdwYXN0ZScsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vblBhc3RlQ2FsbGJhY2soZXZlbnQpO1xuXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHNldFVwVGV4dENoYW5nZVN1YnNjcmliZXJcbiAgICAgKi9cbiAgICBwcml2YXRlIHNldFVwVGV4dENoYW5nZVN1YnNjcmliZXIoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaW5wdXRGb3JtLmZvcm1cbiAgICAgICAgICAgIC52YWx1ZUNoYW5nZXNcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIGRlYm91bmNlVGltZSh0aGlzLm9uVGV4dENoYW5nZURlYm91bmNlKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLnN1YnNjcmliZSgodmFsdWU6IHsgaXRlbTogc3RyaW5nIH0pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uVGV4dENoYW5nZS5lbWl0KHZhbHVlLml0ZW0pO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgc2V0VXBPbkJsdXJTdWJzY3JpYmVyXG4gICAgICovXG4gICAgcHJpdmF0ZSBzZXRVcE9uQmx1clN1YnNjcmliZXIoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGZpbHRlckZuID0gKCk6IGJvb2xlYW4gPT4ge1xuICAgICAgICAgICAgY29uc3QgaXNWaXNpYmxlID0gdGhpcy5kcm9wZG93biAmJiB0aGlzLmRyb3Bkb3duLmlzVmlzaWJsZTtcbiAgICAgICAgICAgIHJldHVybiAhaXNWaXNpYmxlICYmICEhdGhpcy5mb3JtVmFsdWU7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5pbnB1dEZvcm1cbiAgICAgICAgICAgIC5vbkJsdXJcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIGRlYm91bmNlVGltZSgxMDApLFxuICAgICAgICAgICAgICAgIGZpbHRlcihmaWx0ZXJGbilcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc2V0ID0gKCkgPT4gdGhpcy5zZXRJbnB1dFZhbHVlKCcnKTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmFkZE9uQmx1cikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgICAgICAgICAgICAgICAgICAgLm9uQWRkaW5nUmVxdWVzdGVkKGZhbHNlLCB0aGlzLmZvcm1WYWx1ZSwgdW5kZWZpbmVkLCB0cnVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzZXQpXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2gocmVzZXQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJlc2V0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBmaW5kRHVwZVxuICAgICAqIEBwYXJhbSB0YWdcbiAgICAgKiBAcGFyYW0gaXNGcm9tQXV0b2NvbXBsZXRlXG4gICAgICovXG4gICAgcHJpdmF0ZSBmaW5kRHVwZSh0YWc6IFRhZ01vZGVsLCBpc0Zyb21BdXRvY29tcGxldGU6IGJvb2xlYW4pOiBUYWdNb2RlbCB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGNvbnN0IGlkZW50aWZ5QnkgPSBpc0Zyb21BdXRvY29tcGxldGUgPyB0aGlzLmRyb3Bkb3duLmlkZW50aWZ5QnkgOiB0aGlzLmlkZW50aWZ5Qnk7XG4gICAgICAgIGNvbnN0IGlkID0gdGFnW2lkZW50aWZ5QnldO1xuXG4gICAgICAgIHJldHVybiB0aGlzLml0ZW1zLmZpbmQoaXRlbSA9PiB0aGlzLmdldEl0ZW1WYWx1ZShpdGVtKSA9PT0gaWQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIG9uUGFzdGVDYWxsYmFja1xuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICovXG4gICAgcHJpdmF0ZSBvblBhc3RlQ2FsbGJhY2sgPSBhc3luYyAoZGF0YTogQ2xpcGJvYXJkRXZlbnQpID0+IHtcbiAgICAgICAgaW50ZXJmYWNlIElFV2luZG93IGV4dGVuZHMgV2luZG93IHtcbiAgICAgICAgICAgIGNsaXBib2FyZERhdGE6IERhdGFUcmFuc2ZlcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGdldFRleHQgPSAoKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGlzSUUgPSBCb29sZWFuKCh3aW5kb3cgYXMgSUVXaW5kb3cgJiB0eXBlb2YgZ2xvYmFsVGhpcykuY2xpcGJvYXJkRGF0YSk7XG4gICAgICAgICAgICBjb25zdCBjbGlwYm9hcmREYXRhID0gaXNJRSA/IChcbiAgICAgICAgICAgICAgICAod2luZG93IGFzIElFV2luZG93ICYgdHlwZW9mIGdsb2JhbFRoaXMpLmNsaXBib2FyZERhdGFcbiAgICAgICAgICAgICkgOiBkYXRhLmNsaXBib2FyZERhdGE7XG4gICAgICAgICAgICBjb25zdCB0eXBlID0gaXNJRSA/ICdUZXh0JyA6ICd0ZXh0L3BsYWluJztcbiAgICAgICAgICAgIHJldHVybiBjbGlwYm9hcmREYXRhID09PSBudWxsID8gJycgOiBjbGlwYm9hcmREYXRhLmdldERhdGEodHlwZSkgfHwgJyc7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgdGV4dCA9IGdldFRleHQoKTtcblxuICAgICAgICBjb25zdCByZXF1ZXN0cyA9IHRleHRcbiAgICAgICAgICAgIC5zcGxpdCh0aGlzLnBhc3RlU3BsaXRQYXR0ZXJuKVxuICAgICAgICAgICAgLm1hcChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0YWcgPSB0aGlzLmNyZWF0ZVRhZyhpdGVtKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldElucHV0VmFsdWUodGFnW3RoaXMuZGlzcGxheUJ5XSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMub25BZGRpbmdSZXF1ZXN0ZWQoZmFsc2UsIHRhZyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCByZXNldElucHV0ID0gKCkgPT4gc2V0VGltZW91dCgoKSA9PiB0aGlzLnNldElucHV0VmFsdWUoJycpLCA1MCk7XG5cbiAgICAgICAgUHJvbWlzZS5hbGwocmVxdWVzdHMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vblBhc3RlLmVtaXQodGV4dCk7XG4gICAgICAgICAgICByZXNldElucHV0KCk7XG4gICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2gocmVzZXRJbnB1dCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgc2V0QW5pbWF0aW9uTWV0YWRhdGFcbiAgICAgKi9cbiAgICBwcml2YXRlIHNldEFuaW1hdGlvbk1ldGFkYXRhKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmFuaW1hdGlvbk1ldGFkYXRhID0ge1xuICAgICAgICAgICAgdmFsdWU6ICdpbicsXG4gICAgICAgICAgICBwYXJhbXM6IHsgLi4udGhpcy5hbmltYXRpb25EdXJhdGlvbiB9XG4gICAgICAgIH07XG4gICAgfVxufVxuIl19