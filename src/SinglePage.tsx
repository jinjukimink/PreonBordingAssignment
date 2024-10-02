import { useCallback, useEffect, useState } from "react";
import { MockData, getMockData } from "./data";
import { Spinner } from "basic-loading";
import useIntersectionObserver from "./hook/useIntersectionObserver";


const SinglePage = () => {
    const [datas,setDatas]=useState<MockData[]>([]);
    const [isEnd,setIsEnd]=useState(false);//페이지의 끝에 도달했는지 안했는지
    const [isLoading,setIsLoading]=useState(false);
    const [page,setPage]=useState(1);
    const sumOfPrice=(datas:MockData[])=>{
        return datas.reduce((totalSum, data) => totalSum + data.price, 0);
    }

    useEffect(()=>{
        const fetchData = async() => {
            if(isLoading|| isEnd )return;
            setIsLoading(true);
            const {datas:newDatas, isEnd:newIsEnd} = await getMockData(page);
            setDatas(prev=>[...prev,...newDatas]);//데이터는 계속 축적됨.
            setIsEnd(newIsEnd);
            setIsLoading(false);
        }
        fetchData();
    },[page])//당연히 페이지가 바뀔때 마다 페치를 해야함.

    const callback = useCallback(
            (entries: IntersectionObserverEntry[],observer:IntersectionObserver)=>{
        if(entries[0].isIntersecting &&!isLoading&& !isEnd){
            setPage((prev) => prev + 1);
            console.log(page)
            observer.unobserve(entries[0].target)//대상 관찰 중지
        }
    },[isEnd,isLoading]);

    const { setTarget } = useIntersectionObserver({
      callback,
      isEnd,
      isLoading
    });
    const option = {
           size: 50,
    };
  return (
    <>
      <h1>SinglePage Component</h1>
      {datas.map((data, index) => (
        <>
          <h2 key={index}>
            {index + 1}: {data.productName}
          </h2>
          <span> price: {data.price}</span>
        </>
      ))}
      <p>total Price: {sumOfPrice(datas)}</p>
      {isLoading && <Spinner option={option}/>}
      {isEnd && <p>모든 데이터를 불러왔습니다.</p>}
      <div
        ref={setTarget}
        style={{ height: "100px", background: "transparent" }}
      ></div>
    </>
  );
}
export default SinglePage