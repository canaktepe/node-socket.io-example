var Products = [];

function removeProduct(id) {
    var product = Products.filter((p) => {
        return p.id === id;
    })[0];
    if (product === undefined) return;

    $.ajax({
        url: 'http://localhost:3000/api/products',
        method: 'DELETE',
        data: JSON.stringify(product),
        dataType: 'json',
        contentType: 'application/json',
        complete: function (context, jqXHR, textStatus) {
            if (context.status != 200) console.log(context.status);
        }
    })
}



function loadProducts() {
    $.ajax({
        url: 'http://localhost:3000/api/products',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            if (data.length > 0) productViewModel.products(data)

        },
        error: function (err) {

        }
    })
}

function ProductViewModel() {
    const self = this;
    self.products = ko.observableArray([]);
    self.newProductName = ko.observable('');
    self.addProduct = function () {
        if (self.newProductName() === '') return;
        var data = {
            name: self.newProductName()
        };
        $.ajax({
            url: 'http://localhost:3000/api/products',
            async: true,
            method: 'POST',
            data: JSON.stringify(data),
            dataType: 'json',
            complete: function (context, jqXHR, textStatus) {
                if (context.status === 200) $('#txtName').val('').focus();
                else console.log(context);
            },
        })
    };
    self.removeProduct = function (data) {
        $.ajax({
            url: 'http://localhost:3000/api/products',
            async: true,
            method: 'DELETE',
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json',
            complete: function (context, jqXHR, textStatus) {
                if (context.status != 200) console.log(context.status);
            }
        })
    }
}


$(document).ready(function () {

    productViewModel = new ProductViewModel();
    ko.applyBindings(productViewModel);

    loadProducts();

    socket.on('added product', function (data) {
        productViewModel.products.push(data);
    })

    socket.on('deleted product', function (data) {
        productViewModel.products.remove(function (item) {
            return item.id === data.id;
        });
    })
})