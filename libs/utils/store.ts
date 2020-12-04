class Store<T>{

    map = new Map<number,T>()
    counter = 0

    add(item:T){
        (item as any).id = this.counter++
        this.map.set((item as any).id,item)
    }

    get(id){
        return this.map.get(id)
    }

    list(){
        return Array.from(this.map.values())
    }

    remove(id){
        var val = this.map.get(id)
        this.map.delete(id)
        return val
    }
}