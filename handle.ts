class Handle{
    id
    rect:UIRect
    pos:Vector
    selected = false
    onMove:(self:Handle) => void

    constructor(cb:(self:Handle) => void){
        this.pos = new Vector(0,0)
        this.onMove = cb

        document.addEventListener('mousedown', e => {
            var mousepos = getMousePos(canvas,e)
            if(mousepos.to(this.pos).length() < 5){
                this.selected = true
            }
        })

        document.addEventListener('mouseup', e => {
            this.selected = false
        })

        document.addEventListener('mousemove', e => {
            var mousepos = getMousePos(canvas,e)
            if(this.selected){
                this.pos = mousepos
                this.onMove(this)
            }
        })
    }

    draw(ctxt:CanvasRenderingContext2D){
        this.pos.draw(ctxt)
    }
}