(function () {
    var artile = {
        title: '',
        description: '',
        link: '',
        image: '',
        copyright: '',
        mark: [],
        author: "",
        date: ""
    };
    var RSS = new Vue({
        el: "#mainPage",
        data: function () {
            return {
                siteList: [
                    {
                        name: "互联网",
                        feedUrl: "http://www.yixieshi.com/feed",
                        articleList: []
                    },
                    {
                        name: "36氪",
                        feedUrl: "http://36kr.com/feed",
                        articleList: []
                    },
                    {
                        name: "前端早读课",
                        feedUrl: "http://caibaojian.com/feed",
                        articleList: []
                    },
                    {
                        name: "大搜车",
                        feedUrl: "http://f2e.souche.com/blog/rss/",
                        articleList: []
                    },
                    {
                        name: "梦想天空-博客园",
                        feedUrl: "http://feed.cnblogs.com/blog/u/40553/rss",
                        articleList: []
                    },
                    {
                        name: "知乎",
                        feedUrl: "https://www.zhihu.com/rss",
                        articleList: []
                    },{
                        name: "科技",
                        feedUrl: "http://www.alibuybuy.com/feed",
                        articleList: []
                    },
                    {
                        name: "掘金",
                        feedUrl: "https://juejin.im/rss",
                        articleList: []
                    },
                    {
                        name: "知道创宇",
                        feedUrl: "http://blog.knownsec.com/feed/",
                        articleList: []
                    },
                    {
                        name: "w3cways",
                        feedUrl: "https://www.w3cways.com/feed",
                        articleList: []
                    },
                    {
                        name: "w3cplus",
                        feedUrl: "https://www.w3cplus.com/rss.xml",
                        articleList: []
                    },
                    {
                        name: "SegmentFault",
                        feedUrl: "https://segmentfault.com/articles/feeds",
                        articleList: []
                    },
                    // {
                    //     name: "Feed",
                    //     feedUrl: "http://paulirish.github.io/frontend-feeds/frontend-feeds.opml",
                    //     articleList: []
                    // },

                ]
            }
        },
        methods: {
            initPage: function () {
                this.getRssFeed();
            },
            getRssFeed: function () {

                for (var i = 0, lg = this.siteList.length; i < lg; i++) {
                    var link = this.siteList[i].feedUrl;
                    this.parseRss(link, i)
                }

            },
            parseRss: function (link, index) {

                var CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
                var _this = this;
                var arry = [];
                var parser = new RSSParser();

                parser.parseURL(CORS_PROXY + link, function (err, feed) {

                    try {
                        feed&&feed.items&&feed.items.forEach(function (entry) {
                            var item = JSON.parse(JSON.stringify(artile));
                            item.title = entry.title;
                            item.link = entry.link;
                            item.mark = entry.categories;


                            if (link.indexOf("zhihu") != -1) {
                                item.author = entry.creator && entry.creator._;
                            }else if(link.indexOf("segmentfault")!=-1){
                                item.author = entry.author;
                            } else {
                                item.author = entry.creator;
                            }
                            try {
                                if(link.indexOf("segmentfault")!=-1){
                                    item.date = entry.pubDate.split("T").join(" ").split(".000Z").join("")
                                }else{
                                    item.date = entry.isoDate.split("T").join(" ").split(".000Z").join("")
                                }
                            } catch (e) {
                                item.date = entry.isoDate;
                            }
                            arry.push(item);
                        });

                        _this.siteList[index].articleList = arry;
                        _this.siteList[index].show = true;
                    } catch (r) {
                        feed&&feed.items&&feed.items.forEach(function (entry) {
                            var item = JSON.parse(JSON.stringify(artile));
                            item.title = entry.title;
                            item.link = entry.link;
                            item.mark = entry.categories;

                            if (link.indexOf("zhihu") != -1) {
                                item.author = entry.creator && entry.creator._;
                            } else {
                                item.author = entry.creator;
                            }
                            try {
                                item.date = entry.isoDate.split("T").join(" ").split(".000Z").join("")
                            } catch (e) {
                                item.date = entry.isoDate;
                            }
                            arry.push(item);
                        });

                        _this.siteList[index].articleList = arry;
                        _this.siteList[index].show = true;
                    }


                })
            }
        },

    })
    RSS.initPage();

})()