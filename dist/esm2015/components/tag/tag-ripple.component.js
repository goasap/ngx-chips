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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLXJpcHBsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9tb2R1bGVzL2NvbXBvbmVudHMvdGFnL3RhZy1yaXBwbGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDSCxTQUFTLEVBQ1QsS0FBSyxFQUNSLE1BQU0sZUFBZSxDQUFDO0FBR3ZCLE9BQU8sRUFDSCxPQUFPLEVBQ1AsT0FBTyxFQUNQLEtBQUssRUFDTCxVQUFVLEVBQ1YsU0FBUyxFQUNULEtBQUssRUFDUixNQUFNLHFCQUFxQixDQUFDO0FBc0M3QixNQUFNLE9BQU8sU0FBUztJQXBDdEI7UUFxQ29CLFVBQUssR0FBRyxNQUFNLENBQUM7SUFDbkMsQ0FBQzs7O1lBdENBLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsWUFBWTtnQkFtQnRCLFFBQVEsRUFBRTs7S0FFVDtnQkFDRCxVQUFVLEVBQUU7b0JBQ1IsT0FBTyxDQUFDLEtBQUssRUFBRTt3QkFDWCxLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUM7d0JBQzVDLFVBQVUsQ0FBQyxpQkFBaUIsRUFBRTs0QkFDMUIsT0FBTyxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUM7Z0NBQ25CLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUMsQ0FBQztnQ0FDbEUsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUMsQ0FBQztnQ0FDOUMsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBQyxDQUFDOzZCQUN4RSxDQUFDLENBQUM7eUJBQ04sQ0FBQztxQkFDTCxDQUFDO2lCQUNMO3lCQWhDUTs7Ozs7Ozs7Ozs7Ozs7Ozs7S0FpQlI7YUFnQko7OztvQkFFSSxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgICBDb21wb25lbnQsXG4gICAgSW5wdXRcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cblxuaW1wb3J0IHtcbiAgICBhbmltYXRlLFxuICAgIHRyaWdnZXIsXG4gICAgc3R5bGUsXG4gICAgdHJhbnNpdGlvbixcbiAgICBrZXlmcmFtZXMsXG4gICAgc3RhdGVcbn0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAndGFnLXJpcHBsZScsXG4gICAgc3R5bGVzOiBbYFxuICAgICAgICA6aG9zdCB7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgICAgICAgIGxlZnQ6IDA7XG4gICAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgLnRhZy1yaXBwbGUge1xuICAgICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjEpO1xuICAgICAgICAgICAgdG9wOiA1MCU7XG4gICAgICAgICAgICBsZWZ0OiA1MCU7XG4gICAgICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgfVxuICAgIGBdLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0YWctcmlwcGxlXCIgW0BpbmtdPVwic3RhdGVcIj48L2Rpdj5cbiAgICBgLFxuICAgIGFuaW1hdGlvbnM6IFtcbiAgICAgICAgdHJpZ2dlcignaW5rJywgW1xuICAgICAgICAgICAgc3RhdGUoJ25vbmUnLCBzdHlsZSh7d2lkdGg6IDAsIG9wYWNpdHk6IDB9KSksXG4gICAgICAgICAgICB0cmFuc2l0aW9uKCdub25lID0+IGNsaWNrZWQnLCBbXG4gICAgICAgICAgICAgICAgYW5pbWF0ZSgzMDAsIGtleWZyYW1lcyhbXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlKHtvcGFjaXR5OiAxLCBvZmZzZXQ6IDAsIHdpZHRoOiAnMzAlJywgYm9yZGVyUmFkaXVzOiAnMTAwJSd9KSxcbiAgICAgICAgICAgICAgICAgICAgc3R5bGUoe29wYWNpdHk6IDEsIG9mZnNldDogMC41LCB3aWR0aDogJzUwJSd9KSxcbiAgICAgICAgICAgICAgICAgICAgc3R5bGUoe29wYWNpdHk6IDAuNSwgb2Zmc2V0OiAxLCB3aWR0aDogJzEwMCUnLCBib3JkZXJSYWRpdXM6ICcxNnB4J30pXG4gICAgICAgICAgICAgICAgXSkpXG4gICAgICAgICAgICBdKVxuICAgICAgICBdKVxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgVGFnUmlwcGxlIHtcbiAgICBASW5wdXQoKSBwdWJsaWMgc3RhdGUgPSAnbm9uZSc7XG59XG4iXX0=