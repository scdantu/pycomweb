import React, { useEffect, useState } from 'react';
import { Col, Table } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { useTable, usePagination, useGlobalFilter } from 'react-table';

const DataTable = ({ columns, data, title, placeholder }) => {
    console.log("called datatable component ....................................")
    // Retrieve stored filter from sessionStorage or set to an empty string
    const storedFilter = sessionStorage.getItem(`searchQuery_${title}`) || '';
    // Create a state to manage the global filter
    //   const [globalFilter, setGlobalFilter] = useState();
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page, // Instead of using rows, we'll use page
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize, globalFilter },
        setGlobalFilter,
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0 }, // Pass our hoisted table state
            //   manualGlobalFilter: true,
        },
        useGlobalFilter, // Use global filter hook
        usePagination // Use pagination hook

    );
    //   const { globalFilter } = state;

    // Update the global filter and save it to sessionStorage
    //  const handleGlobalFilterChange = (value) => {
    //     setGlobalFilter(value);
    //     // setFilter(value);
    //     // sessionStorage.setItem(`searchQuery_${title}`, value); // Store the filter with a unique key
    //   };

    //   useEffect(() => {
    //     // When the component mounts, set the global filter from sessionStorage
    //     setFilter(storedFilter);
    //   }, [storedFilter, setFilter]);


    return (
        <>
            {/* <!--Header Section--> */}
            <Col md={12} className="content-header-wrapper">
                <div className='header-title col-md-6'>
                    <span className='helpdata-title'>{title}</span>
                </div>
                <div className="header-search-box col-md-6">
                    <input
                        type="text"
                        value={globalFilter || ''}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder={placeholder || "Search..."}
                    />
                    <button type="button"><FaSearch /></button>
                </div>
            </Col>
            <Col md={12} className="results-table-wrapper">
                <div className="results-table-header col-md-12">
                    <Col md-6="true"><span className="h6">Total Records </span><b>{pageOptions.length}</b></Col>
                    <Col md-3="true">
                        <span className="h6">Records per page:</span>
                        <select
                            value={pageSize}
                            onChange={e => {
                                setPageSize(Number(e.target.value));
                            }}
                        >
                            {[10, 20, 30, 40, 50].map(pageSize => (
                                <option key={pageSize} value={pageSize}>
                                    Show {pageSize}
                                </option>
                            ))}
                        </select>
                    </Col>
                    <Col md-3="true">
                        <span className="h6">Go to Page:</span>
                        <input type="number" min="1" max={pageOptions.length} value={pageIndex + 1} onChange={(e) => gotoPage(Number(e.target.value) - 1)} />
                    </Col>
                </div>
                <Col className="pagination col-md-12">
                    <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>First</button>
                    <button onClick={() => previousPage()} disabled={!canPreviousPage}>Previous</button>
                    <span className="h6">Page <b>{pageIndex + 1}</b> of <b>{pageOptions.length}</b></span>
                    <button onClick={() => nextPage()} disabled={!canNextPage}>Next</button>
                    <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>Last</button>
                </Col>
                <div className="table-container">
                    <Table hover className="hover" {...getTableProps()} style={{ width: '100%' }}>
                        <thead>
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column, index) => (
                                        <th key={index} {...column.getHeaderProps()}>{column.render('Header')}</th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {page.map((row, i) => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map(cell => {
                                            return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                    <Col className="pagination col-md-12">
                        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>First</button>
                        <button onClick={() => previousPage()} disabled={!canPreviousPage}>Previous</button>
                        <span className="h6">Page <b>{pageIndex + 1}</b> of <b>{pageOptions.length}</b></span>
                        <button onClick={() => nextPage()} disabled={!canNextPage}>Next</button>
                        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>Last</button>
                    </Col>
                </div>
            </Col>

        </>
    );

};

export default DataTable;
