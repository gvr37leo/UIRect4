enum HandleType{anchor,offset}

class Handle{
    id
    rect:UIRect
    pos:Vector
    oldpos:Vector
    delta = new Vector(0,0)
    selected = false
    hitbox = new Rect(new Vector(0,0), new Vector(10,10))
    
    onMove:(self:Handle) => void

    constructor(public type:HandleType, cb:(self:Handle) => void){
        this.pos = new Vector(0,0)
        this.onMove = cb

        clickManager.listen(this.hitbox, () => {
            this.selected = true
            
        })

        document.addEventListener('mouseup', e => {
            this.selected = false
        })

        document.addEventListener('mousemove', e => {
            var mousepos = getMousePos(canvas,e)
            if(this.selected){
                this.setPos(mousepos)
                this.onMove(this)
            }
        })
    }

    cleanup(){
        clickManager.delisten(this.hitbox)
        //todo
        //remove all the eventlistners
    }

    setPos(pos:Vector){
        this.oldpos = this.pos
        this.pos = pos
        this.delta = this.oldpos.to(this.pos)
        this.hitbox.min.overwrite(this.pos.c().add(new Vector(-5,-5)))
        this.hitbox.max.overwrite(this.pos.c().add(new Vector(5,5)))
        
    }

    draw(ctxt:CanvasRenderingContext2D){
        

        if(this.type == HandleType.anchor){
            ctxt.fillStyle = 'red'
        }else{
            ctxt.fillStyle = 'blue'
        }
        this.pos.draw(ctxt)
    }
}