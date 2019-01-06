(function () {
	//import commonJs from "js/common.js.js";
	let loginForm = new Vue({
		el: "#mainPage",
		components: {
			//'header-comp': header,
		},
		data: {
			posts: []
		},
		methods: {
			initPostList: function () {
				this.getArticleList();
			},
			getArticleList: function () {
				let _this = this;
				let para = commonJs.jsonToQueryString({
					query: `query{
								  posts{
								    username,
								    head,
								    time{day,year,minute},
								    title,
								    comment,
								    tags,
								    pv,
								    post
								  }
								}`
				});
				
				axios.get('http://localhost:3000/graphql' + para).then(
					function (resp) {
						if (resp) {
							_this.releaseLink(resp.data.data.posts);
						}
						
					}).catch(function (error) {
				});
			},
			releaseLink:function (posts) {
				
				for (let i = 0; i < posts.length; i++) {
					let post = posts[i];
					post.href = "article.html"+commonJs.jsonToQueryString({
						username: post.username,
						minute: post.time.minute,
						title: post.title
					});
				}
				
				this.posts = posts;
				
			}
		}
	});
	loginForm.initPostList();
})();