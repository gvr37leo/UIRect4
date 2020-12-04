// handles and rects form a tree/graph structure and events should propagate outwards

class UIRect{

    id:number
    anchorMin:Vector
    anchorMax:Vector
    offsetMin:Vector
    offsetMax:Vector
    absRect:Rect
    parent:number
    handles:Handle[] = []

    constructor(){

        //change the anchormin/max off the rect, doesnt require propagating update
        function createAnchorHandle(side){
            return new Handle((self) => {
                inverseLerp()
                //these cbs occur after drag
                //update the anchors/offsets/absrect
                //propagate through tree afterwards
                //handle cb after treeupdate should snap handle too appropriate position defined by uirect
            })
        }

        //changes the offsetmin/max off the rect, also change the absrect, propagate update
        function createOffsetHandle(side){
            return new Handle((self) => {

            })
        }

        //simillar to createoffsethandle just adjusts 2 handles, can be done via propagating
        function createEdgeHandle(side){
            return new Handle((self) => {

            })
        }

        // similar to createoffsethandle just adjust all handles, can be done via propagating
        function createDragHandle(side){
            return new Handle((self) => {

            })
        }

        var handles = [
            createAnchorHandle(0),
            createAnchorHandle(0),
            createAnchorHandle(0),
            createAnchorHandle(0),
            createOffsetHandle(0),
            createOffsetHandle(0),
            createOffsetHandle(0),
            createOffsetHandle(0),
            createDragHandle(0),
            createEdgeHandle(0),
            createEdgeHandle(0),
            createEdgeHandle(0),

        ]
        this.handles = handles

    }


    update(){
        var parent = uirectstore.get(this.parent)
        var absparent = parent.absRect
        if(parent == null){
            absparent = new Rect(new Vector(0,0),screensize.c())
        }

        var absmin = absparent.getPoint(this.anchorMin).add(this.offsetMin)
        var absmax = absparent.getPoint(this.anchorMax).add(this.offsetMax)

        this.absRect.min.overwrite(absmin)
        this.absRect.max.overwrite(absmax)
    }

    width(){
        return to(this.absRect.min.x,this.absRect.max.x)
    }

    draw(){

    }
}

function createGraph(uirectstore:Store<UIRect>){
    var knotstore = new Store<Knot>()
    var rects = uirectstore.list()

    for(var rect of rects){

        var knot = new Knot()
        knotstore.add(knot)
        knot.data = rect.id
    }

    for(var rect of rects){
        var knot = knotstore.get('data',rect.id)
        
        var parent = knotstore.get('data',rect.parent)
        var children = knotstore.get('data',rect.children)
        
        
        var neighbours = [rect.parent,...rect.children]
        knot.neighbours = [parent.id,children.id]
    }

    return knotstore
}