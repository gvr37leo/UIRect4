enum JustifyContent{left,center,right,spacebetween,spacearound,spaceevenly}

function organize(self:UIRect,children:UIRect[],type:JustifyContent){

    var totalwidth = self.width()
    var childrenwidth = sum(children.map(c => c.width()))
    var vacantspace = totalwidth - childrenwidth
    var spaceperblock = vacantspace / children.length
}

function positionStart(){

}

function positionEnd(){

}

function positionBetween(){

}

function positionAround(){

}

function positionEvenly(){

}


function spaceBlocks(start,margin,blocks){

}