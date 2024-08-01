var padEl = document.getElementById('signature-pad');
var wr = document.getElementById('wr');

// var signaturePad = new SignaturePad(padEl);
var signaturePad = new SignaturePad(padEl, {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    penColor: 'rgb(0, 0, 0)'
});

function clearSignaturePad() {
    signaturePad.clear();
}

if (window.innerWidth<500){

    padEl.width = padEl.offsetWidth !== 0? padEl.offsetWidth: 322;
} else if (500<=window.innerWidth && window.innerWidth<=1000){

    padEl.width = padEl.offsetWidth !== 0? padEl.offsetWidth: 520;
} else {
    padEl.width = padEl.offsetWidth !== 0? padEl.offsetWidth: 750;

}
window.addEventListener('resize', e => {
    padEl.width = padEl.offsetWidth;
});
