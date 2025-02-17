'use client'
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "https://websocket-server-bdk7.onrender.com"; // Update with your actual WebSocket server URL

let socket;

export default function Home() {
  const [turn, setturn] = useState('X');
  const [countX,setcountX] = useState(0);
  const [countO,setcountO] = useState(0);
  const [currX,setcurrX]=useState([]);
  const [currO,setcurrO]=useState([]);
  const [gameclear,setgameclear]=useState(0);

  useEffect(() => {
    socket=io(SOCKET_SERVER_URL);

    socket.on("move",(data)=>{
      setturn(data.turn);
      gameify(data.id,data.turn);
    });
    
    return ()=>{
      socket.disconnect();
    };
  },[]);
  
  
  const check=(id,val)=>{
    const arr=[];
    let n,k;
    for(k=0;k<9;k++)  arr[k]='';
    if(currO.length==3 || currX.length==3)  n=1;
    else  n=0;
    for(k=n;k<currX.length;k++) arr[currX[k]-1]='X';
    for(k=n;k<currO.length;k++) arr[currO[k]-1]='O';
    arr[id-1]=val;
    let ck,rk,i;
    // console.log(id,val,arr);
    // console.log("currx: ",currX);
    // console.log("curro: ",currO);
    for(let j=1;j<=3;j++){
      //Horizontal check
      ck=arr[(j-1)*3];
      for(i=(j-1)*3;i<(3*j);i++){
        if(arr[i]=='' || arr[i]!=ck)  break;
      }
      if(i==(j*3)){
        console.log("horizontal")
        return true;
      }
      //Vertical check
      rk=arr[j-1];
      for(i=j-1;i<(6+j);i+=3){
        if(arr[i]=='' || arr[i]!=rk)  break;
      }
      if(i>=6+j){
        console.log("vertical");
        return true;
      }
    }
    //Cross check
    if((arr[4]!='') && ((arr[0]==arr[4] && arr[4]==arr[8]) || (arr[6]==arr[4] && arr[4]==arr[2]))){
      console.log("cross");
      return true;
    }
    return false;
  }
  const gameify=(id,val)=>{
    let tm=[];
    if(val=='X'){
      for(let i=0;i<(currX.length);i++)  tm[i]=currX[i];
      if((currX.length)<3){
        tm.push(id);
      }else{
        document.getElementById(tm[0]).innerHTML='';
        tm[0]=tm[1];
        tm[1]=tm[2];
        tm[2]=id;
      }
      setcurrX(tm);
    }else{
      for(let i=0;i<(currO.length);i++)  tm[i]=currO[i];
      if((currO.length)<3){
        tm.push(id);
      }else{
        document.getElementById(tm[0]).innerHTML='';
        tm[0]=tm[1];
        tm[1]=tm[2];
        tm[2]=id;
      }
      setcurrO(tm);
    }
  }
  const handleClick=(e)=>{
    if(e.target.innerHTML=='' && !gameclear){
      e.target.innerHTML=turn;
      gameify(e.target.id,turn)
      if(check(e.target.id,turn)){
        alert(`Player ${turn} has won the match`);
        setgameclear(1);
      };
      //Event launcher: 
      socket.emit("move",{id:e.target.id,turn});
      if(turn=='X'){
        setcountX(countX+1);
        setturn('O');
      }else{
        setcountO(countO+1);
        setturn('X');
      }
      console.log("yeh curr value aani chaiye: ",turn);
    } 
  }
  return (
   <>
   <div className="main flex flex-col gap-3  w-[100%] my-4 md:my-2 md:w-[30%] mx-auto items-center">
      <div className="gameTitle font-semibold md:text-5xl text-3xl  py-8">Tic Tac Toe</div>
      <div className="font-semibold md:text-3xl text-2xl text-center">
        {gameclear?<p>Reload the Website to start a New Game</p>:<p>{turn} Turn</p>}
        </div>
      <div className="gameContainer  h-full items-center flex flex-col gap-3 w-[100%]">
        <div className="r1 flex gap-4">
        <div onClick={handleClick} id="1" className="text-center py-2 font-extrabold md:text-5xl text-3xl  md:h-16 md:w-20 w-16 h-14 bg-white cursor-pointer text-black"></div>
        <div onClick={handleClick} id="2" className="text-center py-2 font-extrabold md:text-5xl text-3xl  md:h-16 md:w-20 w-16 h-14 bg-white cursor-pointer text-black"></div>
        <div onClick={handleClick} id="3" className="text-center py-2 font-extrabold md:text-5xl text-3xl  md:h-16 md:w-20 w-16 h-14 bg-white cursor-pointer text-black"></div>
        </div>
        <div className="r1 flex gap-4">
        <div onClick={handleClick} id="4" className="text-center py-2 md:text-5xl font-extrabold text-3xl md:h-16 md:w-20 w-16 h-14 bg-white cursor-pointer text-black"></div>
        <div onClick={handleClick} id="5" className="text-center py-2 md:text-5xl font-extrabold text-3xl md:h-16 md:w-20 w-16 h-14 bg-white cursor-pointer text-black"></div>
        <div onClick={handleClick} id="6" className="text-center py-2 md:text-5xl font-extrabold text-3xl md:h-16 md:w-20 w-16 h-14 bg-white cursor-pointer text-black"></div>
        </div>
        <div className="r1 flex gap-4">
        <div onClick={handleClick} id="7" className="text-center py-2 md:text-5xl font-extrabold text-3xl md:h-16 md:w-20 w-16 h-14 bg-white cursor-pointer text-black"></div>
        <div onClick={handleClick} id="8" className="text-center py-2 md:text-5xl font-extrabold text-3xl md:h-16 md:w-20 w-16 h-14 bg-white cursor-pointer text-black"></div>
        <div onClick={handleClick} id="9" className="text-center py-2 md:text-5xl font-extrabold text-3xl md:h-16 md:w-20 w-16 h-14 bg-white cursor-pointer text-black"></div>
        </div>
      </div>
   </div>
   </>
  );
}



    

    //if(a in ['1','2','3']){
    //   console.log('a check')
    //   if(b in ['1','2','3']){
    //     console.log('b check')
    //     if(c in ['1','2','3']){
    //       console.log('c check')
    //       return true;
    //     }
    //   }
    // }
    // if(a in ['1','4','7']){
    //   console.log('here');
    //   if(b in ['1','4','7']){
    //     console.log('here b');
    //     if(c in ['1','4','7'])  return true;
    //   }
    // }
    // if(a in ['2','5','8']){
    //   if(b in ['2','5','8']){
    //     if(c in ['2','5','8'])  return true;
    //   }
    // }
    // if(a in ['3','6','4']){
    //   if(b in ['3','6','4']){
    //     if(c in ['3','6','4'])  return true;
    //   }
    // }
    // if(a in ['4','5','6']){
    //   if(b in ['4','5','6']){
    //     if(c in ['4','5','6'])  return true;
    //   }
    // }
    // if(a in ['7','8','9']){
    //   if(b in ['7','8','9']){
    //     if(c in ['7','8','9'])  return true;
    //   }
    // }
    // if(a in ['1','5','9']){
    //   if(b in ['1','5','9']){
    //     if(c in ['1','5','9'])  return true;
    //   }
    // }
    // if(a in ['7','5','3']){
    //   if(b in ['7','5','3']){
    //     if(c in ['7','5','3'])  return true;
    //   }
    // }
    // return false;