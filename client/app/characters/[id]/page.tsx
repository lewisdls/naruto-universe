"use client";

import { GrNext, GrPrevious } from "react-icons/gr";
import { getCharacter } from "@/api/global";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ImageData {
  id: number;
  attributes: {
    url: string;
  };
}

interface VillageData {
  id: number;
  attributes: {
    name: string;
  };
}

interface NatureData {
  id: number;
  attributes: {
    name: string;
    image: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
  };
}

interface KekkeiData {
  id: number;
  attributes: {
    name: string;
    image: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
  };
}

interface JutsuData {
  id: number;
  attributes: {
    name: string;
    images: {
      data: ImageData[];
    };
  };
}

interface Character {
  id: number;
  attributes: {
    name: string;
    description: string;
    gender: string;
    alias: string;
    status: string;
    occupation: string;
    ninja_rank: string;
    clan: {
      data: {
        attributes: {
          name: string;
          symbol: {
            data: {
              attributes: {
                url: string;
              };
            };
          };
        };
      };
    };
    affiliations: {
      data: VillageData[];
    };
    nature: {
      data: NatureData[];
    };
    kekkei_genkai: {
      data: KekkeiData[];
    };
    jutsus: {
      data: JutsuData[];
    };
    images: {
      data: ImageData[];
    };
  };
}

const Character = () => {
  const params = useParams();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [slide, setSlide] = useState(0);
  const maxSlides = character?.attributes.images.data.length || 0;

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
          <h1 className="text-5xl font-bold text-center">
            {character?.attributes.name}
          </h1>
          <p className="text-xl italic text-center">
            {character?.attributes.alias}
          </p>
          <section className="mt-6 flex lg:flex-col justify-around gap-2 lg:gap-6">
            <div className="w-full">
              <h2 className="text-3xl font-bold mb-4">Biography</h2>
              <div className="flex flex-col gap-2">
                <p>
                  <span className="font-bold">Status:</span>{" "}
                  {character?.attributes.status ?? "N/A"}
                </p>
                <p>
                  <span className="font-bold">Gender:</span>{" "}
                  {character?.attributes.gender ?? "N/A"}
                </p>
                <p>
                  <span className="font-bold">Occupation:</span>{" "}
                  {character?.attributes.occupation ?? "N/A"}
                </p>
                <p>
                  <span className="font-bold">Rank:</span>{" "}
                  {character?.attributes.ninja_rank ?? "N/A"}
                </p>
                <p>
                  <span className="font-bold">Affiliations:</span>{" "}
                  {character?.attributes.affiliations.data.map((af, i) => (
                    <span key={af.id}>
                      {af.attributes.name}
                      {i !==
                        character.attributes.affiliations.data.length - 1 &&
                        ", "}
                    </span>
                  ))}
                </p>
                <div className="flex gap-1">
                  <span className="font-bold">Clan:</span>

                  {character?.attributes.clan.data !== null ? (
                    <div className="flex items-center gap-2">
                      <p>
                        {
                          character?.attributes.clan.data?.attributes.name.split(
                            " "
                          )[0]
                        }
                      </p>
                      <img
                        src={`http://localhost:1337${character?.attributes.clan.data?.attributes.symbol.data.attributes.url}`}
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
            {character?.attributes.description && (
              <div className="w-full">
                <h2 className="text-3xl font-bold mb-4">Description</h2>
                <p className="leading-relaxed">
                  {character?.attributes.description}
                </p>
              </div>
            )}
          </section>
        </header>
        <div className="overflow-hidden relative w-full">
          <div className="h-[calc(100vh-132px)] flex">
            {character?.attributes.images.data.map((image) => (
              <img
                key={image.id}
                className="object-cover min-w-[100vw] lg:min-w-[100%] transition-all duration-500"
                style={{ transform: `translateX(-${slide * 100}%)` }}
                src={"http://localhost:1337" + image.attributes.url}
                alt=""
              />
            ))}
          </div>
          {character?.attributes.images.data.length !== 1 && (
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
              {character?.attributes.nature.data[0] ? (
                <div className="flex flex-col gap-1">
                  {character?.attributes.nature.data.map((n) => (
                    <div key={n.id} className="flex items-center gap-2">
                      <p>{n.attributes.name}</p>
                      <img
                        src={`http://localhost:1337${n.attributes.image.data.attributes.url}`}
                        className="h-5"
                        alt={n.attributes.name}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                "N/A"
              )}
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold">Kekkei Genkai:</p>
              {character?.attributes.kekkei_genkai.data[0] ? (
                <div className="flex flex-col gap-1">
                  {character?.attributes.kekkei_genkai.data.map((n) => (
                    <div key={n.id} className="flex items-center gap-2">
                      <p>{n.attributes.name}</p>
                      <img
                        src={`http://localhost:1337${n.attributes.image.data.attributes.url}`}
                        className="h-5"
                        alt={n.attributes.name}
                      />
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
            {character?.attributes.jutsus.data.map((jutsu) => (
              <Link
                href={`/jutsus/${jutsu.id}`}
                key={jutsu.id}
                className="relative group"
              >
                <img
                  src={`http://localhost:1337${jutsu.attributes.images.data[0].attributes.url}`}
                  alt={jutsu.attributes.name}
                  className="w-full h-40 md:h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-100 group-hover:opacity-0 transition-all flex items-center justify-center">
                  <p className="text-white text-lg text-center">
                    {jutsu.attributes.name}
                  </p>
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
