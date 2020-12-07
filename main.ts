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
/// <reference path="clickManager.ts" />




var screensize = new Vector(document.documentElement.clientWidth,document.documentElement.clientHeight)
var crret = createCanvas(screensize.x,screensize.y)
var canvas = crret.canvas
var ctxt = crret.ctxt

var clickManager = new ClickManager()
var mousepos = new Vector(0,0)
var uirectstore = new Store<UIRect>()
var handlestore = new Store<Handle>()
var a = addUIRect(null,true)
var b = addUIRect(a.id,true)
// var b = addUIRect(a.id)

a.update()


document.addEventListener('mousemove', e => {
    mousepos = getMousePos(canvas,e)
})

loop((dt) => {
    ctxt.clearRect(0,0,screensize.x,screensize.y)

    for(var rect of uirectstore.list()){
        rect.draw(ctxt)
    }
})


function addUIRect(parent:number,handles:boolean){
    var rect = new UIRect()
    uirectstore.add(rect)
    rect.parent = parent
    if(handles){
        rect.addHandles()
    }
    return rect
}
