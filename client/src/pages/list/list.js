(function () {
	//import commonJs from "js/common.js";
	let loginForm = new Vue({
		el: "#mainPage",
		components: {
			//'header-comp': header,
		},
		data:{
			posts: [{
				time: {
					year: "2018",
					day: "2018-12-12",
					minute: "56",
				},
				username: "user",
				title: "测试用例",
				href:""
			},{
				time: {
					year: "2018",
					day: "2018-12-12",
					minute: "56",
				},
				username: "user",
				title: "测试用例",
				href:""
			},{
				time: {
					year: "2018",
					day: "2018-12-12",
					minute: "56",
				},
				username: "user",
				title: "测试用例",
				href:""
			},{
				time: {
					year: "2018",
					day: "2018-12-12",
					minute: "56",
				},
				username: "user",
				title: "测试用例",
				href:""
			},{
				time: {
					year: "2017",
					day: "2017-12-12",
					minute: "56",
				},
				username: "user",
				title: "测试用例",
				href:""
			}]
		},
		methods: {
			initPostList:function () {
				for(let i=0;i<this.posts.length;i++){
					let post = this.posts[i];
					post.href = commonJs.jsonToHrefString({
						0:"blog",
						1:post.username,
						2:post.time.minute,
						3:post.title
					});
				}
			}
		}
	});
	loginForm.initPostList();
})();