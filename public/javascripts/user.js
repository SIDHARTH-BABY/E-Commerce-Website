$(document).ready(function(){
    $("#signup-form").validate({
        rules:{
            Name:{
                required:true,
                minlength:2
            },
            Email:{
                required:true,
                email:true
            },
            Password:{
                required:true,
                minlength:4
            },
            Password2:{
                required:true,
                minlength:4
            },
            phone:{
                required:true,              
                minlength:10,
                 maxlength:10,
            },

        },
        messages:{
            Name:{
                required:"Enter Your Name",
                minlength:"Enter atleast 4 characters"
            },
            Email:{
                required:"Enter Your Email",
                Email:"Enter valid email address"
            },
            Password:{
                required:"Enter Your Password",
                minlength:"Enter atleast 4 characters"
            },
            Password2:{
                required:"Enter Your Password",
                minlength:"Enter atleast 4 characters"
            },
        }
        
    }),
   

    $("#login-form").validate({
        rules:{
            Email:{
                required:true,
                email:true
            },
            Password:{
                required:true,
                
            }

        },
        messages:{
            
            Email:{
                required:"Enter Your Email",
                Email:"Enter valid email address"
            },
            Password:{
                required:"Enter Your Password",
                minlength:"Enter atleast 4 characters"
            },
        }
    }),
    $("#otp-form").validate({
        rules:{
            otp:{
                required:true,
                minlength:4
            }
        }

    })
    

})