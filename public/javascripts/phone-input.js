window.addEventListener('load', function() {    
    // **** only on phone
    const phone_input = document.getElementById('phone_field');
    phone_input.addEventListener('click', function(event) {
        if (!this.value) {
            this.value = '+380';
        }
    }, false);
}, false);