import {
    createStyles,
    Dialog,
    DialogContent,
    IconButton,
    makeStyles,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    Theme,
    Toolbar,
    Tooltip,
    Typography,
    withStyles
} from '@material-ui/core';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Form from '@rjsf/material-ui';
import { JSONSchema7 } from 'json-schema';
import _ from 'lodash';
import * as React from 'react';
import TablePaginationActions from './TablePaginationActions';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export interface ICrudProps {
    title?: string;
    data: any[];
    columns: Column[];
    idExtractor: (val: any, index?: number) => string;
    tableStyle?: any;
    tableClassname?: string;
    pagination?: Pagination;
    onDelete?: (val: any) => void;
    addItem?: CrudAction;
    editItem?: CrudAction;
}

interface CrudAction {
    form?: JSONSchema7;
    onSubmit: (val?: any) => void;
    onFormError?: (val?: any) => void;
}

export interface Column {
    disablePadding?: boolean;
    key: any;
    name: string;
    label: string;
    align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
    format?: (val: any) => string;
}

interface Pagination {
    page: number;
    rowsPerPage: number;
    totalElements: number;
    rowsPerPageOptions?: Array<number>;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (size: number) => void;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(1),
        },
        paper: {
            margin: theme.spacing(2),
        },
        title: {
            flex: '1 1 100%',
        },
        table: {
            minWidth: 650,
        },
        modal: {
            width: 400,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
    }));

const StyledTableCell = withStyles((theme: Theme) =>
    createStyles({
        head: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        body: {
            fontSize: 14,
        },
    }),
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
    createStyles({
        root: {
            '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.action.hover,
            },
        },
    }),
)(TableRow);

const Crud: React.FC<ICrudProps> = ({
                                               title,
                                               data,
                                               tableClassname,
                                               columns,
                                               idExtractor,
                                               pagination,
                                               onDelete,
                                               addItem,
                                               editItem
                                           }) => {
    const classes = useStyles();
    const [selected, setSelected] = React.useState<any | undefined>(undefined);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [formSchema, setFormSchema] = React.useState<JSONSchema7>({
        type: 'object'
    });
    const [mode, setMode] = React.useState('add');

    const isSelected = (item: any) => _.isEqual(selected, item);

    const handleClick = (_event: React.MouseEvent<unknown>, item: any) => {
        setSelected(item);
        const formProperties = editItem?.form?.properties || {};

        const properties = Object.keys(formProperties)
            .reduce((res, k) => {
                const prop: any = formProperties[k];
                prop.default = item[k];

                return {
                    ...res,
                    [k]: prop
                }
            }, {} as any);

        setFormSchema({
            ...(editItem?.form || {}),
            properties
        });
    };

    const handleEdit = () => {
        if (editItem?.form) {
            setModalVisible(true);
            setMode('edit')
        } else {
            editItem?.onSubmit(selected);
        }
    };

    const handleAdd = () => {
        if (addItem?.form) {
            setMode('add')
            setFormSchema((addItem?.form || {}));
            setModalVisible(true);
        } else {
            addItem?.onSubmit(selected);
        }
    }

    const handleModalClose = () => {
        setModalVisible(false);
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete(selected);
        }
    };

    return (
        <>
            <Paper className={classes.paper}>
                <Toolbar className={classes.root}>
                    <Typography className={classes.title} variant="h6" id={`title_${title}`} component="div">
                        {title}
                    </Typography>
                    {addItem && addItem.onSubmit && (
                        <Tooltip title="Add Item">
                            <IconButton aria-label="add" onClick={handleAdd}>
                                <AddIcon/>
                            </IconButton>
                        </Tooltip>
                    )}
                </Toolbar>
                <TableContainer>
                    <Table className={tableClassname ?? classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {columns.map((header) => (
                                    <StyledTableCell
                                        key={header.key}
                                        align={header.align ?? 'left'}
                                        padding={header.disablePadding ? 'none' : 'normal'}
                                    >
                                        {header.label}
                                    </StyledTableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row, index) => {
                                const id = idExtractor(row, index);
                                const isItemSelected = isSelected(row);

                                return (
                                    <StyledTableRow
                                        key={id}
                                        selected={isItemSelected}
                                        onClick={(event) => handleClick(event, row)}
                                    >
                                        {columns.map((col, colIndex) => {
                                            const text = col.format ? col.format(row[col.name]) : row[col.name];
                                            return (
                                                <StyledTableCell
                                                    align={col.align}
                                                    key={`${row[col.name]}_${col.name}`}
                                                >
                                                    {text}
                                                    {isItemSelected && colIndex === 0 && (
                                                        <>
                                                            {editItem && editItem.onSubmit && (
                                                                <Tooltip title="Edit" onClick={handleEdit}>
                                                                    <IconButton aria-label="edit">
                                                                        <EditIcon/>
                                                                    </IconButton>
                                                                </Tooltip>
                                                            )}
                                                            {onDelete && (
                                                                <Tooltip title="Delete">
                                                                    <IconButton aria-label="delete"
                                                                                onClick={handleDelete}>
                                                                        <DeleteIcon/>
                                                                    </IconButton>
                                                                </Tooltip>
                                                            )}
                                                        </>
                                                    )}
                                                </StyledTableCell>
                                            );
                                        })}
                                    </StyledTableRow>
                                );
                            })}
                        </TableBody>
                        {pagination && (
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={pagination.rowsPerPageOptions}
                                        count={pagination.totalElements}
                                        rowsPerPage={pagination.rowsPerPage}
                                        page={pagination.page}
                                        SelectProps={{
                                            inputProps: {'aria-label': 'rows per page'},
                                            native: true,
                                        }}
                                        onPageChange={(_e, page) => pagination.onPageChange(page)}
                                        onRowsPerPageChange={(e) => pagination.onRowsPerPageChange(parseInt(e.target.value, 10))}
                                        ActionsComponent={TablePaginationActions}
                                    />
                                </TableRow>
                            </TableFooter>
                        )}
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog
                open={modalVisible}
                onClose={handleModalClose}
                scroll="body"
                TransitionComponent={Transition}
                keepMounted
            >
                <DialogContent>
                    <Form
                        schema={formSchema}
                        onSubmit={(data: any) => {
                            if (addItem && mode === 'add') {
                                addItem.onSubmit(data.formData);
                            } else if (editItem && mode === 'edit') {
                                editItem.onSubmit({
                                    ...selected,
                                    ...data.formData
                                });
                            }
                            handleModalClose();
                        }}
                        onError={(item: any) => {
                            if (addItem && addItem.onFormError && mode === 'add') {
                                addItem.onFormError(item);
                            } else if (editItem && editItem.onFormError && mode === 'edit') {
                                editItem.onFormError(item);
                            }
                            handleModalClose();
                        }}
                    />
                </DialogContent>
            </Dialog>
        </>
    );

};

export default Crud;
