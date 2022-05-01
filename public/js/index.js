

const data= false

$.ajax({
    type: 'POST',
    data: data,
    url: '/test',                      
    success: function(data) {
        console.log('success');
        console.log(JSON.stringify(data));                               
    },
    error: function(error) {
        console.log("some error in fetching the notifications");
     }
});




// if ($(window).width() < 960) {
//     alert('Less than 960');
//  }
//  else {
//     alert('More than 960');
//  }