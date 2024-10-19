"use client";

import { GrNext, GrPrevious } from "react-icons/gr";
import { getCharacter } from "@/api/global";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ImageData {
  id: number;
  url: string;
}

interface VillageData {
  id: number;
  name: string;
}

interface NatureData {
  id: number;
  name: string;
  image: {
    url: string;
  };
}

interface KekkeiData {
  id: number;
  name: string;
  image: {
    url: string;
  };
}

interface JutsuData {
  documentId: string;
  name: string;
  images: ImageData[];
}

interface Character {
  id: number;
  name: string;
  description: string;
  gender: string;
  alias: string;
  status: string;
  occupation: string;
  ninja_rank: string;
  clan: {
    name: string;
    symbol: {
      url: string;
    };
  };
  affiliations: VillageData[];
  nature: NatureData[];
  kekkei_genkai: KekkeiData[];
  jutsus: JutsuData[];
  images: ImageData[];
}

const Character = () => {
  const params = useParams();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [slide, setSlide] = useState(0);
  const maxSlides = character?.images.length || 0;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await getCharacter(params.id);
        setCharacter(res.data);
      } catch (error) {
        console.log("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handlePreviousSlide = () => {
    setSlide((prevSlide) => (prevSlide - 1 + maxSlides) % maxSlides);
  };

  const handleNextSlide = () => {
    setSlide((prevSlide) => (prevSlide + 1) % maxSlides);
  };

  useEffect(() => {
    const interval = setInterval(handleNextSlide, 5000); // Change slides every 5 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [maxSlides]);

  return (
    <div className="">
      <div className="flex flex-col lg:flex-row lg:items-center">
        <header className="flex flex-col gap-2 p-6 w-full">
          <h1 className="text-5xl font-bold text-center">{character?.name}</h1>
          <p className="text-xl italic text-center">{character?.alias}</p>
          <section className="mt-6 flex lg:flex-col justify-around gap-2 lg:gap-6">
            <div className="w-full">
              <h2 className="text-3xl font-bold mb-4">Biography</h2>
              <div className="flex flex-col gap-2">
                <p>
                  <span className="font-bold">Status:</span>{" "}
                  {character?.status ?? "N/A"}
                </p>
                <p>
                  <span className="font-bold">Gender:</span>{" "}
                  {character?.gender ?? "N/A"}
                </p>
                <p>
                  <span className="font-bold">Occupation:</span>{" "}
                  {character?.occupation ?? "N/A"}
                </p>
                <p>
                  <span className="font-bold">Rank:</span>{" "}
                  {character?.ninja_rank ?? "N/A"}
                </p>
                <p>
                  <span className="font-bold">Affiliations:</span>{" "}
                  {character?.affiliations.map((af, i) => (
                    <span key={af.id}>
                      {af.name}
                      {i !== character.affiliations.length - 1 && ", "}
                    </span>
                  ))}
                </p>
                <div className="flex gap-1">
                  <span className="font-bold">Clan:</span>

                  {character?.clan !== null ? (
                    <div className="flex items-center gap-2">
                      <p>{character?.clan.name.split(" ")[0]}</p>
                      <img
                        src={character?.clan.symbol.url}
                        className="h-5 bg-white rounded-full"
                        alt=""
                      />{" "}
                    </div>
                  ) : (
                    "N/A"
                  )}
                </div>
              </div>
            </div>
            {character?.description && (
              <div className="w-full">
                <h2 className="text-3xl font-bold mb-4">Description</h2>
                <p className="leading-relaxed">{character?.description}</p>
              </div>
            )}
          </section>
        </header>
        <div className="overflow-hidden relative w-full">
          <div className="h-[calc(100vh-132px)] flex">
            {character?.images.map((image) => (
              <img
                key={image.id}
                className="object-cover min-w-[100vw] lg:min-w-[100%] transition-all duration-500"
                style={{ transform: `translateX(-${slide * 100}%)` }}
                src={image.url}
                alt=""
              />
            ))}
          </div>
          {character?.images.length !== 1 && (
            <div>
              <button
                onClick={handlePreviousSlide}
                className="absolute top-1/2 left-0 ml-4 bg-gray-700 p-2 rounded-full"
              >
                <GrPrevious />
              </button>
              <button
                onClick={handleNextSlide}
                className="absolute top-1/2 right-0 mr-4 bg-gray-700 p-2 rounded-full"
              >
                <GrNext />
              </button>
            </div>
          )}
        </div>
      </div>
      <section className="bg-slate-950 w-full flex flex-col lg:flex-row lg:gap-6">
        <div className="p-6 flex flex-col gap-8 w-full lg:w-1/3">
          <h2 className="pb-3 text-3xl font-bold text-center border-b-2 border-[#313131]">
            Abilities
          </h2>
          <div className="flex gap-3 justify-around">
            <div className="flex flex-col gap-2">
              <p className="font-semibold">Nature Affinities:</p>
              {character?.nature[0] ? (
                <div className="flex flex-col gap-1">
                  {character?.nature.map((n) => (
                    <div key={n.id} className="flex items-center gap-2">
                      <p>{n.name}</p>
                      <img src={n.image.url} className="h-5" alt={n.name} />
                    </div>
                  ))}
                </div>
              ) : (
                "N/A"
              )}
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold">Kekkei Genkai:</p>
              {character?.kekkei_genkai[0] ? (
                <div className="flex flex-col gap-1">
                  {character?.kekkei_genkai.map((n) => (
                    <div key={n.id} className="flex items-center gap-2">
                      <p>{n.name}</p>
                      <img src={n.image.url} className="h-5" alt={n.name} />
                    </div>
                  ))}
                </div>
              ) : (
                "N/A"
              )}
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-8 p-6">
          <h2 className="pb-3 text-3xl font-bold text-center border-b-2 border-[#313131]">
            Jutsus
          </h2>
          <div className="pb-3 w-full grid grid-cols-1 md:grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-3">
            {character?.jutsus.map((jutsu) => (
              <Link
                href={`/jutsus/${jutsu.documentId}`}
                key={jutsu.documentId}
                className="relative group"
              >
                <img
                  src={jutsu.images[0].url}
                  alt={jutsu.name}
                  className="w-full h-40 md:h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-100 group-hover:opacity-0 transition-all flex items-center justify-center">
                  <p className="text-white text-lg text-center">{jutsu.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Character;
