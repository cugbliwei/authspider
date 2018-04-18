<script nonce="" type="text/javascript">
var getQuery = function(name,url){
    var u  = arguments[1] || window.location.search,
        reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"),
        r = u.substr(u.indexOf("\?")+1).match(reg);
    return r!=null?r[2]:"";
};

var getMaxWith=function(){
    var container = document.getElementById('img-content');
    var max_width = container.offsetWidth;
    var container_padding = 0;
    var container_style = getComputedStyle(container);
    container_padding = parseFloat(container_style.paddingLeft) + parseFloat(container_style.paddingRight);
    max_width -= container_padding;
    var ua = navigator.userAgent.toLowerCase();
    var re = new RegExp("msie ([0-9]+[\.0-9]*)");
    var version;
    if (re.exec(ua) != null) {
        version = parseInt(RegExp.$1);
    }
    var isIE = false;
    if (typeof version != 'undefined' && version >= 6 && version <= 9) {
        isIE = true;
    }
    if (!max_width) {
        max_width = window.innerWidth - 30;
    }
    return max_width;
};

window.__getVideoWh = function(dom){
    var max_width = getMaxWith(),
        width = max_width,
        ratio_ = dom.getAttribute('data-ratio')*1||(4/3),
        arr = [4/3, 16/9],
        ret = arr[0],
        abs = Math.abs(ret - ratio_);
    for(var j=1,jl=arr.length;j<jl;j++){
        var _abs = Math.abs(arr[j] - ratio_);
        if(_abs<abs){
            abs = _abs;
            ret = arr[j];
        }
    }
    ratio_ = ret;
    var parent_width = getParentWidth(dom)||max_width,
        width = width > parent_width ? parent_width : width,
        outerW = getOuterW(dom)||0,
        outerH = getOuterH(dom)||0,
        videoW = width - outerW,
        videoH = videoW/ratio_,
        height = videoH + outerH;
    return {w:width,h:height,vh:videoH,vw:videoW,ratio:ratio_};
};

var getParentWidth = function(dom){
    var parent_width = 0;
    var parent = dom.parentNode;
    var outerWidth = 0;
    while (true) {
        if(!parent||parent.nodeType!=1) break;
        var parent_style = getComputedStyle(parent);
        if (!parent_style) break;
        parent_width = parent.clientWidth - parseFloat(parent_style.paddingLeft) - parseFloat(parent_style.paddingRight) - outerWidth;
        if (parent_width > 0) break;
        outerWidth += parseFloat(parent_style.paddingLeft) + parseFloat(parent_style.paddingRight) + parseFloat(parent_style.marginLeft) + parseFloat(parent_style.marginRight) + parseFloat(parent_style.borderLeftWidth) + parseFloat(parent_style.borderRightWidth);
        parent = parent.parentNode;
    }
    return parent_width;
};

var getOuterW=function(dom){
    var style=getComputedStyle(dom),
        w=0;
    if(!!style){
        w = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
    }
    return w;
};
var getOuterH =function(dom){
    var style=getComputedStyle(dom),
        h=0;
    if(!!style){
        h = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
    }
    return h;
};

(function(){
    var iframe = document.getElementsByTagName('iframe');
    for (var i=0,il=iframe.length;i<il;i++) {
        var a = iframe[i];

        var src_ = a.getAttribute('src')||a.getAttribute('data-src')||"";
        var vid = getQuery("vid",src_);
        if(!vid){
            continue;
        }
        vid=vid.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"");
        a.removeAttribute('src');
        var obj = window.__getVideoWh(a);
        a.style.cssText += ";width: " + obj.w + "px !important;";
        a.setAttribute("width",obj.w);
        a.style.cssText += "height: " + obj.h + "px !important;";
        a.setAttribute("height",obj.h);
        a.setAttribute("src","http://v.qq.com/iframe/player.html?vid="+ vid + "&width="+obj.vw+"&height="+obj.vh+"&auto=0");
    }
})();
</script>
