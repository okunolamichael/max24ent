import React, {useState} from 'react'
import Search from './components/Search'

const App = () => {

  const [searchTerm, setSearchTerm] = useState('')
  return (
    <main>
      <div className='pattern'/>

      <div className='wrapper'>
        <header>
          <h1>
            <img src="./MAXENT24_white.png" alt="" className='w-64'/>
            <img src="hero-img.png" alt="" />
            Find <span className='text-gradient'>Movie</span>
            You'll Enjoy Without the Hassle
          </h1>
        </header>

        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      </div>
    </main>
  )
}

export default App
