import React, { Component } from 'react';
import PropTypes from 'prop-types';


class NavPagination extends Component {
    controlPage(isPrev, isFetching, pageObject, cb) {
        return (
            <li className={`page-item ${(pageObject.view === false || isFetching === true) && "disabled"}`}>
                <a className="page-link" data-page={pageObject.number} onClick={cb}><span aria-hidden="true" data-page={pageObject.number}>{isPrev ? "«" : "»" }</span><span className="sr-only" data-page={pageObject.number}>{isPrev ? "Previous" : "Next" }</span></a>
            </li>
        );
    }

    renderPagesBlock(isFetching, pages, cb) {
        return pages.map(page => {
            if (!page.current) {
                return <li key={page.number} className={`page-item ${isFetching === true && "disabled"}`}><a className="page-link" data-page={page.number} onClick={cb}>{page.number}</a></li>;
            } else {
                return (
                    <li key={page.number} className={`page-item ${isFetching === true ? "disabled" : "active" }`}>
                        <span className="page-link-current">
                            {page.number}
                            <span className="sr-only">(current)</span>
                        </span>
                    </li>
                );
            }
        });
    }

    getPagesObject(page, totalPages) {
        const array = [];
        for (let i = 0; i < totalPages; i++) {
            array.push({ current: i + 1 === page, number: i + 1 });
        }
        return array;
    }

    getControlPageObject(isPrev, page, totalPages) {
        return {
            view: isPrev ? page !== 1 : page !== totalPages, 
            number: isPrev ? page - 1 : page + 1
        };
    }

    render() {
        return (
            <nav aria-label="Page navigation" id="invoicesPagination">
            {this.props.totalPages > 1 &&
                <ul className="pagination justify-content-center">
                    {this.controlPage(true, this.props.isFetching, this.getControlPageObject(true, this.props.page, this.props.totalPages), this.props.callbackPageClicked)}
                    {this.renderPagesBlock(this.props.isFetching, this.getPagesObject(this.props.page, this.props.totalPages), this.props.callbackPageClicked)}
                    {this.controlPage(false, this.props.isFetching, this.getControlPageObject(false, this.props.page, this.props.totalPages), this.props.callbackPageClicked)}
                </ul>
            }
            </nav>
        );
    }
}

NavPagination.propTypes = {
    page: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    isFetching: PropTypes.bool.isRequired,
    callbackPageClicked: PropTypes.func.isRequired
};

export default NavPagination;