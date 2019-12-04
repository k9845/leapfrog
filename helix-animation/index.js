window.onload = function() {
    var apks = document.getElementsByClassName('app');

    for (var i = 0; i < apks.length; i++) {
        apks.item(i).appendChild(new Container(apks.item(i)).init());
    }
}