const l=[147896325,7426985321,789654123,753215986,412365789]
const start=document.getElementById('start');
const check=document.getElementById('check');

start.addEventListener("click",fun);

function fun(){
    document.getElementById('typed-value').disabled=false;
    const ind = Math.floor(Math.random() * l.length);
    const ans=l[ind];
    switch(ind){
        case 0:
            document.getElementById('m').src="./m1.png";
            break;
        case 1:
            document.getElementById('m').src="./m2.png";
            break;
        case 2:
            document.getElementById('m').src="./m3.png";
            break;
        case 3:  
            document.getElementById('m').src="./m4.png";
            break;
        case 4:
            document.getElementById('m').src="./m5.png";
            break;

        }       
        check.addEventListener("click",funs);
        function funs(){
        if(ans==document.getElementById('typed-value').value){
            alert('congrats')
            document.getElementById('typed-value').disabled=true;
        }
        else{
            console.log(5);
            alert('wrong');
        }
    }
    }
