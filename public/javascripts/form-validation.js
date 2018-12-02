window.addEventListener('load', function() {    
    const forms = document.getElementsByClassName('needs-validation');
    const validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
        const arrayGrops = form.getElementsByClassName('form-group');
        Array.prototype.filter.call(arrayGrops, function(x) {
            const inputs = x.getElementsByTagName('input');
            Array.prototype.filter.call(inputs, function(y) {
                y.addEventListener('change', function _listener(event) {
                    x.classList.add("was-validated");
                    y.removeEventListener('change', _listener, false);
                }, false);
            });
        });
    });
}, false);