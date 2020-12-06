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
    uiManager:UIManager
    knotid:number

    constructor(){
        var that = this
        var parent = uirectstore.get(this.parent)
        //change the anchormin/max off the rect, doesnt require propagating update
        function createAnchorHandle(side){
            return new Handle((self) => {

                // var knot = that.uiManager.graph.data.get(that.id)
                that.uiManager.updateUI(that.knotid)
                //these cbs occur after drag
                //update the anchors/offsets/absrect
                //propagate through tree afterwards
                //handle cb after treeupdate should snap handle too appropriate position defined by uirect
            })
        }


        this.handles = [
            new Handle((self) => {
                //topleft
                that.anchorMin.x = inverseLerp(self.pos.x,parent.absRect.min.x,parent.absRect.max.x)
                that.anchorMin.y = inverseLerp(self.pos.y,parent.absRect.min.y,parent.absRect.max.y)
                that.uiManager.updateUI(that.knotid)
            }),
            new Handle((self) => {
                //topright
                that.anchorMax.x = inverseLerp(self.pos.x,parent.absRect.min.x,parent.absRect.max.x)
                that.anchorMin.y = inverseLerp(self.pos.y,parent.absRect.min.y,parent.absRect.max.y)
                that.uiManager.updateUI(that.knotid)
            }),
            new Handle((self) => {
                //botright
                that.anchorMax.x = inverseLerp(self.pos.x,parent.absRect.min.x,parent.absRect.max.x)
                that.anchorMax.y = inverseLerp(self.pos.y,parent.absRect.min.y,parent.absRect.max.y)
                that.uiManager.updateUI(that.knotid)
            }),
            new Handle((self) => {
                //botleft
                that.anchorMin.x = inverseLerp(self.pos.x,parent.absRect.min.x,parent.absRect.max.x)
                that.anchorMax.y = inverseLerp(self.pos.y,parent.absRect.min.y,parent.absRect.max.y)
                that.uiManager.updateUI(that.knotid)
            }),
            
            new Handle((self) => {
                var absminanchorpos = new Vector()
                var absmaxanchorpas = new Vector()
                var offsetmin = absminanchorpos.to(self.pos)
                var offsetmax = absmaxanchorpas.to(self.pos)

                //topleft
                that.offsetMin.x = offsetmin.x
                that.offsetMin.y = offsetmin.y
                that.uiManager.updateUI(that.knotid)

            }),
            new Handle((self) => {
                var absminanchorpos = new Vector()
                var absmaxanchorpas = new Vector()
                var offsetmin = absminanchorpos.to(self.pos)
                var offsetmax = absmaxanchorpas.to(self.pos)

                //topright
                that.offsetMax.x = offsetmax.x
                that.offsetMin.y = offsetmin.y
                that.uiManager.updateUI(that.knotid)
            }),
            new Handle((self) => {
                var absminanchorpos = new Vector()
                var absmaxanchorpas = new Vector()
                var offsetmin = absminanchorpos.to(self.pos)
                var offsetmax = absmaxanchorpas.to(self.pos)

                //botright
                that.offsetMax.x = offsetmax.x
                that.offsetMax.y = offsetmax.y
                that.uiManager.updateUI(that.knotid)
            }),
            new Handle((self) => {
                var absminanchorpos = new Vector()
                var absmaxanchorpas = new Vector()
                var offsetmin = absminanchorpos.to(self.pos)
                var offsetmax = absmaxanchorpas.to(self.pos)

                //botleft
                that.offsetMin.x = offsetmin.x
                that.offsetMax.y = offsetmax.y
                that.uiManager.updateUI(that.knotid)
            }),


            new Handle((self) => {
                //drag
            }),


            new Handle((self) => {
                var absminanchorpos = new Vector()
                var absmaxanchorpas = new Vector()
                var offsetmin = absminanchorpos.to(self.pos)
                var offsetmax = absmaxanchorpas.to(self.pos)

                //left
                that.offsetMin.x = offsetmin.x
                that.uiManager.updateUI(that.knotid)
            }),
            new Handle((self) => {
                var absminanchorpos = new Vector()
                var absmaxanchorpas = new Vector()
                var offsetmin = absminanchorpos.to(self.pos)
                var offsetmax = absmaxanchorpas.to(self.pos)
                //right
                that.offsetMax.x = offsetmax.x
                that.uiManager.updateUI(that.knotid)
            }),
            new Handle((self) => {
                var absminanchorpos = new Vector()
                var absmaxanchorpas = new Vector()
                var offsetmin = absminanchorpos.to(self.pos)
                var offsetmax = absmaxanchorpas.to(self.pos)
                //bot
                that.offsetMax.y = offsetmax.y
                that.uiManager.updateUI(that.knotid)
            }),

        ]
        

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

class UIManager{

    graph:Store<Knot>
    uirects:Store<UIRect>

    constructor(){

    }

    setUIRects(uirectstore:Store<UIRect>){
        this.graph = createGraph(uirectstore)
    }

    updateUI(startid:number){
        var start = this.graph.get(startid)
        var orderedknots = floodfill(this.graph,start)
        //todo maybe remove start knot from orderedknots
        for(var knot of orderedknots){
            //todo get handle and update it
            this.uirects.get(knot.data).update()
        }
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
        
        
        //rect.parent maybe not add rect.parent because parent uirects dont need to update if their children change
        //just add the children and the handles
        var neighbours = [...rect.children]
        knot.neighbours = [parent.id,children.id]
    }

    return knotstore
}