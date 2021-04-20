import { Pipe } from '@angular/core';
const escape = s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
const ɵ0 = escape;
export class HighlightPipe {
    /**
     * @name transform
     * @param value {string}
     * @param arg {string}
     */
    transform(value, arg) {
        if (!arg.trim()) {
            return value;
        }
        try {
            const regex = new RegExp(`(${escape(arg)})`, 'i');
            return value.replace(regex, '<b>$1</b>');
        }
        catch (e) {
            return value;
        }
    }
}
HighlightPipe.decorators = [
    { type: Pipe, args: [{
                name: 'highlight'
            },] }
];
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlnaGxpZ2h0LnBpcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9tb2R1bGVzL2NvcmUvcGlwZXMvaGlnaGxpZ2h0LnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLElBQUksRUFBZ0IsTUFBTSxlQUFlLENBQUM7QUFFbEQsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLHdCQUF3QixFQUFFLE1BQU0sQ0FBQyxDQUFDOztBQUtoRSxNQUFNLE9BQU8sYUFBYTtJQUN0Qjs7OztPQUlHO0lBQ0ksU0FBUyxDQUFDLEtBQWEsRUFBRSxHQUFXO1FBQ3ZDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDYixPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUVELElBQUk7WUFDQSxNQUFNLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ2xELE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUM7U0FDNUM7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNSLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO0lBQ0wsQ0FBQzs7O1lBcEJKLElBQUksU0FBQztnQkFDRixJQUFJLEVBQUUsV0FBVzthQUNwQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7UGlwZSwgUGlwZVRyYW5zZm9ybX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmNvbnN0IGVzY2FwZSA9IHMgPT4gcy5yZXBsYWNlKC9bLVxcL1xcXFxeJCorPy4oKXxbXFxde31dL2csICdcXFxcJCYnKTtcblxuQFBpcGUoe1xuICAgIG5hbWU6ICdoaWdobGlnaHQnXG59KVxuZXhwb3J0IGNsYXNzIEhpZ2hsaWdodFBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgICAvKipcbiAgICAgKiBAbmFtZSB0cmFuc2Zvcm1cbiAgICAgKiBAcGFyYW0gdmFsdWUge3N0cmluZ31cbiAgICAgKiBAcGFyYW0gYXJnIHtzdHJpbmd9XG4gICAgICovXG4gICAgcHVibGljIHRyYW5zZm9ybSh2YWx1ZTogc3RyaW5nLCBhcmc6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGlmICghYXJnLnRyaW0oKSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChgKCR7ZXNjYXBlKGFyZyl9KWAsICdpJyk7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUucmVwbGFjZShyZWdleCwgJzxiPiQxPC9iPicpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=