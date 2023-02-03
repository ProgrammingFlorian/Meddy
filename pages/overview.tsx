import type { NextPage } from 'next'
import { DndList } from '../components/DnDList'

const Overview: NextPage = () => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-2">
            <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
                <DndList data={[{
                    id: 1,
                    name: "Hufenstein",
                    duration: 5
                },
                {
                    id: 2,
                    name: "Albert",
                    duration: 50
                },
                {
                    id: 3,
                    name: "Simon",
                    duration: 3
                }]}></DndList>
            </main>
        </div>
    )
}

export default Overview
