class ClickManager{
    rects:Map<Rect,(pos:Vector) => void> = new Map()

    constructor(){
        this.listenToDocument()
    }

    listenToDocument(){
        document.addEventListener('mousedown',e => {
            this.click(getMousePos(canvas,e))
        })
    }

    click(pos:Vector){
        for(var [rect,cb] of this.rects){
            if(rect.collidePoint(pos)){
                cb(pos)
                break
            }
        }
    }

    listen(rect:Rect,cb:(pos:Vector) => void){
        this.rects.set(rect,cb)
    }

    delisten(rect:Rect){
        this.rects.delete(rect)
    }
}