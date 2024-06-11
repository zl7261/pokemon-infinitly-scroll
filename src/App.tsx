import { useState, useCallback, useEffect } from "react";

import "./App.css";
import { useInfiniteObserver } from "react-infinite-observer";
import { getBgByType } from "./utils";

interface PokemonItem {
  id: string;
  name: string;
  types: {
    id: number;
    name: string;
  }[];
  imageUrl: string;
}

interface PokemonListResp {
  count: number;
  next: string;
  previous: string;
  results: { name: string; url: string }[];
}

interface PokemonDetailResp {
  name: string;
  types: {
    slot: number;
    type: { name: string; url: string };
  }[];
  sprites: {
    other: {
      "official-artwork": { front_default: string };
    };
  };
}

function App() {
  const [items, setItems] = useState([] as PokemonItem[]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [maxPage, setMaxPage] = useState(1);

  const onIntersection = useCallback(() => {
    setPage((pageNo) => pageNo + 1);
  }, []);

  const PAGE_SIZE = 20;
  const [setRefElement] = useInfiniteObserver({ onIntersection });

  const fetchData = async () => {
    setIsLoading(true);

    try {
      if (page >= maxPage) return;
      const offset = page * PAGE_SIZE;
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${offset}`
      );
      const data: PokemonListResp = await response.json();
      const maxPageCount = Math.ceil(data.count / PAGE_SIZE);
      if (maxPage !== maxPageCount) {
        setMaxPage(maxPageCount);
      }

      const pageDetailArr = await Promise.all(
        data.results.map(async (item) => {
          const pokemanDetailUrl = item.url;

          const detailFetch = await fetch(pokemanDetailUrl);

          const detailJSON: PokemonDetailResp = await detailFetch.json();
          return { ...detailJSON, $url: item.url };
        })
      );

      // handle pokemon detail data
      const detailArr: PokemonItem[] = pageDetailArr.map((item) => {
        const idUrl = item.$url.substr(0, item.$url.length - 1);
        const id = idUrl.substr(idUrl.lastIndexOf("/") + 1);

        return {
          id: "#" + id.padStart(4, "0"),
          name: item.name,
          types: item.types.map(
            (type: { slot: number; type: { name: string; url: string } }) => {
              const typeUrl = type.type.url.substr(0, type.type.url.length - 1);
              const typeID = typeUrl.substr(typeUrl.lastIndexOf("/") + 1);
              return { name: type.type.name, id: parseInt(typeID, 10) };
            }
          ),

          imageUrl: item.sprites.other["official-artwork"]["front_default"],
        };
      });

      if (page > 0) {
        setItems((prevItems) => [...prevItems, ...detailArr]);
      } else {
        setItems(detailArr);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <div className="pokemon-container">
      {items.map((item, index) => {
        return (
          <div
            className="pokemon-item"
            key={item.name + "-" + index}
            ref={index === items.length - 1 ? setRefElement : undefined}
          >
            <div className="pokemon-item-image">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="pokemon-image"
              />
            </div>
            <div className="pokemon-item-desp">
              <div className="pokemon-item-id">{item.id}</div>
              <div className="pokemon-item-name"> {item.name}</div>
              <div className="pokemon-item-type">
                {item.types.map((type, index) => {
                  return (
                    <div
                      className="type-item"
                      key={index}
                      style={{ background: getBgByType(type.id) }}
                    >
                      {type.name}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
      {isLoading && <p>Loading...</p>}
    </div>
  );
}

export default App;
