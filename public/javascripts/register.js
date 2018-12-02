window.addEventListener('load', function() {
    // **** only on register
    const phone_input = document.getElementById('phone_field');
    phone_input.addEventListener('click', function(event) {
        if (!this.value) {
            this.value = '+380';
        }
    }, false);
    //
    const pasw_confirm_input = document.getElementById('confirm_pasw_field');
    const pasw_field = document.getElementById('pasw_field');
    pasw_confirm_input.addEventListener('input', function(event) {
        if (pasw_field.value !== this.value) {
            this.setCustomValidity("Passwords don't match");
        } else {
            this.setCustomValidity('');
        }
    }, false);
    pasw_field.addEventListener('input', function(event) {
        if (pasw_confirm_input.value !== '') {
            pasw_confirm_input.dispatchEvent(new CustomEvent('input', { 'detail': false }));
        }
    }, false);
    // ****
}, false);