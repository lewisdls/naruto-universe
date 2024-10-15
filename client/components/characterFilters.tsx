import { getClans, getVillages } from "@/api/global";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { Input } from "./ui/input";

interface FiltersProps {
  onFilterChange: (selectedFilters: {
    clans: string[];
    affiliations: string[];
    name: string;
  }) => void;
}

interface Clan {
  id: number;
  attributes: {
    name: string;
  };
}

interface Affiliation {
  id: number;
  attributes: {
    name: string;
  };
}

const CharacterFilters = ({ onFilterChange }: FiltersProps) => {
  const [selectedClans, setSelectedClans] = useState<string[]>([]);
  const [selectedAffiliations, setSelectedAffiliations] = useState<string[]>(
    []
  );
  const [name, setName] = useState("");
  const [clans, setClans] = useState<Clan[]>([]);
  const [affiliations, setAffiliations] = useState<Affiliation[]>([]);

  // Fetch clans and villages from Strapi
  useEffect(() => {
    const fetchClans = async () => {
      try {
        const res = await getClans();
        setClans(res.data);
      } catch (error) {
        console.error("Error fetching clans: ", error);
      }
    };

    const fetchVillages = async () => {
      try {
        const res = await getVillages();
        setAffiliations(res.data);
      } catch (error) {
        console.error("Error fetching villages: ", error);
      }
    };

    fetchClans();
    fetchVillages();
  }, []);

  const handleClanChange = (clan: string) => {
    setSelectedClans((prevClans) =>
      prevClans.includes(clan)
        ? prevClans.filter((c) => c !== clan)
        : [...prevClans, clan]
    );
  };

  const handleVillageChange = (affiliation: string) => {
    setSelectedAffiliations((prevVillages) =>
      prevVillages.includes(affiliation)
        ? prevVillages.filter((a) => a !== affiliation)
        : [...prevVillages, affiliation]
    );
  };

  // Debounce filter changes and avoid infinite loops
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFilterChange({
        clans: selectedClans,
        affiliations: selectedAffiliations,
        name: name,
      });
    }, 300); // Delay the update by 300ms to debounce

    return () => clearTimeout(timeoutId); // Clear the timeout if the effect is cleaned up
  }, [selectedClans, selectedAffiliations, name]);

  return (
    <div className="flex flex-col py-4 px-8">
      <h1 className="font-semibold text-2xl">Filters</h1>
      <Input
        placeholder="Name"
        className="my-4"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-xl">Clans</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            {clans.map((clan) => (
              <div key={clan.id} className="flex items-center gap-1 w-max">
                <Checkbox
                  id={clan.attributes.name.toLowerCase()}
                  checked={selectedClans.includes(clan.attributes.name)}
                  onCheckedChange={() => handleClanChange(clan.attributes.name)}
                />
                <label
                  htmlFor={clan.attributes.name.toLowerCase()}
                  className="text-base leading-none"
                >
                  {clan.attributes.name}
                </label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-xl">Villages</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            {affiliations.map((affiliation) => (
              <div key={affiliation.id} className="flex items-center gap-1">
                <Checkbox
                  id={affiliation.attributes.name.toLowerCase()}
                  checked={selectedAffiliations.includes(
                    affiliation.attributes.name
                  )}
                  onCheckedChange={() =>
                    handleVillageChange(affiliation.attributes.name)
                  }
                />
                <label
                  htmlFor={affiliation.attributes.name.toLowerCase()}
                  className="text-base leading-none"
                >
                  {affiliation.attributes.name}
                </label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default CharacterFilters;
