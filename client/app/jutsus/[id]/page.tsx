"use client";

import { GrNext, GrPrevious } from "react-icons/gr";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getJutsu } from "@/api/global";
import Link from "next/link";

interface ImgData {
  id: number;
  caption: string;
  url: string;
}

interface ClassificationData {
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

interface ParentData {
  documentId: string;
  name: string;
  images: ImgData[];
}

interface DerivedData {
  documentId: string;
  name: string;
  images: ImgData[];
}

interface UserData {
  documentId: string;
  name: string;
  images: ImgData[];
}

interface Jutsu {
  id: number;
  name: string;
  rank: string;
  class: string;
  range: string;
  classification: ClassificationData[];
  description: string;
  nature: NatureData[];
  kekkei_genkai: KekkeiData[];
  parent_jutsu: ParentData[];
  derived_jutsu: DerivedData[];
  users: UserData[];
  images: ImgData[];
}

const Jutsu = () => {
  const params = useParams();
  const [jutsu, setJutsu] = useState<Jutsu | null>(null);
  const [loading, setLoading] = useState(true);
  const [slide, setSlide] = useState(0);
  const maxSlides = jutsu?.images?.length || 0;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await getJutsu(params.id);
        setJutsu(res.data);
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
    const interval = setInterval(handleNextSlide, 5000);

    return () => clearInterval(interval);
  }, [maxSlides]);

  const renderedItems = [];

  jutsu?.classification &&
    jutsu?.classification.length > 0 &&
    renderedItems.push(
      <div className="flex flex-col items-center md:block">
        <h2 className="text-2xl font-medium mb-2">Classification</h2>
        {jutsu?.classification.map((c) => (
          <p key={c.id} className="leading-relaxed">
            {c.name}
          </p>
        ))}
      </div>
    );

  jutsu?.nature &&
    jutsu?.nature.length > 0 &&
    renderedItems.push(
      <div className="flex flex-col items-center md:block">
        <h2 className="text-2xl font-medium mb-2">Nature</h2>
        {jutsu?.nature.map((n) => (
          <div key={n.id} className="flex items-center gap-2 leading-relaxed">
            <p>{n.name}</p>
            <img
              src={`http://localhost:1337${n.image.url}`}
              className="h-5"
              alt=""
            />
          </div>
        ))}
      </div>
    );

  jutsu?.class &&
    renderedItems.push(
      <div className="flex flex-col items-center md:block">
        <h2 className="text-2xl font-medium mb-2">Class</h2>
        <p>{jutsu?.class}</p>
      </div>
    );

  jutsu?.rank &&
    renderedItems.push(
      <div className="flex flex-col items-center md:block">
        <h2 className="text-2xl font-medium mb-2">Rank</h2>
        <p>{jutsu?.rank}</p>
      </div>
    );

  jutsu?.range &&
    renderedItems.push(
      <div className="flex flex-col items-center md:block">
        <h2 className="text-2xl font-medium mb-2">Range</h2>
        <p>{jutsu?.range ?? "N/A"}</p>
      </div>
    );

  jutsu?.kekkei_genkai &&
    jutsu?.kekkei_genkai.length > 0 &&
    renderedItems.push(
      <div className="flex flex-col items-center md:block">
        <h2 className="text-2xl font-medium mb-2">Kekkei Genkai</h2>
        {jutsu?.kekkei_genkai.map((kekkei) => (
          <div key={kekkei.id} className="flex items-center gap-2">
            <p>{kekkei.name}</p>
            <img
              src={`http://localhost:1337${kekkei.image.url}`}
              className="h-5"
              alt=""
            />
          </div>
        ))}
      </div>
    );

  if (renderedItems.length % 2 !== 0) {
    const lastElement = renderedItems.pop();
    renderedItems.push(<div className="col-span-2">{lastElement}</div>);
  }

  return (
    <div>
      <div className="flex flex-col lg:flex-row items-center">
        <div className="p-6 flex flex-col gap-6 w-full h-full">
          <h1 className="text-5xl font-bold text-center">{jutsu?.name}</h1>
          <p className="text-center lg:text-left text-lg leading-relaxed">
            {jutsu?.description}
          </p>
          <div
            className={`grid grid-cols-2 ${
              renderedItems.length % 2 !== 0 ? "gap-6" : "gap-3"
            } lg:gap-3 justify-center md:flex md:justify-evenly`}
          >
            {renderedItems}
          </div>
        </div>
        {jutsu?.images && (
          <div className="overflow-hidden relative w-full h-full">
            <div className="flex w-full h-full">
              {jutsu?.images.map((image) => (
                <div
                  key={image.id}
                  className="min-w-full min-h-full transition-all duration-500 relative"
                  style={{ transform: `translateX(-${slide * 100}%)` }}
                >
                  <img
                    src={"http://localhost:1337" + image.url}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                  {image.caption && (
                    <div className="absolute top-0 left-0 right-0 p-4 bg-black bg-opacity-50 transition-all flex items-center justify-center">
                      <p className="text-white text-lg text-center">
                        {image.caption}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {jutsu?.images.length !== 1 && (
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
        )}
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] px-6 pb-6 gap-6 justify-center">
        {jutsu?.parent_jutsu.length !== 0 && (
          <div className="flex flex-col gap-4 w-full">
            <h2 className="my-6 pb-3 text-2xl text-center font-medium border-b-2 border-[#313131]">
              Parent Jutsu
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-4 w-full">
              {jutsu?.parent_jutsu.map((parent) => (
                <Link
                  href={`/jutsus/${parent.documentId}`}
                  key={parent.documentId}
                  className="relative group w-full"
                >
                  <img
                    src={`http://localhost:1337${parent.images[0].url}`}
                    alt={parent.name}
                    className="w-full h-40 md:h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-100 group-hover:opacity-0 transition-all flex items-center justify-center">
                    <p className="text-white text-lg text-center">
                      {parent.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        {jutsu?.derived_jutsu.length !== 0 && (
          <div className="flex flex-col gap-4 w-full">
            <h2 className="my-6 pb-3 text-2xl text-center font-medium border-b-2 border-[#313131]">
              Derived Jutsu
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-4 w-full">
              {jutsu?.derived_jutsu.map((derived) => (
                <Link
                  href={`/jutsus/${derived.documentId}`}
                  key={derived.documentId}
                  className="relative group w-full"
                >
                  <img
                    src={`http://localhost:1337${derived.images[0].url}`}
                    alt={derived.name}
                    className="w-full h-40 md:h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-100 group-hover:opacity-0 transition-all flex items-center justify-center">
                    <p className="text-white text-lg text-center">
                      {derived.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        {jutsu?.users.length !== 0 && (
          <div className="flex flex-col gap-4">
            <h2 className="my-6 pb-3 text-2xl text-center font-medium border-b-2 border-[#313131]">
              Users
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-4">
              {jutsu?.users.map((user) => (
                <Link
                  href={`/characters/${user.documentId}`}
                  key={user.documentId}
                  className="relative group"
                >
                  <img
                    src={`http://localhost:1337${
                      user.images[user.images.length - 1].url
                    }`}
                    alt={user.name}
                    className="w-full h-40 md:h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-100 group-hover:opacity-0 transition-all flex items-center justify-center">
                    <p className="text-white text-lg text-center">
                      {user.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <div></div>
    </div>
  );
};

export default Jutsu;
