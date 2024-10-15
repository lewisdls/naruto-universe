"use client";

import { getHeader } from "@/api/global";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface Header {
  attributes: {
    title: string;
    subtitle: string;
    image: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
  };
}

export default function Home() {
  const [header, setHeader] = useState<Header | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await getHeader();
        setHeader(res.data);
      } catch (error) {
        console.log("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div>
      {loading ? (
        <div className="h-[calc(100vh-3.5rem)]">
          <div className="h-full w-full flex flex-col items-center justify-center gap-2">
            <div className="flex flex-col gap-3 items-center">
              <Skeleton className="h-8 w-[350px]" />
              <Skeleton className="h-4 w-[500px]" />
            </div>
            <div className="flex gap-2 items-center mt-4">
              <Skeleton className="h-8 w-[200px]" />
              <Skeleton className="h-8 w-[200px]" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
          <div className="relative h-full w-full after:absolute after:top-0 after:left-0 after:w-full after:h-full after:bg-black after:opacity-50">
            <img
              src={`http://localhost:1337${header?.attributes.image.data.attributes.url}`}
              alt=""
              className={`h-full w-full object-cover transition-all duration-500 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
          <div
            className={`p-4 absolute flex flex-col items-center justify-center text-center gap-3 transition-all duration-500 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <h1 className="text-6xl font-bold">{header?.attributes.title}</h1>
            <p className="text-xl">{header?.attributes.subtitle}</p>
            <div className="flex items-center gap-3 mt-4">
              <Link
                href="/characters"
                className="bg-yellow-600 px-5 py-2 rounded-md text-lg font-medium"
              >
                View characters
              </Link>
              <Link
                href="/jutsus"
                className="px-5 py-2 rounded-md text-lg font-medium border-white border-[1px]"
              >
                View jutsus
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
