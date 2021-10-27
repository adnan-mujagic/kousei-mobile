import grayColor from "../general_styles/grayColor";

export default function positionReliability(date){
    const dateObject = new Date(date);
    const timeDifference = Date.now() - dateObject.getTime();
    //IF updated 5 mins ago show green
    if(timeDifference<=1000*60*10){
        return "rgb(51, 255, 0)"
    }
    else if(timeDifference<=1000*60*60){
        return "rgb(255, 252, 51)"
    }
    else return "rgb(252, 3, 78)"
}