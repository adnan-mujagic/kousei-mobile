export default function shouldRenderOnline(updated, mins){
    if(updated){
        let date = new Date(updated);
        let timeDifference = Date.now() - date.getTime();
        if(timeDifference<=1000*60*mins){
            return true;
        }
        return false;
    }
    return false
}