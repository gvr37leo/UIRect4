/// <reference path="libs/vector/vector.ts" />
/// <reference path="libs/utils/rng.ts" />
/// <reference path="libs/utils/store.ts" />
/// <reference path="libs/utils/table.ts" />
/// <reference path="libs/utils/utils.ts" />
/// <reference path="libs/utils/stopwatch.ts" />
/// <reference path="libs/utils/ability.ts" />
/// <reference path="libs/utils/anim.ts" />
/// <reference path="libs/rect/rect.ts" />
/// <reference path="libs/event/eventqueue.ts" />
/// <reference path="libs/event/eventsystem.ts" />
/// <reference path="uiRect.ts" />
/// <reference path="handle.ts" />
/// <reference path="graph.ts" />
/// <reference path="rectManager.ts" />




var screensize = new Vector(document.documentElement.clientWidth,document.documentElement.clientHeight)
var crret = createCanvas(screensize.x,screensize.y)
var canvas = crret.canvas
var ctxt = crret.ctxt

var uirectstore = new Store<UIRect>()

var ui = [
    new UIRect([
        new UIRect(),
        new UIRect(),
    ])
]

var eventqueue = new EventQueue()

eventqueue.listen('something',() => {
    var graph = createGraph(uirectstore)
    var knots2update = floodfill(graph,null)
    for(var knot of knots2update){
        uirectstore.get(knot.id).update()
    }
})

loop((dt) => {
    ctxt.clearRect(0,0,screensize.x,screensize.y)

    for(var rect of uirectstore.list()){
        rect.draw()
    }
})
