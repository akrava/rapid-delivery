export function onSubmitFormValidation(event) {
    let valid = true;
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        valid = false;
    }
    form.classList.add('was-validated');
    return valid;
}

export function onMountedForm() {
    const forms = document.getElementsByClassName('needs-validation');
    Array.from(forms).forEach(form => {
        const arrayGrops = form.getElementsByClassName('form-group');
        Array.from(arrayGrops).forEach(function(x) {
            const inputs = x.getElementsByTagName('input');
            Array.from(inputs).forEach(function(y) {
                y.addEventListener('change', function _listener() {
                    x.classList.add("was-validated");
                    y.removeEventListener('change', _listener, false);
                }, false);
            });
        });
    });
}
