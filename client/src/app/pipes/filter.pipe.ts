import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter'
})

export class FilterPipe implements PipeTransform {
    /* Example usage:
    const objects = [
    { name: 'Alice', age: 30, location: 'Paris' },
    { name: 'Bob', age: 25, location: 'London' },
    { name: 'Alice', age: 25, location: 'Berlin' },
    { name: 'Alice', age: 25, location: 'Paris' }
    ];
    const filters = [{ key: 'name', value: 'Alice' }, { key: 'age', value: 25 }];

    const filteredObjects = filterObjects(objects, filters);
    console.log(filteredObjects);
    Output: [{ name: 'Alice', age: 25, location: 'Berlin' }, { name: 'Alice', age: 25, location: 'Paris' }] */
    
    public transform<T>(array: T[], filters: { key: keyof T; value: any }[], operator : `AND` | `OR` = `AND`): any[] {
        const method = operator === `AND` ? `every` : `some`;
        const filteredList = array.filter(object =>
            filters[method](filter => object[filter.key] === filter.value)
        );
        return filteredList;
    }     
}