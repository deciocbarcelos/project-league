import { useEffect, useState } from "react";

type Champion = {
  id: string;
  name: string;
  title: string;
  image: { full: string };
  stats: {
    attackdamage: number;
    armor: number;
    spellblock: number;
  };
};

export default function App() {
  const [champions, setChampions] = useState<Champion[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    fetch(
      "https://ddragon.leagueoflegends.com/cdn/14.17.1/data/en_US/champion.json"
    )
      .then((res) => res.json())
      .then((data) => {
        const champs = Object.values(data.data) as Champion[];
        setChampions(champs);
      });
  }, []);

  const filtered = champions
    .filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "attack":
          return b.stats.attackdamage - a.stats.attackdamage;
        case "armor":
          return b.stats.armor - a.stats.armor;
        case "magicresist":
          return b.stats.spellblock - a.stats.spellblock;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  // Pega a splash do primeiro campeão filtrado ou Camille se vazio
  const bgChampion = filtered.length > 0 ? filtered[0].id : "Camille";

  return (
  <div
  className="min-h-screen bg-contain bg-top bg-no-repeat bg-black"
  style={{
    backgroundImage: `url("https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${bgChampion}_0.jpg")`,
  }}
>



      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-white drop-shadow-lg">
          Busca de Campeões do LoL
        </h1>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Digite o nome do campeão..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-full md:w-1/2"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border p-2 rounded md:w-1/3"
          >
            <option value="name">Ordenar por Nome</option>
            <option value="attack">Dano de Ataque</option>
            <option value="armor">Armadura</option>
            <option value="magicresist">Resistência Mágica</option>
          </select>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filtered.map((champ) => (
            <div
              key={champ.id}
              className="bg-white/80 backdrop-blur-md border p-4 rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/14.17.1/img/champion/${champ.image.full}`}
                alt={champ.name}
                className="w-24 h-24 mx-auto rounded-full border-2 border-gray-300"
              />
              <h2 className="font-bold text-center mt-2">{champ.name}</h2>
              <p className="text-sm text-center text-gray-700">{champ.title}</p>

              <div className="mt-2 text-xs text-gray-800">
                <p>AD: {champ.stats.attackdamage}</p>
                <p>Armadura: {champ.stats.armor}</p>
                <p>MR: {champ.stats.spellblock}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}