import type { NextPage } from 'next'
import { DndList } from '../components/DnDList'

const Overview: NextPage = () => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-2">


            <div className="relative inline-block text-left">
                <html>
                    <head>

                        <script src="https://unpkg.com/tailwindcss-jit-cdn"></script>
                    </head>
                    <body>
                        <div className="min-h-screen p-10 bg-gray-100 justify-center">
                            <div className='items-start'>
                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="select" className="font-semibold block py-2">Patientenname:</label>
                                    <input className="h-10 w-full bg-white flex rounded items-center placeholder-grey-300 border border-blue-400" placeholder=" Max Mustermann"></input>                </div>
                                    <br/>
                                    <br/>
                                <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="select" className="font-semibold block py-2">Geschätzte Termindauer in Minuten:</label>
                                <input className="h-10 w-full bg-white flex rounded items-center placeholder-grey-300 border border-blue-400 border-4" placeholder=" 15"></input>                  </div>
                                    <br/>
                                    <br/>
                            </div>
                            <div className="max-w-md mx-auto">
                                <label htmlFor="select" className="font-semibold block py-2">Select Input:</label>

                                <div className="relative">
                                    <div className="h-10 bg-white flex border border-gray-200 rounded items-center">
                                        <input value="Javascript" name="select" id="select" className="px-4 appearance-none outline-none text-gray-800 w-full" checked />

                                        <button className="cursor-pointer outline-none focus:outline-none transition-all text-gray-300 hover:text-gray-600">
                                            <svg className="w-4 h-4 mx-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        </button>
                                        <label htmlFor="show_more" className="cursor-pointer outline-none focus:outline-none border-l border-gray-200 transition-all text-gray-300 hover:text-gray-600">
                                            <svg className="w-4 h-4 mx-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <polyline points="18 15 12 9 6 15"></polyline>
                                            </svg>
                                        </label>
                                    </div>

                                    <input type="checkbox" name="show_more" id="show_more" className="hidden peer" checked />
                                    <div className="absolute rounded shadow bg-white overflow-hidden hidden peer-checked:flex flex-col w-full mt-1 border border-gray-200">
                                        <div className="cursor-pointer group">
                                            <a className="block p-2 border-transparent border-l-4 group-hover:border-blue-600 group-hover:bg-gray-100">Python</a>
                                        </div>
                                        <div className="cursor-pointer group border-t">
                                            <a className="block p-2 border-transparent border-l-4 group-hover:border-blue-600 border-blue-600 group-hover:bg-gray-100">Javascript</a>
                                        </div>
                                        <div className="cursor-pointer group border-t">
                                            <a className="block p-2 border-transparent border-l-4 group-hover:border-blue-600 group-hover:bg-gray-100">Node</a>
                                        </div>
                                        <div className="cursor-pointer group border-t">
                                            <a className="block p-2 border-transparent border-l-4 group-hover:border-blue-600 group-hover:bg-gray-100">PHP</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </body>
                </html>
            </div>
        </div>
    )
}

export default Overview
