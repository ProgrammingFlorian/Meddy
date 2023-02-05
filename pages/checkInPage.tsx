import type { NextPage } from 'next'
import { DndList } from '../components/DnDList'

const Overview: NextPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center py-2">


            <div className="relative inline-block text-left ">
                <html>
                    <head>

                        <script src="https://unpkg.com/tailwindcss-jit-cdn"></script>
                    </head>
                    <body>
                        <div className=" p-10 bg-gray-100 justify-center">
                        <label htmlFor="select" className=" text-center font-semibold text text-2xl text-blue-500 block py-2">Neuer Kunde</label>
                        <br />
                            <div className='items-start'>
                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="select" className="font-semibold block py-2">Patientenname:</label>
                                    <input className="h-10 text-2l font-bold w-full pl-3 bg-gray-400 flex rounded items-center" placeholder="Max Mustermann"></input>                </div>
                                <br />
                                <br />
                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="select" className="font-semibold block py-2">Geschätzte Termindauer in Minuten:</label>
                                    <input className="h-10 text-2l font-bold w-full pl-3 bg-gray-400 flex rounded items-center" placeholder="15"></input>                  </div>
                                <br />
                                <br />
                            </div>
                            <div>
                                <label htmlFor="select" className="font-semibold block py-2">Behandelnder Arzt:</label>
                                <div className="relative w-full  inline-flex self-center">
                                    <select className="text-2l font-bold rounded border border-transparent text-gray-500 h-10 w-full pl-3 pr-10 bg-gray-400  appearance-none">
                                        <option>Arzt 1</option>
                                        <option>Arzt 2</option>
                                        <option>Arzt 3</option>
                                    </select>
                                </div>
                            </div>
                            <br />
                            <br />
                            <br />
                            <div className="w-full flex-col-1 justify-items-center">
                            <button className="bg-transparent hover:bg-blue-700 text-white border border-transparent font-bold py-2 px-4 rounded">
                            //ToDo
                                </button>
                                <button className="bg-blue-500 hover:bg-blue-700 text-white border border-transparent font-bold py-2 px-4 rounded">
                                    QR-Code Generieren
                                </button>
                              
                               
</div>

                          
                        </div>
                    </body>
                </html>
            </div>
        </div>
    )
}

export default Overview
