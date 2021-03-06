import React from 'react';

import './App.css';
import numeral from 'numeral';
import Crud from 'material-crud-component';

function createData(
    id: number,
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
): any {
    return {id, name, calories, fat, carbs, protein, cost: 1000};
}

const rows = [
    createData(1, 'Cupcake', 305, 3.7, 67, 4.3),
    createData(2, 'Donut', 452, 25.0, 51, 4.9),
    createData(3, 'Eclair', 262, 16.0, 24, 6.0),
    createData(4, 'Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData(5, 'Gingerbread', 356, 16.0, 49, 3.9),
    createData(6, 'Honeycomb', 408, 3.2, 87, 6.5),
    createData(7, 'Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData(8, 'Jelly Bean', 375, 0.0, 94, 0.0),
    createData(9, 'KitKat', 518, 26.0, 65, 7.0),
    createData(10, 'Lollipop', 392, 0.2, 98, 0.0),
    createData(11, 'Marshmallow', 318, 0, 81, 2.0),
    createData(12, 'Nougat', 360, 19.0, 9, 37.0),
    createData(13, 'Oreo', 437, 18.0, 63, 4.0),
];


function App() {
    const [data, setData] = React.useState(rows);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    return (
        <div className="App">
            <Crud
                title="Nutrition"
                columns={[
                    {
                        key: 'name',
                        label: 'Desert',
                        name: 'name'
                    },
                    {
                        key: 'calories',
                        label: 'Calories',
                        name: 'calories',
                        align: 'right'
                    },
                    {
                        key: 'fat',
                        label: 'fat',
                        name: 'fat',
                        align: 'right'
                    },
                    {
                        key: 'carbs',
                        label: 'carbs',
                        name: 'carbs',
                        align: 'right'
                    },
                    {
                        key: 'protein',
                        label: 'protein',
                        name: 'protein',
                        align: 'right'
                    },
                    {
                        key: 'cost',
                        label: 'Cost',
                        name: 'cost',
                        align: 'right',
                        format: (val: any) => numeral(val).format('$0,0[.]0')
                    },
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
                        required: ['name', 'calories', 'fat', 'carbs', 'protein'],
                        properties: {
                            name: {type: 'string', title: 'name'},
                            calories: {type: 'number', title: 'calories'},
                            fat: {type: 'number', title: 'fat'},
                            carbs: {type: 'number', title: 'carbs'},
                            protein: {type: 'number', title: 'protein'},
                            gluten: {type: 'string', title: 'Gluten Free', enum: ['Yes', 'No']},
                        }
                    },
                    onSubmit: (item: any) => {
                        console.log(item)
                        setData([...data, {...item, id: Date.now().toString()}])
                    }
                }}
                editItem={{
                    form: {
                        required: ['name', 'calories', 'fat', 'carbs', 'protein'],
                        properties: {
                            name: {type: 'string', title: 'name'},
                            calories: {type: 'number', title: 'calories'},
                            fat: {type: 'number', title: 'fat'},
                            carbs: {type: 'number', title: 'carbs'},
                            protein: {type: 'number', title: 'protein'},
                            gluten: {type: 'string', title: 'Gluten Free', enum: ['Yes', 'No']},
                        }
                    },
                    onSubmit: (item: any) => {
                        console.log(item)
                        const i = data.findIndex(i => item.id === i.id);
                        data[i] = item;
                        setData([...data]);
                    }
                }}
            />
        </div>
    );
}

export default App;
