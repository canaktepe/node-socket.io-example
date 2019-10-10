Array.prototype.getMaxId = function () {
    return this.length === 0 ? 0 : Math.max.apply(Math, this.map(function (o) {
        return o.id
    }));
}