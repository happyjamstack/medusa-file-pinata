import FormData from 'form-data'

var form = new FormData({ maxDataSize: 20971520 });
form.append('my_field','');
//form.append('my_buffer', 'aeouaeoua');

console.log(form)
