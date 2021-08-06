# Material Crud Component

Material Crud Component is a simple package that allows you to scaffold CRUD pages data in minutes.

## Installation

```shell
yarn install material-crud-component
#OR
npm install --save material-crud-component
```

## Usage
```typescript
import Crud from 'material-crud-component';
```

## Example
```typescript
...    
        const data = [{ cost: 1000, gluten: 'NO'} ...];
...
        return ( 
           <Crud
                title="Nutrition"
                columns={[
                    {
                        key: 'cost',
                        label: 'Cost',
                        name: 'cost',
                        align: 'right',
                        format: (val: any) => numeral(val).format('$0,0[.]0')
                    }
                ]}
                data={data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                idExtractor={(val: any) => val.id}
                pagination={{
                    totalElements: data.length,
                    page,
                    rowsPerPage,
                    rowsPerPageOptions: [10, 25, 50],
                    onPageChange: (p: number) => {
                        setPage(p)
                    },
                    onRowsPerPageChange: (s: number) => {
                        setRowsPerPage(s);
                    }
                }}
                onDelete={(item: any) => {
                    const d = data.filter(i => item.id !== i.id);
                    setData(d);
                }}
                addItem={{
                    form: {
                        required: ['cost', 'gluten'],
                        properties: {
                            cost: {type: 'number', title: 'Cost'},
                            gluten: {type: 'string', title: 'Gluten Free', enum: ['Yes', 'No']},
                        }
                    },
                    onSubmit: (item: any) => {
                        setData([...data, {...item, id: Date.now().toString()}])
                    }
                }}
                editItem={{
                    form: {
                        required: ['cost', 'gluten'], 
                        properties: {
                            cost: {type: 'number', title: 'Cost'},
                            gluten: {type: 'string', title: 'Gluten Free', enum: ['Yes', 'No']},
                        }
                    },
                    onSubmit: (item: any) => {
                        const i = data.findIndex(i => item.id === i.id);
                        data[i] = item;
                        setData([...data]);
                    }
                }}
            />);
```
>A detailed example can be found in the [examples](https://github.com/dondragon2/material-crud-component/tree/main/example) directory

## Properties
| Name   | Required | Description |
| ------ | -------- | ----------- |
| title | | string or React component to display at the head of the table
| columns| Yes| list of fields to display from the item. See column definition for further details|
|data|Yes| list tor records|

>## TODO
> complete documentation
