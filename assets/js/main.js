const [jwt, botname, g_sitekey] = location.hash.replace("#", "").split(";");
const requestInfo = JSON.parse(window.atob(jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).data;
$(".gname").text(decodeURIComponent(requestInfo.gname));
$(".uid").text(requestInfo.uid);
$(".gid").text(requestInfo.gid);
$(".botname").text(botname);
$(".botname").attr("href", "https://t.me/" + botname);

var verifyCallback = function (response) {

    const payload = JSON.stringify({
        "jwt": jwt,
        "gresponse": response
    });

    const callback = function (data) {
        const id = data["key"];
        if (id){
            window.location.href = "https://t.me/" + botname + "?start=" + id;
        }
        document.getElementById("recaptcha-response").innerText = "/verify " + window.btoa(payload);
        document.getElementById("guideForManual").style.display = '';
    };

    $.ajax("https://bytebin.lucko.me/post", {
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: payload,
        method: "POST",
        success: callback
    });
}

var onloadCallback = function() {
    grecaptcha.render('g-recaptcha', {
      'sitekey' : g_sitekey,
      'callback' : verifyCallback
    });
  };