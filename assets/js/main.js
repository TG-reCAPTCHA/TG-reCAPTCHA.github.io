const [jwt, botname, g_sitekey] = location.hash.replace("#", "").split(";");
const requestInfo = JSON.parse(window.atob(jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
$(".gname").text(decodeURIComponent(requestInfo.data.gname));
$(".uid").text(requestInfo.data.uid);
$(".gid").text(requestInfo.data.gid);
$(".botname").text(botname);
$(".botname").attr("href", `https://t.me/${botname}`);


var verifyCallback = function (response) {

    toastr.info('Uploading your challenge data...', 'Verification Passed!');

    const payload = JSON.stringify({
        "jwt": jwt,
        "gresponse": response
    });

    const callback = function (data) {
        const id = data["key"];
        if (id) {

            let protoUrl= `tg://resolve?domain=${botname}&start=${id}`;
            if ((typeof UAParser === "function") && UAParser().os.name === "Android") {
                protoUrl = `tg:resolve?domain=${botname}&start=${id}`;
            }

            $(".botname").attr("href", `https://t.me/${botname}?start=${id}`);
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
                        toastr.warning('You may close this page now if you are iOS user.');
                    }
                }, 2000);
            } else if (protoUrl) {
                setTimeout(function () {
                    window.location = protoUrl;
                }, 100);
            }
            toastr.success("If you aren't be redirected to bot, please click the bot name shown following.", 'Redirecting...')
        }

        document.getElementById("recaptcha-response").innerText = "/verify " + window.btoa(payload);

        setTimeout(() => {
            document.getElementById("guideForManual").style.display = '';
        }, 2000)
    };

    $.ajax("https://bytebin.lucko.me/post", {
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: CryptoJS.AES.encrypt(payload, requestInfo.data.uid).toString(),
        method: "POST",
        success: callback,
        error: () => {
            toastr.error('Please send the following /verify command to bot manually.', 'Failed to Upload Payload', {timeOut: 10000});
            document.getElementById("recaptcha-response").innerText = "/verify " + window.btoa(payload);
            document.getElementById("guideForManual").style.display = '';
        }
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
    const url = "https://recaptcha.net/recaptcha/api.js?onload=onloadCallback&render=explicit";
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    document.body.appendChild(script);
}

var onloadCallback = function () {
    captchaLoaded = true;
    if (Math.floor(new Date() / 1000) > requestInfo.exp) {
        toastr.error(`You should leave and re-join the group <b>${decodeURIComponent(requestInfo.data.gname)}</b> for a new token.`, 'Token Expired', {timeOut: 0})
        throw new Error("Token Expired");
    }
    grecaptcha.render('g-recaptcha', {
        'sitekey': g_sitekey,
        'callback': verifyCallback
    });
};