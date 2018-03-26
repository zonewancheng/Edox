
(function () {
    var artile = {
        title: '',
        description: '',
        link: '',
        image: '',
        copyright: '',
        mark:[],
        author:""
    };
    var RSS = new Vue({
        el: "#mainPage",
        data: function () {
            return {
                articleList: [],
                rssSourceList:[
                    'https://www.w3cways.com/feed',
                    'https://www.zhihu.com/rss'
                ]
            }
        },
        methods: {
            initPage: function () {
                this.getRssFeed();
            },
            getRssFeed: function () {

            for(var i=0,lg=this.rssSourceList.length;i<lg;i++){
                var link = this.rssSourceList[i];
                this.parseRss(link,null)
            }

            },
            parseRss: function (link,callback) {
                var _this = this;


                var CORS_PROXY = "https://cors-anywhere.herokuapp.com/"

                var parser = new RSSParser();
                parser.parseURL(CORS_PROXY + link, function (err, feed) {
                    console.log(feed.title);
                    feed.items.forEach(function (entry) {
                        console.log(entry)
                        var item  = JSON.parse(JSON.stringify(artile));
                            item.title = entry.title;
                            item.link = entry.link;
                            item.mark = entry.categories;
                            item.author = entry.creator;
                            _this.articleList.push(item);
                    })
                })
            }
        },

    })
    RSS.initPage();

})()