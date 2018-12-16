import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Input from './../../components/partials/form_elements/Input';
import { onSubmitFormValidation, onMountedForm } from './../../utils/validtion';
import { goBack } from './../../actions/redirect';
import { changeMyPersonalInfo } from './../../actions/user';

class EditUserPage extends Component {
    constructor(props) {
        super(props);
        const user = props.user;
        this.state = {
            fullname: user.userObject ? user.userObject.fullname : '',
            email:  user.userObject ? user.userObject.email : '',
            phone:  user.userObject ? user.userObject.phone : '',
            pasw: '',
            tg_name:  user.userObject ? user.userObject.telegramUsername : '',
            bio:  user.userObject ? user.userObject.bio : '',
            telegramNotifySilent: user.userObject ? user.userObject.telegramNotifySilent : false
        };
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.photoInputOnChange = this.photoInputOnChange.bind(this);
        this.formOnSubmit = this.formOnSubmit.bind(this);
        this.refForm = React.createRef();
        this.labelPhotoInput = React.createRef();
    }

    componentDidMount() {
        onMountedForm();
    }

    formOnSubmit(e) { 
        if (onSubmitFormValidation(e) && !this.props.user.isFetching) {
            e.preventDefault();
            const form = this.refForm.current;
            const formData = new FormData(form);
            this.props.changeMyPersonalInfo(this.props.user.userObject.login, formData);
        }       
    }

    photoInputOnChange(e) {
        const fileName = e.currentTarget.value;
        this.labelPhotoInput.current.innerHTML = fileName;
    }
    
    
    static mapStateToProps(store) {
        return { user: store.user };
    }

    static mapDispatchToProps(dispatch) {
        return { 
            goBack: () => dispatch(goBack()),
            changeMyPersonalInfo: (username, formData) => dispatch(changeMyPersonalInfo(username, formData))
        };
    }

    phoneInputOnFocus(e) {
        if (!e.currentTarget.value) {
            e.currentTarget.value = '+380';
        }
    }

    handleFieldChange(field) {
        const this_obj = this;
        return function(e) {
            const obj = {};
            if (typeof e.currentTarget.value === "undefined") {
                return;
            }
            obj[field] = e.currentTarget.value;
            this_obj.setState(obj);
        };
    }

    render() {
        if (!this.props.user.userObject) return <h1>Loading...</h1>;
        return (
            <React.Fragment>
                <h1>Редагування акаунту</h1>
                <p>
                    Усі поля (окрім біографії) форми, наведеної нижче, є необхідними для заповнення:
                </p>
                <p>
                    Якщо ви не бажаєте оновлювати фото, залиште відповідне поле пустим.
                </p>
                <form id="edit-profile" ref={this.refForm} className="needs-validation mx-auto form-default mb-4 p-4" encType="multipart/form-data" method="POST" onSubmit={this.formOnSubmit} noValidate>
                    <div className="form-group form-inline ">
                        <Input 
                            type="text"
                            name="fullname"
                            label="Повне ім'я"
                            minLength={3}
                            maxLength={30}
                            invalidFeedback="Введіть правильне ім'я"
                            helpInfo="Ім'я повинно мати довжину від 3 до 30 символів включно"
                            valueOnChage={this.handleFieldChange("fullname")}
                            formInline
                            value={this.state.fullname}
                            required
                        />
                    </div>
                    <div className="form-group form-inline">
                        <Input 
                            type="email"
                            name="email"
                            label="E-Mail"
                            placeholder="Введіть email"
                            invalidFeedback="Введіть правильний email"
                            valueOnChage={this.handleFieldChange("email")}
                            formInline
                            value={this.state.email}
                            required
                        />
                    </div>
                    <div className="form-group form-inline">
                        <Input 
                            type="tel"
                            name="phone"
                            label="Номер телефону"
                            helpInfo="Формат +380ххххххххх"
                            invalidFeedback="Введіть правильний номер телефону"
                            pattern="\+380[0-9]{9}"
                            valueOnChage={this.handleFieldChange("phone")}
                            formInline
                            value={this.state.phone}
                            valueOnFocus={this.phoneInputOnFocus}
                            required
                        />
                    </div>
                    <div className="form-group form-inline">
                        <Input 
                            type="file"
                            name="photo"
                            label="Фото профілю"
                            helpInfo="формат .jpg, .png та розміром до 3 МБ"
                            formInline
                            valueOnChage={this.photoInputOnChange}
                            labelRef={this.labelPhotoInput}
                            accept="image/*"
                        />
                    </div>
                    <div className="form-group form-inline">
                        <Input 
                            type="textarea"
                            name="bio"
                            label="Біографія"
                            maxLength={1000}
                            placeholder="інформація про себе"
                            invalidFeedback="Введіть правильний пароль"
                            valueOnChage={this.handleFieldChange("bio")}
                            rows={3}
                            formInline
                            value={this.state.bio}
                        />
                    </div>
                    <div className="form-group form-inline">
                        <Input 
                            type="text"
                            name="tg_name"
                            label="Tg @username"
                            pattern="^[^\s]+(\s+[^\s]+)*$"
                            minLength={3}
                            maxLength={50}
                            placeholder="Нікнейм в телеграмі"
                            valueOnChage={this.handleFieldChange("tg_name")}
                            formInline
                            value={this.state.tg_name}
                        />
                    </div>
                    <div className="form-group form-inline">
                        {this.props.user.userObject && this.props.user.userObject.telegramUserId && 
                            <Input 
                                type="select"
                                name="telegramNotifySilent"
                                label="Типи сповіщень"
                                formInline
                                valueOnChage={this.handleFieldChange("telegramNotifySilent")}
                                options={[{ name: `Усі`, selectValue: false}, { name: `Тільки важливі`, selectValue: true}]}
                                value={this.state.telegramNotifySilent}
                            />
                        }
                    </div>
                    <div className="form-group form-inline">
                        <Input 
                            type="password"
                            name="pasw"
                            label="Пароль"
                            minLength={8}
                            maxLength={30}
                            invalidFeedback="Введіть правильний пароль"
                            valueOnChage={this.handleFieldChange("pasw")}
                            formInline
                            required
                        />
                    </div>
                    <div className="col d-inline-flex">
                        <button className="btn btn-primary ml-auto mr-4" type="submit" disabled={this.props.user.isFetching}>Оновити</button>
                        <button className="btn btn-secondary mr-auto" onClick={this.props.goBack}>Відмінити</button>
                    </div>
                </form>
            </React.Fragment>
        );
    }
}

EditUserPage.propTypes = {
    user: PropTypes.object.isRequired,
    goBack: PropTypes.func.isRequired,
    changeMyPersonalInfo: PropTypes.func.isRequired
};

export default withRouter(connect(EditUserPage.mapStateToProps, EditUserPage.mapDispatchToProps)(EditUserPage));