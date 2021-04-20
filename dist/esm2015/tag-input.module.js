import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule, COMPOSITION_BUFFER_MODE } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Ng2DropdownModule } from 'ng2-material-dropdown';
import { HighlightPipe } from './core/pipes/highlight.pipe';
import { DragProvider } from './core/providers/drag-provider';
import { OptionsProvider } from './core/providers/options-provider';
import { TagInputComponent } from './components/tag-input/tag-input';
import { DeleteIconComponent } from './components/icon/icon';
import { TagInputForm } from './components/tag-input-form/tag-input-form.component';
import { TagComponent } from './components/tag/tag.component';
import { TagInputDropdown } from './components/dropdown/tag-input-dropdown.component';
import { TagRipple } from './components/tag/tag-ripple.component';
const optionsProvider = new OptionsProvider();
export class TagInputModule {
    /**
     * @name withDefaults
     * @param options {Options}
     */
    static withDefaults(options) {
        optionsProvider.setOptions(options);
    }
}
TagInputModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    ReactiveFormsModule,
                    FormsModule,
                    Ng2DropdownModule
                ],
                declarations: [
                    TagInputComponent,
                    DeleteIconComponent,
                    TagInputForm,
                    TagComponent,
                    HighlightPipe,
                    TagInputDropdown,
                    TagRipple
                ],
                exports: [
                    TagInputComponent,
                    DeleteIconComponent,
                    TagInputForm,
                    TagComponent,
                    HighlightPipe,
                    TagInputDropdown,
                    TagRipple
                ],
                providers: [
                    DragProvider,
                    { provide: COMPOSITION_BUFFER_MODE, useValue: false },
                ]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLWlucHV0Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZHVsZXMvdGFnLWlucHV0Lm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxXQUFXLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzRixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDMUQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzVELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUM5RCxPQUFPLEVBQUUsZUFBZSxFQUFXLE1BQU0sbUNBQW1DLENBQUM7QUFDN0UsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDckUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDN0QsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHNEQUFzRCxDQUFDO0FBQ3BGLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUM5RCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxvREFBb0QsQ0FBQztBQUN0RixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFFbEUsTUFBTSxlQUFlLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztBQWdDOUMsTUFBTSxPQUFPLGNBQWM7SUFDdkI7OztPQUdHO0lBQ0ksTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFnQjtRQUN2QyxlQUFlLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3hDLENBQUM7OztZQXJDSixRQUFRLFNBQUM7Z0JBQ04sT0FBTyxFQUFFO29CQUNMLFlBQVk7b0JBQ1osbUJBQW1CO29CQUNuQixXQUFXO29CQUNYLGlCQUFpQjtpQkFDcEI7Z0JBQ0QsWUFBWSxFQUFFO29CQUNWLGlCQUFpQjtvQkFDakIsbUJBQW1CO29CQUNuQixZQUFZO29CQUNaLFlBQVk7b0JBQ1osYUFBYTtvQkFDYixnQkFBZ0I7b0JBQ2hCLFNBQVM7aUJBQ1o7Z0JBQ0QsT0FBTyxFQUFFO29CQUNMLGlCQUFpQjtvQkFDakIsbUJBQW1CO29CQUNuQixZQUFZO29CQUNaLFlBQVk7b0JBQ1osYUFBYTtvQkFDYixnQkFBZ0I7b0JBQ2hCLFNBQVM7aUJBQ1o7Z0JBQ0QsU0FBUyxFQUFFO29CQUNQLFlBQVk7b0JBQ1osRUFBRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtpQkFDeEQ7YUFDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFJlYWN0aXZlRm9ybXNNb2R1bGUsIEZvcm1zTW9kdWxlLCBDT01QT1NJVElPTl9CVUZGRVJfTU9ERSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHsgTmcyRHJvcGRvd25Nb2R1bGUgfSBmcm9tICduZzItbWF0ZXJpYWwtZHJvcGRvd24nO1xyXG5pbXBvcnQgeyBIaWdobGlnaHRQaXBlIH0gZnJvbSAnLi9jb3JlL3BpcGVzL2hpZ2hsaWdodC5waXBlJztcclxuaW1wb3J0IHsgRHJhZ1Byb3ZpZGVyIH0gZnJvbSAnLi9jb3JlL3Byb3ZpZGVycy9kcmFnLXByb3ZpZGVyJztcclxuaW1wb3J0IHsgT3B0aW9uc1Byb3ZpZGVyLCBPcHRpb25zIH0gZnJvbSAnLi9jb3JlL3Byb3ZpZGVycy9vcHRpb25zLXByb3ZpZGVyJztcclxuaW1wb3J0IHsgVGFnSW5wdXRDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdGFnLWlucHV0L3RhZy1pbnB1dCc7XHJcbmltcG9ydCB7IERlbGV0ZUljb25Db21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvaWNvbi9pY29uJztcclxuaW1wb3J0IHsgVGFnSW5wdXRGb3JtIH0gZnJvbSAnLi9jb21wb25lbnRzL3RhZy1pbnB1dC1mb3JtL3RhZy1pbnB1dC1mb3JtLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFRhZ0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy90YWcvdGFnLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFRhZ0lucHV0RHJvcGRvd24gfSBmcm9tICcuL2NvbXBvbmVudHMvZHJvcGRvd24vdGFnLWlucHV0LWRyb3Bkb3duLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFRhZ1JpcHBsZSB9IGZyb20gJy4vY29tcG9uZW50cy90YWcvdGFnLXJpcHBsZS5jb21wb25lbnQnO1xyXG5cclxuY29uc3Qgb3B0aW9uc1Byb3ZpZGVyID0gbmV3IE9wdGlvbnNQcm92aWRlcigpO1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICAgIGltcG9ydHM6IFtcclxuICAgICAgICBDb21tb25Nb2R1bGUsXHJcbiAgICAgICAgUmVhY3RpdmVGb3Jtc01vZHVsZSxcclxuICAgICAgICBGb3Jtc01vZHVsZSxcclxuICAgICAgICBOZzJEcm9wZG93bk1vZHVsZVxyXG4gICAgXSxcclxuICAgIGRlY2xhcmF0aW9uczogW1xyXG4gICAgICAgIFRhZ0lucHV0Q29tcG9uZW50LFxyXG4gICAgICAgIERlbGV0ZUljb25Db21wb25lbnQsXHJcbiAgICAgICAgVGFnSW5wdXRGb3JtLFxyXG4gICAgICAgIFRhZ0NvbXBvbmVudCxcclxuICAgICAgICBIaWdobGlnaHRQaXBlLFxyXG4gICAgICAgIFRhZ0lucHV0RHJvcGRvd24sXHJcbiAgICAgICAgVGFnUmlwcGxlXHJcbiAgICBdLFxyXG4gICAgZXhwb3J0czogW1xyXG4gICAgICAgIFRhZ0lucHV0Q29tcG9uZW50LFxyXG4gICAgICAgIERlbGV0ZUljb25Db21wb25lbnQsXHJcbiAgICAgICAgVGFnSW5wdXRGb3JtLFxyXG4gICAgICAgIFRhZ0NvbXBvbmVudCxcclxuICAgICAgICBIaWdobGlnaHRQaXBlLFxyXG4gICAgICAgIFRhZ0lucHV0RHJvcGRvd24sXHJcbiAgICAgICAgVGFnUmlwcGxlXHJcbiAgICBdLFxyXG4gICAgcHJvdmlkZXJzOiBbXHJcbiAgICAgICAgRHJhZ1Byb3ZpZGVyLFxyXG4gICAgICAgIHsgcHJvdmlkZTogQ09NUE9TSVRJT05fQlVGRkVSX01PREUsIHVzZVZhbHVlOiBmYWxzZSB9LFxyXG4gICAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgVGFnSW5wdXRNb2R1bGUge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAbmFtZSB3aXRoRGVmYXVsdHNcclxuICAgICAqIEBwYXJhbSBvcHRpb25zIHtPcHRpb25zfVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHdpdGhEZWZhdWx0cyhvcHRpb25zOiBPcHRpb25zKTogdm9pZCB7XHJcbiAgICAgICAgb3B0aW9uc1Byb3ZpZGVyLnNldE9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICB9XHJcbn1cclxuIl19