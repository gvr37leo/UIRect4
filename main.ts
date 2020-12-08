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
/// <reference path="clickManager.ts" />




var screensize = new Vector(document.documentElement.clientWidth,document.documentElement.clientHeight)
var crret = createCanvas(screensize.x,screensize.y)
var canvas = crret.canvas
var ctxt = crret.ctxt

var clickManager = new ClickManager()
var mousepos = new Vector(0,0)
var uirectstore = new Store<UIRect>()
var handlestore = new Store<Handle>()

function addFlexbox(self:UIRect,justify:JustifyContent,anchormin:Vector,anchormax:Vector,offsetmin:Vector,offsetmax:Vector){
    var rect = addUIRect(self.id,true)
    addDemoChildRects(rect)
    rect.addOffsetHandles()
    // rect.addAnchorHandles()
    rect.justifyCOntent = justify
    rect.anchorMin = anchormin
    rect.anchorMax = anchormax
    rect.offsetMin = offsetmin
    rect.offsetMax = offsetmax
    return rect
}

var rootrect = addUIRect(null,false)
rootrect.addOffsetHandles()
addFlexbox(rootrect,JustifyContent.center,new Vector(0.5,0),new Vector(0.5,0),new Vector(-200,0),new Vector(200, 100))
addFlexbox(rootrect,JustifyContent.left,new Vector(0,0),new Vector(0,0),new Vector(0,0),new Vector(400,200))
addFlexbox(rootrect,JustifyContent.right,new Vector(1,0),new Vector(1,0),new Vector(-400,0),new Vector(0,200))

addFlexbox(rootrect,JustifyContent.spacearound,new Vector(0,0.5),new Vector(1,0.5),new Vector(0,-100),new Vector(1,100))
addFlexbox(rootrect,JustifyContent.spaceevenly,new Vector(0,1),new Vector(0,1),new Vector(0,-100),new Vector(400,0))
addFlexbox(rootrect,JustifyContent.spacebetween,new Vector(1,1),new Vector(1,1),new Vector(-400,-200),new Vector(0,0))

// var b = addUIRect(a.id)

rootrect.update()


document.addEventListener('mousemove', e => {
    mousepos = getMousePos(canvas,e)
})

loop((dt) => {
    ctxt.clearRect(0,0,screensize.x,screensize.y)

    for(var rect of uirectstore.list()){
        rect.draw(ctxt)
    }
})

function addDemoChildRects(self:UIRect){
    for(var i = 0; i < 5;i++){
        var rect = addUIRect(self.id,false)
        rect.setSize(new Vector(40,40))
        // rect.addOffsetHandles()
    }
}

function addUIRect(parent:number,flex:boolean){
    var rect = new UIRect()
    uirectstore.add(rect)
    rect.parent = parent
    rect.isFlex = flex
    return rect
}
