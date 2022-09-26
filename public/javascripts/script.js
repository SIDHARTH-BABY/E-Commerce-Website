



function addToCart(proId) {
  $.ajax({
    url: '/add-to-cart/' + proId,
    method: 'get',
    success: (response) => {
      if (response.status) {
        let count = $('#cart-count').html()
        count = parseInt(count) + 1
        $('#cart-count').html(count)
        swal("Good job!", "Sucessfully Added to cart", "success");
      }else{
        location.href='/login'
       
      }
      
     
     
    }
  })

}

function changeQuantity(cartId, proId, count,qty) {
  // let quantity = parseInt(document.getElementById(proId).value)
  count = parseInt(count)
  let quandity =parseInt(qty)

 

  $.ajax({
    url: '/change-product-quantity',
    data: {
      
      cart: cartId,
      product: proId,
      count: count,
      quantity: quandity

    },

    method: 'post',
    success: (response) => {
      if (response.removeProduct) {
       
        alert("product removed cart")

  location.reload()
      } else {
       
        location.reload()
        
        document.getElementById(proId).innerHTML = quandity + count
        // document.getElementById('total').innerHTML = response.total
        
      }

    }
  })
}


function deleteProduct(cartId, proId) {

  $.ajax({
    url: '/delete-product',
    data: {
      cart: cartId,
      product: proId,

    },

    method: 'post',
    success: (response) => {
    
      if (response) {
        alert("delete")
        // swal("Deleted Successflly");

        // $("#myDiv").Load(Location.href + " #mydiv>*","");
        $("#mydiv").load(location.href + " #mydiv");

        location.reload();
      } else {
        $("#mydiv").load(location.href + " #mydiv");

      }

    }

  })


}




 


