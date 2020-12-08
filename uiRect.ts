// handles and rects form a tree/graph structure and events should propagate outwards
enum HandlePositions{anchortl,anchortr,anchorbr,anchorbl,offsettl,offsettr,offsetbr,offsetbl,offsetdrag,offsetl,offsetr,offsetb}
enum JustifyContent{left,center,right,spacebetween,spacearound,spaceevenly}

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
    private handlepositions: Map<HandlePositions, Vector>
    private handletype: Map<HandlePositions, number>

    isFlex = false
    justifyCOntent = JustifyContent.left
    private justifyContentMap: Map<JustifyContent, () => void>

    constructor(){
        this.handlepositions = new Map<HandlePositions,Vector>()
        this.handlepositions.set(HandlePositions.anchortl, new Vector(0,0))
        this.handlepositions.set(HandlePositions.anchortr, new Vector(1,0))
        this.handlepositions.set(HandlePositions.anchorbr, new Vector(1,1))
        this.handlepositions.set(HandlePositions.anchorbl, new Vector(0,1))
        this.handlepositions.set(HandlePositions.offsettl, new Vector(0,0))
        this.handlepositions.set(HandlePositions.offsettr, new Vector(1,0))
        this.handlepositions.set(HandlePositions.offsetbr, new Vector(1,1))
        this.handlepositions.set(HandlePositions.offsetbl, new Vector(0,1))
        this.handlepositions.set(HandlePositions.offsetdrag, new Vector(0.5,0))
        this.handlepositions.set(HandlePositions.offsetl, new Vector(0,0.5))
        this.handlepositions.set(HandlePositions.offsetr, new Vector(1,0.5))
        this.handlepositions.set(HandlePositions.offsetb, new Vector(0.5,1))
        

        this.handletype = new Map<HandlePositions,number>()
        this.handletype.set(HandlePositions.anchortl,0)
        this.handletype.set(HandlePositions.anchortr,0)
        this.handletype.set(HandlePositions.anchorbr,0)
        this.handletype.set(HandlePositions.anchorbl,0)
        this.handletype.set(HandlePositions.offsettl,1)
        this.handletype.set(HandlePositions.offsettr,1)
        this.handletype.set(HandlePositions.offsetbr,1)
        this.handletype.set(HandlePositions.offsetbl,1)
        this.handletype.set(HandlePositions.offsetdrag,1)
        this.handletype.set(HandlePositions.offsetl,1)
        this.handletype.set(HandlePositions.offsetr,1)
        this.handletype.set(HandlePositions.offsetb,1)

        this.justifyContentMap = new Map<JustifyContent,() => void>()
        this.justifyContentMap.set(JustifyContent.left,this.left)
        this.justifyContentMap.set(JustifyContent.right,this.right)
        this.justifyContentMap.set(JustifyContent.center,this.center)
        this.justifyContentMap.set(JustifyContent.spacebetween,this.spaceBetween)
        this.justifyContentMap.set(JustifyContent.spacearound,this.spaceAround)
        this.justifyContentMap.set(JustifyContent.spaceevenly,this.spaceEvenly)
    }

    addHandles(){
        this.addAnchorHandles()
        this.addOffsetHandles()
    }

    removeSpecificHandles(handlepositions:HandlePositions[]){
        for(var handlepos of handlepositions){
            this.handles.get(handlepos).cleanup()
            this.handles.delete(handlepos)
            handlestore.remove(this.handles.get(handlepos))
        }
    }

    addSpecificHandles(handlepositions:HandlePositions[]){
        var that = this
        var map = new Map<HandlePositions,() => void>()

        map.set(HandlePositions.anchortl, () => {
            this.handles.set(HandlePositions.anchortl,new Handle(HandleType.anchor,(self) => {
                //topleft
                that.anchorMin.x = inverseLerp(self.pos.x,this.absParent.min.x,this.absParent.max.x)
                that.anchorMin.y = inverseLerp(self.pos.y,this.absParent.min.y,this.absParent.max.y)
    
                var reversedelta = self.delta.c().scale(-1)
                that.offsetMin.x += reversedelta.x
                that.offsetMin.y += reversedelta.y
                this.update()
            }))
        })

        map.set(HandlePositions.anchortr, () => {
            this.handles.set(HandlePositions.anchortr,new Handle(HandleType.anchor,(self) => {
                //topright
                that.anchorMax.x = inverseLerp(self.pos.x,this.absParent.min.x,this.absParent.max.x)
                that.anchorMin.y = inverseLerp(self.pos.y,this.absParent.min.y,this.absParent.max.y)
    
                var reversedelta = self.delta.c().scale(-1)
                that.offsetMax.x += reversedelta.x
                that.offsetMin.y += reversedelta.y
                this.update()
            }))
        })
        map.set(HandlePositions.anchorbl, () => {
            this.handles.set(HandlePositions.anchorbl,new Handle(HandleType.anchor,(self) => {
                //botleft
                that.anchorMin.x = inverseLerp(self.pos.x,this.absParent.min.x,this.absParent.max.x)
                that.anchorMax.y = inverseLerp(self.pos.y,this.absParent.min.y,this.absParent.max.y)

                var reversedelta = self.delta.c().scale(-1)
                that.offsetMin.x += reversedelta.x
                that.offsetMax.y += reversedelta.y

                this.update()
            }))
        })
        map.set(HandlePositions.anchorbr, () => {
            this.handles.set(HandlePositions.anchorbr,new Handle(HandleType.anchor,(self) => {
                //botright
                that.anchorMax.x = inverseLerp(self.pos.x,this.absParent.min.x,this.absParent.max.x)
                that.anchorMax.y = inverseLerp(self.pos.y,this.absParent.min.y,this.absParent.max.y)
    
                var reversedelta = self.delta.c().scale(-1)
                that.offsetMax.x += reversedelta.x
                that.offsetMax.y += reversedelta.y
    
                this.update()
            }))
        })



        map.set(HandlePositions.offsettl, () => {
            this.handles.set(HandlePositions.offsettl,new Handle(HandleType.offset,(self) => {
                var offsetmin = this.absAnchorMin().to(self.pos)
                var offsetmax = this.absAnchorMax().to(self.pos)
    
                //topleft
                that.offsetMin.x = offsetmin.x
                that.offsetMin.y = offsetmin.y
                this.update()
    
            }))
        })
        map.set(HandlePositions.offsettr, () => {
            this.handles.set(HandlePositions.offsettr,new Handle(HandleType.offset,(self) => {
                var offsetmin = this.absAnchorMin().to(self.pos)
                var offsetmax = this.absAnchorMax().to(self.pos)
    
                //topright
                that.offsetMax.x = offsetmax.x
                that.offsetMin.y = offsetmin.y
                this.update()
            }))
        })
        map.set(HandlePositions.offsetbr, () => {
            this.handles.set(HandlePositions.offsetbr,new Handle(HandleType.offset,(self) => {
                var offsetmin = this.absAnchorMin().to(self.pos)
                var offsetmax = this.absAnchorMax().to(self.pos)
    
                //botright
                that.offsetMax.x = offsetmax.x
                that.offsetMax.y = offsetmax.y
                this.update()
            }))
        })
        map.set(HandlePositions.offsetbl, () => {
            this.handles.set(HandlePositions.offsetbl,new Handle(HandleType.offset,(self) => {
                var offsetmin = this.absAnchorMin().to(self.pos)
                var offsetmax = this.absAnchorMax().to(self.pos)
    
                //botleft
                that.offsetMin.x = offsetmin.x
                that.offsetMax.y = offsetmax.y
                this.update()
            }))
        })
        map.set(HandlePositions.offsetdrag, () => {
            this.handles.set(HandlePositions.offsetdrag,new Handle(HandleType.offset,(self) => {
                that.offsetMin.add(self.delta)
                that.offsetMax.add(self.delta)
                this.update()
                //drag
            }))
        })
        map.set(HandlePositions.offsetl, () => {
            this.handles.set(HandlePositions.offsetl,new Handle(HandleType.offset,(self) => {
                var offsetmin = this.absAnchorMin().to(self.pos)
                var offsetmax = this.absAnchorMax().to(self.pos)
    
                //left
                that.offsetMin.x = offsetmin.x
                this.update()
            }))
        })
        map.set(HandlePositions.offsetr, () => {
            this.handles.set(HandlePositions.offsetr,new Handle(HandleType.offset,(self) => {
                var offsetmin = this.absAnchorMin().to(self.pos)
                var offsetmax = this.absAnchorMax().to(self.pos)
                //right
                that.offsetMax.x = offsetmax.x
                this.update()
            }))
        })
        map.set(HandlePositions.offsetb, () => {
            this.handles.set(HandlePositions.offsetb,new Handle(HandleType.offset,(self) => {
                var offsetmin = this.absAnchorMin().to(self.pos)
                var offsetmax = this.absAnchorMax().to(self.pos)
                //bot
                that.offsetMax.y = offsetmax.y
                this.update()
            }))
        })


        for(var handlepos of handlepositions){
            map.get(handlepos)()
            handlestore.add(this.handles.get(handlepos))
        }
    }

    addAnchorHandles(){
        this.addSpecificHandles([
            HandlePositions.anchortl,
            HandlePositions.anchortr,
            HandlePositions.anchorbr,
            HandlePositions.anchorbl,
        ])
    }

    addOffsetHandles(){
        this.addSpecificHandles([
            HandlePositions.offsetb,
            HandlePositions.offsetbl,
            HandlePositions.offsetbr,
            HandlePositions.offsetdrag,
            HandlePositions.offsetl,
            HandlePositions.offsetr,
            HandlePositions.offsettl,
            HandlePositions.offsettr,
        ])
    }

    getParentAbsRect(){
        var parent = uirectstore.get(this.parent)
        var absparent = parent?.absRect
        if(parent == null){
            absparent = new Rect(new Vector(0,0),screensize.c())
        }
        return absparent
    }

    focusGained(){
        //add handles
        //if root only add offsethandles
    }

    focusLost(){
        //remove handles
    }

    update(){
        
        this.absParent = this.getParentAbsRect()

        // var absmin = absparent.getPoint(this.anchorMin).add(this.offsetMin)
        // var absmax = absparent.getPoint(this.anchorMax).add(this.offsetMax)

        var absAnchorRect = new Rect(this.absAnchorMin(),this.absAnchorMax())
        this.absRect.min.overwrite(this.absOffsetMin())
        this.absRect.max.overwrite(this.absOffsetMax())
        var absrects = [absAnchorRect,this.absRect]

        for(var [hpos,handle] of this.handles){
            handle.setPos(absrects[this.handletype.get(hpos)].getPoint(this.handlepositions.get(hpos)))
        }

        
        if(this.isFlex){
            this.updateChildren()
            this.justifyContentMap.get(this.justifyCOntent).bind(this)()
        }

        this.updateChildren()
        
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
    
    getChildren(){
        return uirectstore.list().filter(r => r.parent == this.id)
    }

    updateChildren(){
        this.getChildren().forEach(c => c.update())
    }

    draw(ctxt:CanvasRenderingContext2D){
        this.absRect.draw(ctxt)
        for(var [key,handle] of this.handles){
            handle.draw(ctxt)
        }
    }

    left(){
        this.spaceChildren(0,0)
    }

    right(){
        var {freespace} = this.calcstats()
        this.spaceChildren(freespace,0)
    }

    center(){
        var {freespace} = this.calcstats()
        this.spaceChildren(freespace / 2,0)
    }

    spaceBetween(){
        var {freespace} = this.calcstats()
        var gaps = this.getChildren().length - 1
        this.spaceChildren(0,freespace / gaps)
    }

    spaceAround(){
        var {freespace} = this.calcstats()
        var minigaps = (this.getChildren().length - 1) * 2 + 2
        var freespaceperminigap = freespace / minigaps
        this.spaceChildren(freespaceperminigap, freespaceperminigap * 2)
    }

    spaceEvenly(){
        var {freespace} = this.calcstats()
        var gaps = this.getChildren().length + 1
        var freespacepergap = freespace / gaps
        this.spaceChildren(freespacepergap, freespacepergap)
    }

    spaceChildren(start:number,spacing:number){
        var children = this.getChildren()
        var current = start
        for(var child of children){
            var originalsize = child.absOffsetMin().to(child.absOffsetMax())
            child.anchorMin.overwrite(new Vector(0,0))
            child.anchorMax.overwrite(new Vector(0,0))
            var dest = new Vector(current,0)
            //move/set topleft to current destination
            //gaat fout hier vanwege absRect
            child.offsetMin.overwrite(dest)
            child.offsetMax.overwrite(originalsize.add(dest))
            current += spacing + child.absRect.size().x
        }
    }

    calcstats(){
        var width = this.absRect.size().x
        var childrenwidth = sum(this.getChildren().map(c => c.absRect.size().x))
        var freespace = width - childrenwidth

        return {width,childrenwidth,freespace}
    }

    setSize(size:Vector){
        this.anchorMin.overwrite(new Vector(0,0))
        this.anchorMax.overwrite(new Vector(0,0))
        this.offsetMin.overwrite(new Vector(0,0))
        this.offsetMax.overwrite(size)
    }

}