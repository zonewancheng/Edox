var Foo = { template: '<div>foo</div>' }
var Bar = { template: '<div>bar</div>' }

var router = new VueRouter({
    routes:[
        { path: '/foo', component: Foo },
        { path: '/bar', component: Bar }
    ]
})

