(function(window, undefined) {
    var bSuggestShow = true;
    var TIPHEIGHT = 450; // 弹窗高度
    var oLastTagDiv; // 上一个弹窗
    var oTimer; // 全局计时对象

    $(function() {
        fWindowLoad();
    });


    function fWindowLoad() {
        $('a.tag').mouseenter(fTagMouseEnter)
            .mouseleave(fTagMouseLeave);

        // 意见反馈弹窗
        fSuggest();

        //百度统计自定义事件数据
        window._hmt = window._hmt || [];
    }

    function fTagMouseEnter() {
        // 隐藏意见反馈
        fHideTipDiv($('a[data-toggle=feedback]'), '007');
        bSuggestShow = true;

        var oTagDiv = $(this);
        var sDescrition = oTagDiv.data('des');
        var sId = oTagDiv.data('index');
        var nHeight = oTagDiv.height();
        var nTop = oTagDiv.position().top;

        // 隐藏上一个弹窗
        clearTimeout(oTimer);
        if(oLastTagDiv && oLastTagDiv.get(0) != oTagDiv.get(0)) {
            fHideTipDiv(oLastTagDiv, sId);
        }
        oLastTagDiv = oTagDiv;

        // 上方有完整展示空间才向上展示
        var sPos = (nTop - $(document.body).scrollTop()) - TIPHEIGHT > 0 ? 'top' : 'bottom'
        console.log(sPos);
        oTagDiv.popover({
            placement: sPos,
            title: '详情',
            html: true,
            container: document.body,
            content: '<p style="width:400px">' + sDescrition + '</p><div id="temp' + sId + '" style="width:400px;height:400px;">loading...</div>',
            trigger: 'manual'
        });

        var oTipDiv = oTagDiv.data('popover').tip();
        oTipDiv.one('mouseenter', function() {
            clearTimeout(oTimer);
        }).one('mouseleave', function() {
            fHideTipDiv(oTagDiv, sId);
        });

        oTagDiv.popover('show');
        $('#temp' + sId).replaceWith(fBuildCommentBox(sId));
    }

    function fTagMouseLeave() {
        var oTagDiv = $(this);
        clearTimeout(oTimer);
        oTimer = setTimeout(function() {
            var sId = oTagDiv.data('index');
            fHideTipDiv(oTagDiv, sId);
        }, 250);
    }

    function fHideTipDiv(oTagDiv, sId) {
        clearTimeout(oTimer);
        // DOM位置变换后，iframe还是会重新加载，缓存不了
        // TODO:fixed it
        try {
            var oTipDiv = oTagDiv.data('popover').tip();
            var oIframe = $('iframe', oTipDiv);
            //$(document.body).append(oIframe);
            oIframe.hide();
            oTagDiv.popover('hide');
        } catch(e) {};
    }

    function fSuggest() {
        var oTagDiv = $('a[data-toggle=feedback]');
        oTagDiv.popover({
            placement: 'bottom',
            title: '反馈',
            html: true,
            content: '<div id="temp007">loading...</div>',
            trigger: 'click'
        });

        oTagDiv.on('click', function() {
            if(bSuggestShow) {
                $('#temp007').replaceWith(fBuildCommentBox('007'));
            } else {
                fHideTipDiv(oTagDiv, '007');
            }
            bSuggestShow = !bSuggestShow;
        });
    }

    function fBuildCommentBox(sId) {
        var oIframe = $('#iframe' + sId);
        if(oIframe.length != 0) {
            oIframe.show();
            return oIframe.get(0);
        }

        oIframe = document.createElement('IFRAME');
        var sTmpl = [
                '<link rel="stylesheet" href="https://blogstatic.ccsyue.com/vendor/default.css">',
                '<script src="https://blogstatic.ccsyue.com/vendor/gitment.browser.js"></script>',
                '<div id="comments"></div>',
                '<script>',
                    'var gitment = new Gitment({',
                      'id: "e.ccsue.com",',
                      'owner: "deffyc",',
                      'repo: "e",',
                      'oauth: {',
                        'client_id: "713b6ec79704a60e528a",',
                        'client_secret: "5859e34ccc9e596ab7aa74d7c9b10097ccdbfff7",',
                      '},',
                    '});',
                    'gitment.render("comments");',
                  '</script>'
        ].join('');
        oIframe.id = 'iframe' + sId;
        oIframe.style.display = 'none';
        oIframe.frameborder = 0;
        oIframe.marginwidth = 0;
        oIframe.allowTransparency = true;
        oIframe.marginheight = 0;
        oIframe.style.border = 0;
        oIframe.style.width = '400px';
        oIframe.style.height = '400px';
        document.body.appendChild(oIframe);

        $(oIframe).on('load', function() {
            var oIframeDoc = oIframe.contentDocument || oIframe.contentWindow.document;
            oIframeDoc.write(sTmpl.replace(/\{id\}/g, sId));
            $(this).show();
        });

        return oIframe;
    }

})(window);
