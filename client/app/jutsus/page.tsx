"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getJutsus } from "@/api/global";
import JutsuFilters from "@/components/jutsuFilters";
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
  attributes: {
    url: string;
  };
}

interface NatureData {
  id: number;
  attributes: {
    name: string;
  };
}
interface KekkeiData {
  id: number;
  attributes: {
    name: string;
  };
}

interface ClassificationData {
  id: number;
  attributes: {
    name: string;
  };
}

interface Jutsu {
  id: number;
  attributes: {
    name: string;
    nature: {
      data: NatureData[];
    };
    kekkei_genkai: {
      data: KekkeiData[];
    };
    classification: {
      data: ClassificationData[];
    };
    images: {
      data: ImageData[];
    };
  };
}

const Jutsus = () => {
  const [jutsus, setJutsus] = useState<Jutsu[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredJutsus, setFilteredJutsus] = useState<Jutsu[]>([]);
  const [filters, setFilters] = useState<{
    natures: string[];
    kekkeiGenkais: string[];
    classifications: string[];
    name: string;
  }>({
    natures: [],
    kekkeiGenkais: [],
    classifications: [],
    name: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredJutsus.length / itemsPerPage);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await getJutsus();
        setJutsus(res.data);
      } catch (error) {
        console.log("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    // Filter the jutsus based on selected natures and kekkei genkais
    const filtered = jutsus.filter((jutsu) => {
      const matchesNature =
        filters.natures.length === 0 ||
        jutsu.attributes.nature.data.some(
          (nature: { attributes: { name: string } }) =>
            filters.natures.includes(nature.attributes.name)
        );
      const matchesKekkeiGenkai =
        filters.kekkeiGenkais.length === 0 ||
        jutsu.attributes.kekkei_genkai.data.some(
          (kekkeiGenkai: { attributes: { name: string } }) =>
            filters.kekkeiGenkais.includes(kekkeiGenkai.attributes.name)
        );
      const matchesClassification =
        filters.classifications.length === 0 ||
        jutsu.attributes.classification.data.some(
          (classification: { attributes: { name: string } }) =>
            filters.classifications.includes(classification.attributes.name)
        );
      const matchesName =
        filters.name === "" ||
        jutsu.attributes.name
          .toLowerCase()
          .includes(filters.name.toLowerCase());
      return (
        matchesNature &&
        matchesKekkeiGenkai &&
        matchesClassification &&
        matchesName
      );
    });
    setFilteredJutsus(filtered);
  }, [filters, jutsus]);

  const handleFilterChange = (selectedFilters: {
    natures: string[];
    kekkeiGenkais: string[];
    classifications: string[];
    name: string;
  }) => {
    setFilters(selectedFilters);
    setCurrentPage(1);
  };

  const paginatedJutsus = filteredJutsus.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const generatePaginationItems = () => {
    const items = [];
    const totalPages = Math.ceil(filteredJutsus.length / itemsPerPage);

    if (totalPages <= 20) {
      // If total pages are less than or equal to 5, show all pages
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={() => setCurrentPage(i)}
              className={`cursor-pointer ${
                i === currentPage ? "bg-white text-black" : ""
              }`}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // More than 5 pages, show a subset
      const showEllipsisLeft = currentPage > 3;
      const showEllipsisRight = currentPage < totalPages - 2;

      // Left side pagination
      if (showEllipsisLeft) {
        items.push(
          <PaginationItem key={1}>
            <PaginationLink
              href="#"
              onClick={() => {
                setCurrentPage(1);
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              className={`cursor-pointer ${
                1 === currentPage ? "bg-white text-black" : ""
              }`}
            >
              1
            </PaginationLink>
          </PaginationItem>
        );
        if (showEllipsisLeft) {
          items.push(<PaginationEllipsis key="ellipsis-left" />);
        }
      }

      // Middle pagination
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => {
                setCurrentPage(i);
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              className={`cursor-pointer ${
                i === currentPage ? "bg-white text-black" : ""
              }`}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Right side pagination
      if (showEllipsisRight) {
        if (showEllipsisRight) {
          items.push(<PaginationEllipsis key="ellipsis-right" />);
        }
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => {
                setCurrentPage(totalPages);
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              className={`cursor-pointer ${
                totalPages === currentPage ? "bg-white text-black" : ""
              }`}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  const array = new Array(10).fill(null);

  return (
    <div className="flex flex-col md:flex-row">
      <JutsuFilters onFilterChange={handleFilterChange} />
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
          ) : paginatedJutsus.length > 0 ? (
            paginatedJutsus.map((jutsu: Jutsu) => (
              <Link
                href={`/jutsus/${jutsu.id}`}
                key={jutsu.id}
                className="flex flex-col border-[#242424] border-[1px] rounded-md w-fit"
              >
                {jutsu.attributes.images.data && (
                  <div className="md:h-[250px] w-full">
                    <img
                      src={`http://localhost:1337${
                        jutsu.attributes.images.data[
                          jutsu.attributes.images.data.length - 1
                        ].attributes.url
                      }`}
                      alt={jutsu.attributes.name}
                      className="object-cover w-full h-full rounded-t-md"
                    />
                  </div>
                )}
                <div className="p-3">
                  <p className="font-medium text-lg text-center lg:text-left">
                    {jutsu.attributes.name}
                  </p>
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
                className="cursor-pointer"
                onClick={() => {
                  setCurrentPage((prev) => Math.max(prev - 1, 1));
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              />
            </PaginationItem>
            {generatePaginationItems()}
            <PaginationItem>
              <PaginationNext
                className="cursor-pointer"
                onClick={() => {
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default Jutsus;
