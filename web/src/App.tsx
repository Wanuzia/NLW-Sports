import './styles/main.css'
import logoImage from './assets/logo.svg'
import { GameBanner } from './components/GameBanner'
import { CreateAdBanner } from './components/CreateBanner'
import { useState, useEffect } from 'react'
import { Games } from './models/interfaces'
import * as Dialog from '@radix-ui/react-dialog'
import { CreateAdModal } from './components/CreateAdModal'
import axios from 'axios'


function App() {
  const [games, setGames] = useState<Games[]>([])

useEffect(() => {
  axios("http://localhost:3002/games")
  .then(response => {
    setGames(response.data)
  })
}, [])

  return ( 
     <div className="max-w-[1344px] mx-auto flex flex-col items-center my-20">
      <img src={logoImage} alt="logo"/>

      <h1 className="text-6xl text-white font-black mt-20 ">
        Seu <span className="text-transparent bg-nlw-gradient bg-clip-text">duo</span> está aqui.
        </h1>

        <div className="grid grid-cols-6 gap-6 mt-16">
          {games.map(game => {
            return(
               <GameBanner 
               key={game.id}
               bannerUrl={game.bannerUrl}
               title={game.title}
               adsCount={game._count.ads} 
              />
            )
          })}
     </div>
     < Dialog.Root>
          <CreateAdBanner />
          <CreateAdModal />
 
     </Dialog.Root>
     </div>
  
  )
}

export default App
