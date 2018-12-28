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
        if (id) {
            const protoUrl = "tg://resolve?domain=" + botname + "&start=" + id;
            $(".botname").attr("href", protoUrl);
            $(".metaURL").attr("content", protoUrl)
            if ((typeof UAParser === "function") && UAParser().os.name === "iOS") {
                var iframeContEl = document.getElementById('tgme_frame_cont') || document.body;
                var iframeEl = document.createElement('iframe');
                iframeContEl.appendChild(iframeEl);
                var pageHidden = false;
                window.addEventListener('pagehide', function () {
                    pageHidden = true;
                }, false);
                window.addEventListener('blur', function () {
                    pageHidden = true;
                }, false);
                if (iframeEl !== null) {
                    iframeEl.src = protoUrl;
                }!false && setTimeout(function () {
                    if (!pageHidden) {
                        window.location = protoUrl;
                    }
                }, 2000);
            } else if (protoUrl) {
                setTimeout(function () {
                    window.location = protoUrl;
                }, 100);
            }
        }

        document.getElementById("recaptcha-response").innerText = "/verify " + window.btoa(payload);

        setTimeout(() => {
            document.getElementById("guideForManual").style.display = '';
        }, 2000)
    };

    $.ajax("https://bytebin.lucko.me/post", {
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: payload,
        method: "POST",
        success: callback
    });
}

let captchaLoaded = false;
// If we're unable to load our map within 2 seconds,
// assume request is blocked and to load via the Chinese endpoint
// This China special support code was written by Planefinder Team, thanks.
setTimeout(() => {
    if (captchaLoaded === false) {
        loadCaptcha_CN();
    }
}, 2000);

function loadCaptcha_CN() {
    const url = "https://recaptcha.google.cn/recaptcha/api.js?onload=onloadCallback&render=explicit";
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    document.body.appendChild(script);
}

var onloadCallback = function () {
    captchaLoaded = true;
    grecaptcha.render('g-recaptcha', {
        'sitekey': g_sitekey,
        'callback': verifyCallback
    });
};