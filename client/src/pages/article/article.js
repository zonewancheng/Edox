(function () {
	
	let article = {
		title: '',
		description: '',
		link: '',
		image: '',
		copyright: '',
		mark: [],
		author: "",
		date: ""
	};
	
	Vue.component('article-item-comp',{
		template:"#rss-articleItem",
		props:['article-item','name'],
		data:function () {
			return{
				hide:false
			}
		},
		methods:{
			toggle: function (key) {
				this.hide = !this.hide;
				console.log(this.name +" : hide : "+key.hide)
			},
		}
	});
	let RSS = new Vue({
		el: "#mainPage",
		components: {
			//'header-comp': header,
		},
		data:{
			post: {},
			title:"日积月累"
		},
		methods: {
			/**
			 * 初始化页面
			 */
			initPage: function (options,callback) {
				
				options = commonJs.getUrlParams();
				let _this = this;
				let para = commonJs.jsonToQueryString({
					query: `query{
							  post(title:"${options.title}",username:"${options.username}",time:{minute:"${options.minute}"}){
							    username,
							    head,
							    time{day},
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
							_this.post = resp.data.data.post;
						}
						
					}).catch(function (error) {
				});
			}
		}
	});
	//init
	RSS.initPage();
})()