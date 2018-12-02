window.addEventListener('load', function() {
    //
    const photo_input = document.getElementById('photo_field');
    photo_input.addEventListener('change', function(event) {
        //get the file name
        const fileName = this.value;
        //replace the "Choose a file" label
        const photo_input = document.getElementById('file-label');
        photo_input.innerHTML = fileName;
    }, false);
    const form = document.getElementById('insert');
    form.addEventListener('reset', function(event) {
        //get the file name
        const fileName = this.value;
        //replace the "Choose a file" label
        const photo_input = document.getElementById('file-label');
        photo_input.innerHTML = "Виберіть фото";
    }, false);
    //
}, false);