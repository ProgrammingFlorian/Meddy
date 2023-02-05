import type { NextPage } from 'next'
import { DndList } from '../components/DnDList'




const waitingPage: NextPage = () => {
    const greeting = "Herzlichen Willkommen in der TUM Praxis, Florian!";
    const circleText = "15";
    const customerMessage = "Vor Ihnen befinden sich noch vier Kunden";
    const appBlue = "#0099ff"

    return (

        <div className="min-h-screen flex flex-col items-center justify-center py-2">
<div className='p-10 bg-gray-100 justify-center'>
        <div className="text-center" style={{width: "400px"}}>
             <br />
            <h1 className="" >{greeting}</h1>
            <br />
            <br />
            <div className='blue-color text-center' style={{
                width: "150px",
                height: "150px",
                border: "15px solid",
                borderRadius: "75px",
                margin: "0 auto"
            }}>
                <h1 className="pt-5 pb-0 text-black font-bold">{circleText}</h1>
                <h4 className="text-black font-bold pt-0">min</h4>
            </div>
            <h2 className='pt-5 font-bold'>Ihre geschätze Wartezeit</h2>
            <br />
            <br />
            <br />
            <div className=' flex justify-items-center justify-center' style={{
            }}>

                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" className="w-6 h-6 align-self-center blue-color stroke-blue fill-blue">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" className="w-6 h-6 align-self-center blue-color stroke-blue fill-blue">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" className="w-6 h-6 align-self-center blue-color stroke-blue fill-blue">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" className="w-6 h-6 align-self-center blue-color stroke-blue fill-blue">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
            </div>


            <p className=' font-bold'>{customerMessage}</p>
        </div>
        <br/>
        <div className="w-full flex justify-center">
                            
                            <button className="bg-blue hover:bg-blue-500 text-white justify-self-center border border-transparent text-xs py-2 px-4 rounded" style={{width:"200px"}}>
                                Ich möchte benachrichtigt werden, wenn ich dran bin!
                            </button>


                        </div>
        </div>
        </div>
       
    );
};








export default waitingPage