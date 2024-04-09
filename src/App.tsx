import axios from "axios";
import React, { useEffect, useState } from "react";
import './App.css';
import PokemonColection from "./components/PokemonColection";
import { Detail, Pokemon, Pokemons } from "./interface";

const App:React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [nextUrl, setNextUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [viewDetail, setDetail] = useState<Detail>({
    id: 0,
    isOpened: false
  })

  useEffect(() => {
    const getPokemon = async () => {
      const res = await axios.get(
        "https://pokeapi.co/api/v2/pokemon?limit=20&offset=20"
      );
      setNextUrl(res.data.next);

      const promises = res.data.results.map(async (pokemon: Pokemons) => {
        const poke = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
        );
        return poke.data;
      });

      const pokemonData = await Promise.all(promises);
      setPokemons(pokemonData);
      setLoading(false);
    };
    getPokemon();
  }, []);

  const nextPage = async () => {
    setLoading(true);
    const res = await axios.get(nextUrl);
    setNextUrl(res.data.next);

    const promises = res.data.results.map(async (pokemon: Pokemons) => {
      const poke = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
      );
      return poke.data;
    });

    const pokemonData = await Promise.all(promises);
    setPokemons(prevPokemons => [...prevPokemons, ...pokemonData]);
    setLoading(false);
  }

  return (
    <div className="App">
      <div className="container">
        <header className='pokemon-header'>Pokemon</header>
        <PokemonColection
          pokemons={pokemons}
          viewDetail={viewDetail}
          setDetail={setDetail}
        />
        {!viewDetail.isOpened && (
          <div className="btn">
            <button onClick={nextPage}>
              {loading ? 'Loading' : 'Load more'}{' '}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
