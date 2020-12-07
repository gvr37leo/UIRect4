// handles and rects form a tree/graph structure and events should propagate outwards
enum HandlePositions{anchortl,anchortr,anchorbr,anchorbl,offsettl,offsettr,offsetbr,offsetbl,offsetdrag,offsetl,offsetr,offsetb}

class UIRect{

    id:number
    anchorMin:Vector = new Vector(0.1,0.1)
    anchorMax:Vector = new Vector(0.9,0.9)
    offsetMin:Vector = new Vector(10,10)
    offsetMax:Vector = new Vector(-10,-10)
    absRect:Rect = new Rect(new Vector(0,0), new Vector(0,0))
    parent:number = null
    handles = new Map<HandlePositions,Handle>()
    // uiManager:UIManager
    knotid:number
    absParent: Rect

    constructor(){

    }

    addHandles(){
        this.addAnchorHandles()
        this.addOffsetHandles()
        

        handlestore.addList(Array.from(this.handles.values()))
    }

    addAnchorHandles(){
        var that = this
        this.handles.set(HandlePositions.anchortl,new Handle(HandleType.anchor,(self) => {
            //topleft
            that.anchorMin.x = inverseLerp(self.pos.x,this.absParent.min.x,this.absParent.max.x)
            that.anchorMin.y = inverseLerp(self.pos.y,this.absParent.min.y,this.absParent.max.y)

            var reversedelta = self.delta.c().scale(-1)
            that.offsetMin.x += reversedelta.x
            that.offsetMin.y += reversedelta.y
            this.update()
        }))
        this.handles.set(HandlePositions.anchortr,new Handle(HandleType.anchor,(self) => {
            //topright
            that.anchorMax.x = inverseLerp(self.pos.x,this.absParent.min.x,this.absParent.max.x)
            that.anchorMin.y = inverseLerp(self.pos.y,this.absParent.min.y,this.absParent.max.y)

            var reversedelta = self.delta.c().scale(-1)
            that.offsetMax.x += reversedelta.x
            that.offsetMin.y += reversedelta.y
            this.update()
        }))
        this.handles.set(HandlePositions.anchorbr,new Handle(HandleType.anchor,(self) => {
            //botright
            that.anchorMax.x = inverseLerp(self.pos.x,this.absParent.min.x,this.absParent.max.x)
            that.anchorMax.y = inverseLerp(self.pos.y,this.absParent.min.y,this.absParent.max.y)

            var reversedelta = self.delta.c().scale(-1)
            that.offsetMax.x += reversedelta.x
            that.offsetMax.y += reversedelta.y

            this.update()
        }))
        this.handles.set(HandlePositions.anchorbl,new Handle(HandleType.anchor,(self) => {
            //botleft
            that.anchorMin.x = inverseLerp(self.pos.x,this.absParent.min.x,this.absParent.max.x)
            that.anchorMax.y = inverseLerp(self.pos.y,this.absParent.min.y,this.absParent.max.y)

            var reversedelta = self.delta.c().scale(-1)
            that.offsetMin.x += reversedelta.x
            that.offsetMax.y += reversedelta.y

            this.update()
        }))
        //todo add handles to store
    }

    addOffsetHandles(){
        var that = this
        this.handles.set(HandlePositions.offsettl,new Handle(HandleType.offset,(self) => {
            var offsetmin = this.absAnchorMin().to(self.pos)
            var offsetmax = this.absAnchorMax().to(self.pos)

            //topleft
            that.offsetMin.x = offsetmin.x
            that.offsetMin.y = offsetmin.y
            this.update()

        }))
        this.handles.set(HandlePositions.offsettr,new Handle(HandleType.offset,(self) => {
            var offsetmin = this.absAnchorMin().to(self.pos)
            var offsetmax = this.absAnchorMax().to(self.pos)

            //topright
            that.offsetMax.x = offsetmax.x
            that.offsetMin.y = offsetmin.y
            this.update()
        }))
        this.handles.set(HandlePositions.offsetbr,new Handle(HandleType.offset,(self) => {
            var offsetmin = this.absAnchorMin().to(self.pos)
            var offsetmax = this.absAnchorMax().to(self.pos)

            //botright
            that.offsetMax.x = offsetmax.x
            that.offsetMax.y = offsetmax.y
            this.update()
        }))
        this.handles.set(HandlePositions.offsetbl,new Handle(HandleType.offset,(self) => {
            var offsetmin = this.absAnchorMin().to(self.pos)
            var offsetmax = this.absAnchorMax().to(self.pos)

            //botleft
            that.offsetMin.x = offsetmin.x
            that.offsetMax.y = offsetmax.y
            this.update()
        }))
        this.handles.set(HandlePositions.offsetdrag,new Handle(HandleType.offset,(self) => {
            that.offsetMin.add(self.delta)
            that.offsetMax.add(self.delta)
            this.update()
            //drag
        }))
        this.handles.set(HandlePositions.offsetl,new Handle(HandleType.offset,(self) => {
            var offsetmin = this.absAnchorMin().to(self.pos)
            var offsetmax = this.absAnchorMax().to(self.pos)

            //left
            that.offsetMin.x = offsetmin.x
            this.update()
        }))
        this.handles.set(HandlePositions.offsetr,new Handle(HandleType.offset,(self) => {
            var offsetmin = this.absAnchorMin().to(self.pos)
            var offsetmax = this.absAnchorMax().to(self.pos)
            //right
            that.offsetMax.x = offsetmax.x
            this.update()
        }))
        this.handles.set(HandlePositions.offsetb,new Handle(HandleType.offset,(self) => {
            var offsetmin = this.absAnchorMin().to(self.pos)
            var offsetmax = this.absAnchorMax().to(self.pos)
            //bot
            that.offsetMax.y = offsetmax.y
            this.update()
        }))

        //todo add handles to store
    }

