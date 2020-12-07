class Store<T>{

    map = new Map<number,T>()
    counter = 0

    add(item:T){
        (item as any).id = this.counter++
        this.map.set((item as any).id,item)
    }

    addList(items:T[]){
        items.forEach(i => this.add(i))
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