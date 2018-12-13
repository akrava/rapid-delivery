import React, { Component } from 'react';
import PropTypes from 'prop-types';


class ModalDialog extends Component {
    constructor(props) {
        super(props);
        this.modalRef = React.createRef();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.isFetching && this.props.isFetching !== nextProps.isFetching) {
            this.modalRef.current.click();
        }
    }

    render() {
        return (
            <div className="modal fade" id="modalDialog" tabIndex="-1" role="dialog" aria-labelledby="modalDialogLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalDialogLabel">{this.props.titleModal}</h5>
                            <button type="button" className="close" data-dismiss="modal" ref={this.modalRef} aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {this.props.textModal}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрити</button>
                            <button className={`btn ${this.props.dangerColor ? "btn btn-danger" : "btn-primary"}`} disabled={this.props.isFetching} type="submit">{this.props.actionModal}</button>
                        </div>
                    </div>
                </div>
            </div> 
        );
    }
}

ModalDialog.propTypes = {
    titleModal: PropTypes.string.isRequired,
    textModal: PropTypes.string.isRequired,
    actionModal: PropTypes.string.isRequired,
    isFetching: PropTypes.bool,
    dangerColor: PropTypes.bool
};

export default ModalDialog;











