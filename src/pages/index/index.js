(function () {
    var mainPage = new Vue({
        el:"#mainPage",
        data:function () {
            return{

            }
        },
        methods: {
            addBySelf:function () {
                alert("1")
            },
            addBy12306:function () {
                alert("2")
            }
        }
    })
})()