import React, { useState } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TablePagination,
  TableSortLabel,
  TableContainer,
} from '@material-ui/core';

export default function useTable(records, headCells, rowsPerPageCustomed) {
  const pages = [5,10,25]
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageCustomed || pages[page]);
  const [order, setOrder] = useState(); // asc or desc
  const [orderBy, setOrderBy] = useState(); // cell head

  const TblContainer = (props) => (
    <TableContainer className={props.className}>
      <Table size={props.size}>{props.children}</Table>
    </TableContainer>
  );

  const TblHead = () => {
    const handleSortRequest = (cellId) => {
      const isAsc = orderBy === cellId && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(cellId);
    };
    let style;

    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => {
            if (headCell.id === 'description') {
              style = {
                width: '50%',
              };
            } else {
              style = {
                width: '20%',
              };
            }
            return (
              <TableCell
                style={{ ...style, padding: 0}}
                align="center"
                key={headCell.id}
                sortDirection={orderBy === headCell.id ? order : false}
              >
                {headCell.disableSorting ? (
                  headCell.label
                ) : (
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={() => {
                      handleSortRequest(headCell.id);
                    }}
                  >
                    {headCell.label}
                  </TableSortLabel>
                )}
              </TableCell>
            );
          })}
        </TableRow>
      </TableHead>
    );
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const TblPagination = ({pageOptions = pages}) => {
    return (
      <TablePagination
        // style={{ margin: 0, padding: 0 }}
        component="div"
        page={page}
        rowsPerPageOptions={pageOptions}
        rowsPerPage={rowsPerPage}
        count={records.length}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    );
  };

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  const recordsAfterPagingAndSorting = () => {
    return stableSort(records, getComparator(order, orderBy)).slice(
      page * rowsPerPage,
      (page + 1) * rowsPerPage
    );
  };

  return {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting,
  };
}
