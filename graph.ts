

class Knot{

    id:number
    neighbours:number[] = []
    type//handle or uirect
    data:number
}



function floodfill(knotstore:Store<Knot>,startknot:Knot):Knot[]{
    var res:Knot[] = []

    var visited = new Set<number>()
    var frontier = [startknot.id]

    while(frontier.length > 0){
        var current = frontier.shift()
        res.push(knotstore.get(current))
        visited.add(current)

        frontier.push(...knotstore.get(current).neighbours) 
    }

    return res
}