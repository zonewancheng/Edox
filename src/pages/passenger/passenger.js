(function () {
    var mainPage = new Vue({
        el:"#mainPage",
        data:function () {
            return{
                name:"",
                cardType:"编号",
                cardNum:"",
                mobile:"",
                selected:{value:0,text:"编号"},
                options:[
                    {value:0,text:"编号"},
                    {value:1,text:"id"},
                    {value:2,text:"昵称"},
                    {value:3,text:"其它"}
                ]
            }
        },
        methods: {
            showSelect:function () {
                mainPage.cardType = mainPage.selected.text;
            },
            confirmAdd:function () {
                alert("Vue在添加后60天生效")
            }
        }
    })
})()