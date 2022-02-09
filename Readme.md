[![部署导航](https://github.com/deffyc/e/actions/workflows/deploy.js.yml/badge.svg)](https://github.com/deffyc/e/actions/workflows/deploy.js.yml)

#已使用持续集成工具[=travis=]github actions，静态页面在html文件夹，脚本自动运行add-all.js，根据根目录all.txt的内容动态生成。源码在src分支，master对应src分支里的html目录。若要使用以下文档请将html下的内容移动到根目录即可。
##准备
 1. 本地nodejs环境
 2. 远程github仓库e
 3. 域名一枚

##克隆项目代码到本地
>git clone git@github.com:deffyc/e.git

##本地初始化
 1. 数据文件 data/info.json 初始化为：
```
{"totalCount":0,"lastUpdateDate":"2016-12-12 10:32:06","lastUpdateCount":0}
```
data/sites/目录下清空，并在此目录下新建空文件"1.json"

>echo '' >1.json

 2. 主页模板文件 src/index.jade，修改一定要注意格式，建议做备份

 3. 多说评论参数 src/app.js
```
var sTmpl = [
                '<head></head>',
                '<body>',
                '<style>body{overflow:auto}</style>',
                '<div class="ds-thread" data-url="http://e.ccsyue.com" data-thread-key="{id}"></div>',
                '<script type="text/javascript">',
                '    var duoshuoQuery = {short_name:"ccsyue"};',
                '    (function() {',
                '        var ds = document.createElement("script");',
                '        ds.type = "text/javascript";ds.async = true;',
                '        ds.src = "http://static.duoshuo.com/embed.js";',
                '        ds.charset = "UTF-8";',
                '        (document.getElementsByTagName("head")[0] ',
                '        || document.getElementsByTagName("body")[0]).appendChild(ds);',
                '    })();',
                '</script>',
                '</body>'
        ].join('');
```

##远程修改
 1. 远程部署到github

>git add *
git commit -m "upload"

 2. 在域名管理后台添加cname解析
 3. 如果像把根域名也解析过去，记得ping deffyc.github.io可获得ip地址用于A记录解析。

##工具使用说明：
 1. 使用自带的交互脚本来添加
>node add.js
 2. 编译生成静态网站
>node build.js
 3. 重新push到github，若使用了CDN记得清缓存。
