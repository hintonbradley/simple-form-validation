// Dropdown
function toggleDropdown(id) {
    document.getElementById(id).classList.toggle("show");
    return false;
};

window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var active = document.getElementsByClassName('dropdown-content');
        for(var i=0;i<active.length;i++){
            if(active[i].classList.contains('show')) {
                active[i].classList.remove('show');
            }
        }
    }
    return false;
};

function selectOpt (val, event) {
    var id = event.target.parentNode.id;
    var el = document.getElementById(id +'-btn');
    el.innerHTML = val;
    el.value = val;
    return false;
}
// End dropdown