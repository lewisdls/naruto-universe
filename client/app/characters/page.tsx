"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCharacters } from "@/api/global";
import Filters from "@/components/characterFilters";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { MdError } from "react-icons/md";

interface ImageData {
  id: number;
  url: string;
}

interface NatureData {
  id: number;
  name: string;
}

interface VillageData {
  id: number;
  name: string;
}

interface Character {
  documentId: string;
  name: string;
  clan: {
    name: string;
  };
  nature: NatureData[];
  affiliations: VillageData[];
  images: ImageData[];
}

const Characters = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
  const [filters, setFilters] = useState<{
    clans: string[];
    affiliations: string[];
    name: string;
  }>({
    clans: [],
    affiliations: [],
    name: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredCharacters.length / itemsPerPage);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await getCharacters();
        setCharacters(res.data);
      } catch (error) {
        console.log("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  console.log(filters);

  useEffect(() => {
    // Filter the characters based on selected clans and affiliations
    const filtered = characters.filter((character) => {
      const matchesClan =
        filters.clans.length === 0 ||
        filters.clans.includes(character.clan?.name);
      const matchesVillage =
        filters.affiliations.length === 0 ||
        character.affiliations.some((affiliation: { name: string }) =>
          filters.affiliations.includes(affiliation.name)
        );
      const matchesName =
        filters.name === "" ||
        character.name.toLowerCase().includes(filters.name.toLowerCase());
      return matchesClan && matchesVillage && matchesName;
    });
    setFilteredCharacters(filtered);
  }, [filters, characters]);

  const handleFilterChange = (selectedFilters: {
    clans: string[];
    affiliations: string[];
    name: string;
  }) => {
    setFilters(selectedFilters);
    setCurrentPage(1);
  };

  const paginatedCharacters = filteredCharacters.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const array = new Array(10).fill(null);

  return (
    <div className="flex flex-col md:flex-row">
      <Filters onFilterChange={handleFilterChange} />
      <div className="p-6 flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {loading ? (
            array.map((_, i) => (
              <Link href="" key={i} className="flex flex-col rounded-md w-fit">
                <div className="h-[250px] w-[225px]">
                  <Skeleton className="w-full h-full" />
                </div>
                <div className="my-3">
                  <Skeleton className="h-5 w-full" />
                </div>
              </Link>
            ))
          ) : paginatedCharacters.length > 0 ? (
            paginatedCharacters.map((character: Character) => (
              <Link
                href={`/characters/${character.documentId}`}
                key={character.documentId}
                className="flex flex-col border-[#242424] border-[1px] rounded-md w-full"
              >
                <div className="xl:h-[250px] w-full">
                  <img
                    src={character.images[character.images.length - 1].url}
                    alt={character.name}
                    className="object-cover w-full h-full rounded-t-md"
                  />
                </div>
                <div className="p-3">
                  <p className="font-medium text-lg">{character.name}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="bg-red-200 text-red-600 py-2 px-3 rounded-lg flex items-center gap-2">
              <MdError /> No matches
            </p>
          )}
        </div>
        <Pagination className="mt-6 justify-center md:justify-start">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  setCurrentPage(
                    currentPage === 1 ? currentPage : currentPage - 1
                  )
                }
                href="#"
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    onClick={() => setCurrentPage(pageNumber)}
                    className={
                      pageNumber === currentPage ? "bg-white text-black" : ""
                    }
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage(
                    currentPage === totalPages ? currentPage : currentPage + 1
                  )
                }
                href="#"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default Characters;
