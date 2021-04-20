import { Component, Input } from '@angular/core';
import { animate, trigger, style, transition, keyframes, state } from '@angular/animations';
export class TagRipple {
    constructor() {
        this.state = 'none';
    }
}
TagRipple.decorators = [
    { type: Component, args: [{
                selector: 'tag-ripple',
                template: `
        <div class="tag-ripple" [@ink]="state"></div>
    `,
                animations: [
                    trigger('ink', [
                        state('none', style({ width: 0, opacity: 0 })),
                        transition('none => clicked', [
                            animate(300, keyframes([
                                style({ opacity: 1, offset: 0, width: '30%', borderRadius: '100%' }),
                                style({ opacity: 1, offset: 0.5, width: '50%' }),
                                style({ opacity: 0.5, offset: 1, width: '100%', borderRadius: '16px' })
                            ]))
                        ])
                    ])
                ],
                styles: [`
        :host {
            width: 100%;
            height: 100%;
            left: 0;
            overflow: hidden;
            position: absolute;
        }

        .tag-ripple {
            background: rgba(0, 0, 0, 0.1);
            top: 50%;
            left: 50%;
            height: 100%;
            transform: translate(-50%, -50%);
            position: absolute;
        }
    `]
            },] }
];
TagRipple.propDecorators = {
    state: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLXJpcHBsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9tb2R1bGVzL2NvbXBvbmVudHMvdGFnL3RhZy1yaXBwbGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDSCxTQUFTLEVBQ1QsS0FBSyxFQUNSLE1BQU0sZUFBZSxDQUFDO0FBR3ZCLE9BQU8sRUFDSCxPQUFPLEVBQ1AsT0FBTyxFQUNQLEtBQUssRUFDTCxVQUFVLEVBQ1YsU0FBUyxFQUNULEtBQUssRUFDUixNQUFNLHFCQUFxQixDQUFDO0FBc0M3QixNQUFNLE9BQU8sU0FBUztJQXBDdEI7UUFxQ29CLFVBQUssR0FBRyxNQUFNLENBQUM7SUFDbkMsQ0FBQzs7O1lBdENBLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsWUFBWTtnQkFtQnRCLFFBQVEsRUFBRTs7S0FFVDtnQkFDRCxVQUFVLEVBQUU7b0JBQ1IsT0FBTyxDQUFDLEtBQUssRUFBRTt3QkFDWCxLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUM7d0JBQzVDLFVBQVUsQ0FBQyxpQkFBaUIsRUFBRTs0QkFDMUIsT0FBTyxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUM7Z0NBQ25CLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUMsQ0FBQztnQ0FDbEUsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUMsQ0FBQztnQ0FDOUMsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBQyxDQUFDOzZCQUN4RSxDQUFDLENBQUM7eUJBQ04sQ0FBQztxQkFDTCxDQUFDO2lCQUNMO3lCQWhDUTs7Ozs7Ozs7Ozs7Ozs7Ozs7S0FpQlI7YUFnQko7OztvQkFFSSxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICAgIENvbXBvbmVudCxcclxuICAgIElucHV0XHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5cclxuaW1wb3J0IHtcclxuICAgIGFuaW1hdGUsXHJcbiAgICB0cmlnZ2VyLFxyXG4gICAgc3R5bGUsXHJcbiAgICB0cmFuc2l0aW9uLFxyXG4gICAga2V5ZnJhbWVzLFxyXG4gICAgc3RhdGVcclxufSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICd0YWctcmlwcGxlJyxcclxuICAgIHN0eWxlczogW2BcclxuICAgICAgICA6aG9zdCB7XHJcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICAgICAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICAgICAgICAgIGxlZnQ6IDA7XHJcbiAgICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC50YWctcmlwcGxlIHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjEpO1xyXG4gICAgICAgICAgICB0b3A6IDUwJTtcclxuICAgICAgICAgICAgbGVmdDogNTAlO1xyXG4gICAgICAgICAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xyXG4gICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgICAgfVxyXG4gICAgYF0sXHJcbiAgICB0ZW1wbGF0ZTogYFxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0YWctcmlwcGxlXCIgW0BpbmtdPVwic3RhdGVcIj48L2Rpdj5cclxuICAgIGAsXHJcbiAgICBhbmltYXRpb25zOiBbXHJcbiAgICAgICAgdHJpZ2dlcignaW5rJywgW1xyXG4gICAgICAgICAgICBzdGF0ZSgnbm9uZScsIHN0eWxlKHt3aWR0aDogMCwgb3BhY2l0eTogMH0pKSxcclxuICAgICAgICAgICAgdHJhbnNpdGlvbignbm9uZSA9PiBjbGlja2VkJywgW1xyXG4gICAgICAgICAgICAgICAgYW5pbWF0ZSgzMDAsIGtleWZyYW1lcyhbXHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGUoe29wYWNpdHk6IDEsIG9mZnNldDogMCwgd2lkdGg6ICczMCUnLCBib3JkZXJSYWRpdXM6ICcxMDAlJ30pLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlKHtvcGFjaXR5OiAxLCBvZmZzZXQ6IDAuNSwgd2lkdGg6ICc1MCUnfSksXHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGUoe29wYWNpdHk6IDAuNSwgb2Zmc2V0OiAxLCB3aWR0aDogJzEwMCUnLCBib3JkZXJSYWRpdXM6ICcxNnB4J30pXHJcbiAgICAgICAgICAgICAgICBdKSlcclxuICAgICAgICAgICAgXSlcclxuICAgICAgICBdKVxyXG4gICAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgVGFnUmlwcGxlIHtcclxuICAgIEBJbnB1dCgpIHB1YmxpYyBzdGF0ZSA9ICdub25lJztcclxufVxyXG4iXX0=