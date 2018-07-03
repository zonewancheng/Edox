'use strict';

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

    Vue.component('article-list-comp', {
        template: "#rss-articleList",
        props: ['articlelist', 'name'],
        data: function data() {
            return {
                hide: false
            };
        },
        methods: {
            toggle: function toggle(key) {
                this.hide = !this.hide;
                console.log(this.name + " : hide : " + key.hide);
            }
        }
    });
    var RSS = new Vue({
        el: "#mainPage",
        data: function data() {
            return {
                siteList: []
            };
        },
        methods: {

            initPage: function initPage() {
                this.getRssFeed();
            },
            getRssFeed: function getRssFeed() {

                var _this = this;
                var url = "https://raw.githubusercontent.com/OoSpace/database/master/rss.json";

                axios({
                    url: url,
                    timeout: 3000,
                    type: 'get'

                }).then(function (resp) {
                    if (resp) {
                        var data = resp.data;
                        var siteList = data && JSON.parse(decodeURIComponent(data)).siteList || [];
                        _this.siteList = siteList;
                    }
                    _this.parseRssList();
                }).catch(function (error) {
                    _this.parseRssList();
                });
            },
            parseRssList: function parseRssList() {
                for (var i = 0, lg = this.siteList.length; i < lg; i++) {
                    var link = this.siteList[i].feedUrl;

                    this.parseRss(link, i);
                }
            },
            parseRss: function parseRss(link, index) {

                var CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
                var _this = this;
                var arry = [];
                var parser = new RSSParser();

                parser.parseURL(CORS_PROXY + link, function (err, feed) {

                    try {
                        feed && feed.items && feed.items.forEach(function (entry) {
                            var item = JSON.parse(JSON.stringify(artile));
                            item.title = entry.title;
                            item.link = entry.link;
                            item.mark = entry.categories;

                            if (link.indexOf("zhihu") != -1) {
                                item.author = entry.creator && entry.creator._;
                            } else if (link.indexOf("segmentfault") != -1) {
                                item.author = entry.author;
                            } else {
                                item.author = entry.creator;
                            }
                            try {
                                if (link.indexOf("segmentfault") != -1) {
                                    item.date = entry.pubDate.split("T").join(" ").split(".000Z").join("");
                                } else {
                                    item.date = entry.isoDate.split("T").join(" ").split(".000Z").join("");
                                }
                            } catch (e) {
                                item.date = entry.isoDate;
                            }
                            arry.push(item);
                        });

                        _this.siteList[index].articleList = arry;
                        _this.siteList[index].show = true;
                    } catch (r) {
                        feed && feed.items && feed.items.forEach(function (entry) {
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
                                item.date = entry.isoDate.split("T").join(" ").split(".000Z").join("");
                            } catch (e) {
                                item.date = entry.isoDate;
                            }
                            arry.push(item);
                        });

                        _this.siteList[index].articleList = arry;
                    }
                });
            }
        }

    });
    RSS.initPage();
})();