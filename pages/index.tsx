import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-6xl font-bold">
          Willkommen bei{' '}
          <span className="text-blue-600">
            Meddy!
          </span>
        </h1>

        <p className="mt-3 text-2xl">
          Get started by editing{' '}
          <code className="rounded-md bg-gray-100 p-3 font-mono text-lg">
            pages/index.tsx
          </code>
        </p>

        <div className="mt-6 flex max-w-4xl flex-wrap items-center justify-around sm:w-full">
          <a
            href="overview"
            className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Verwaltung &rarr;</h3>
            <p className="mt-4 text-xl">
              Verwalte die aktuelle Warteschlange und checke neue Kunden ein.
            </p>
          </a>
          <a
            href="checkInPage"
            className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">CheckIn &rarr;</h3>
            <p className="mt-4 text-xl">
              Checke neue Kunden ein
            </p>
          </a>
          <a
            href="qrCodePage"
            className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">QR Code Page &rarr;</h3>
            <p className="mt-4 text-xl">
              Hier wird der QR Code angezeigt
            </p>
          </a>
          <a
            href="waitingPage"
            className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Waiting Page &rarr;</h3>
            <p className="mt-4 text-xl">
              Hier wird der Timer angezeig
            </p>
          </a>

          <a
            href="https://nextjs.org/learn"
            className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Kunde &rarr;</h3>
            <p className="mt-4 text-xl">
              Entdecke das <br /> Kundeninterface.
            </p>
          </a>
        </div>
      </main>
    </div>
  );
}

export default Home;
