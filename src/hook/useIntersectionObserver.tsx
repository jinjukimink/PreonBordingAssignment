import { useEffect, useState } from "react";

const useIntersectionObserver = ({callback,isEnd,isLoading}:
    {callback:(entries:IntersectionObserverEntry[],observer:IntersectionObserver)=>void,
    isEnd:boolean,
    isLoading:boolean}
    ) => {
    const [target,setTarget]=useState<HTMLDivElement | null>(null);


    useEffect(()=>{
        if(!target){
            return;
        }
        const observer = new IntersectionObserver(callback, { threshold: 0.5 });
        observer.observe(target);
        return ()=>observer.unobserve(target);
    },[target,isEnd,isLoading])

  return {setTarget}

  ;
}
export default useIntersectionObserver