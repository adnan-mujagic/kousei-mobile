export default function(user, property) {
    let title = "";
    if(user.length>3){
        title = user[0][property]+", "+user[1][property]+", "+user[2][property]+" and "+ (user.length-3) +" more";
    }
    else{
        for(let i=0; i<user.length; i++){
            title+=user[i][property];
            if(i==user.length-2){
                title+=" and ";
            }else if(i==user.length-1){
                
            }else{
                title+=", "
            }
        }

    }
    
    return title;
}