    getParentAbsRect(){
        var parent = uirectstore.get(this.parent)
        var absparent = parent?.absRect
        if(parent == null){
            absparent = new Rect(new Vector(10,10),screensize.c().add(new Vector(-10,-10)))
        }
        return absparent
    }


    update(){
        
        var handlepositions = new Map<HandlePositions,Vector>()
        handlepositions.set(HandlePositions.anchortl, new Vector(0,0))
        handlepositions.set(HandlePositions.anchortr, new Vector(1,0))
        handlepositions.set(HandlePositions.anchorbr, new Vector(1,1))
        handlepositions.set(HandlePositions.anchorbl, new Vector(0,1))
        handlepositions.set(HandlePositions.offsettl, new Vector(0,0))
        handlepositions.set(HandlePositions.offsettr, new Vector(1,0))
        handlepositions.set(HandlePositions.offsetbr, new Vector(1,1))
        handlepositions.set(HandlePositions.offsetbl, new Vector(0,1))
        handlepositions.set(HandlePositions.offsetdrag, new Vector(0.5,0))
        handlepositions.set(HandlePositions.offsetl, new Vector(0,0.5))
        handlepositions.set(HandlePositions.offsetr, new Vector(1,0.5))
        handlepositions.set(HandlePositions.offsetb, new Vector(0.5,1))
        

        var handletype = new Map<HandlePositions,number>()
        handletype.set(HandlePositions.anchortl,0)
        handletype.set(HandlePositions.anchortr,0)
        handletype.set(HandlePositions.anchorbr,0)
        handletype.set(HandlePositions.anchorbl,0)
        handletype.set(HandlePositions.offsettl,1)
        handletype.set(HandlePositions.offsettr,1)
        handletype.set(HandlePositions.offsetbr,1)
        handletype.set(HandlePositions.offsetbl,1)
        handletype.set(HandlePositions.offsetdrag,1)
        handletype.set(HandlePositions.offsetl,1)
        handletype.set(HandlePositions.offsetr,1)
        handletype.set(HandlePositions.offsetb,1)

        this.absParent = this.getParentAbsRect()

        // var absmin = absparent.getPoint(this.anchorMin).add(this.offsetMin)
        // var absmax = absparent.getPoint(this.anchorMax).add(this.offsetMax)

        

        var absAnchorRect = new Rect(this.absAnchorMin(),this.absAnchorMax())
        this.absRect.min.overwrite(this.absOffsetMin())
        this.absRect.max.overwrite(this.absOffsetMax())
        var absrects = [absAnchorRect,this.absRect]

        for(var [hpos,handle] of this.handles){
            handle.setPos(absrects[handletype.get(hpos)].getPoint(handlepositions.get(hpos)))
        }

        
        if(false){//flexbox
            //move children
            //update their offset/anchors
        }else{
            this.updateChildren()
        }

        
    }

    absAnchorMin(){
        return this.absParent.getPoint(this.anchorMin)
    }

    absAnchorMax(){
        return this.absParent.getPoint(this.anchorMax)
    }

    absOffsetMin(){
        return this.absAnchorMin().add(this.offsetMin)
    }

    absOffsetMax(){
        return this.absAnchorMax().add(this.offsetMax)
    }

    width(){
        return to(this.absRect.min.x,this.absRect.max.x)
    }

    updateChildren(){
        var children = uirectstore.list().filter(r => r.parent == this.id)
        children.forEach(c => c.update())
    }

    draw(ctxt:CanvasRenderingContext2D){
        this.absRect.draw(ctxt)
        for(var [key,handle] of this.handles){
            handle.draw(ctxt)
        }
    }

}

// class UIManager{

//     graph:Store<Knot>
//     uirects:Store<UIRect>

//     constructor(){

//     }

//     setUIRects(uirectstore:Store<UIRect>){
//         this.graph = createGraph(uirectstore)
//     }

//     updateUI(startid:number){
//         var start = this.graph.get(startid)
//         var orderedknots = floodfill(this.graph,start)
//         //todo maybe remove start knot from orderedknots
//         for(var knot of orderedknots){
//             //todo get handle and update it
//             this.uirects.get(knot.data).update()
//         }
//     }

// }


// function createGraph(uirectstore:Store<UIRect>){
//     var knotstore = new Store<Knot>()
//     var rects = uirectstore.list()

//     for(var rect of rects){

//         var knot = new Knot()
//         knotstore.add(knot)
//         knot.data = rect.id
//     }

//     for(var rect of rects){
//         var knot = knotstore.get('data',rect.id)
        
//         var parent = knotstore.get('data',rect.parent)
//         var children = knotstore.get('data',rect.children)
        
        
//         //rect.parent maybe not add rect.parent because parent uirects dont need to update if their children change
//         //just add the children and the handles
//         var neighbours = [...rect.children]
//         knot.neighbours = [parent.id,children.id]
//     }

//     return knotstore
// }