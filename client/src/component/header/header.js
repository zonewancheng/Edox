Vue.component('header-comp',{
	template:"#header-template",
	props:["title"],
	data:function () {
		return {
			showMenu:false,
			menuList:["首页","写文章","阅读","登录","退出",]
		}
	},
	methods:{
		hideMenu:function () {
			this.showMenu = false;
		},
		openMenu:function () {
			this.showMenu = true;
		}
	}
});
