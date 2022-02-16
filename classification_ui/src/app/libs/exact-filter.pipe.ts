import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'exactFilter'
})

export class ExactFilterPipe implements PipeTransform {
    transform(value: any, args?: any): any {

        if (!value) {
            return null;
        }
        if (!args) {
            return value;
        }
        const objs = Object.getOwnPropertyNames(args);
        return value.filter((item) => {
            let flag = true;
            objs.forEach((ob) => {
                if (args[ob] !== '' && args[ob] !== '' && args[ob] !== null) {
                    flag = flag && item[ob].toLowerCase() === (args[ob]).toLowerCase();
                }
            });
            return flag;
        });
    }
}